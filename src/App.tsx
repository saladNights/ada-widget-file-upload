import React from 'react';
import axios from 'axios';
import { apiUrl } from './config';

import './App.scss';

const AdaWidgetSDK = require("@ada-support/ada-widget-sdk");
const widgetSDK = new AdaWidgetSDK();

interface IState {
  getUrl?: string;
  errorMsg?: string;
}

class App extends React.Component<{}, IState> {
  state = {
    getUrl: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    try {
      widgetSDK.init((event: any) => {
        console.log(event);
      });
    }
    
    catch (e) {
      console.error('ADA SDK could not be initialized');
      this.setState({ errorMsg: 'ADA SDK could not be initialized' });
    }
  }

  onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.currentTarget.files && e.currentTarget.files[0];

    if (file) {
      const fileName = file.name;
      const contentType = file.type;
      const options = {
        params: {
          // TODO there should be some user specific data. send it to server also
          // Key: `user/${fileName}`,
          Key: fileName,
          ContentType: contentType
        },
        headers: {
          'Content-Type': contentType
        }
      };

      axios.get(
        `${apiUrl}/presigned-url-put-object`,
        options,
      )
        .then((response) => {
          axios.put(response.data.url, file, options)
            .then(res => {
              this.generateGetUrl(fileName, res.headers['x-amz-version-id']);
              this.sendDataToADA(file, res.headers['x-amz-version-id']);
            })
            .catch((error) => {
              console.log(error);
            })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  generateGetUrl = (Key: string, s3Key: string) => {
    const options = {
      params: {
        Key,
        s3Key,
      }
    };

    axios.get(`${apiUrl}/presigned-url-get-object`, options)
      .then((res) => {
        this.setState({ getUrl: res.data.url });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  sendDataToADA = (file: File, key: string) => {
    if (widgetSDK.widgetIsActive) {
      console.log('send to ADA', file, key);
      widgetSDK.sendUserData({
        fileData: file,
        s3Key: key
      }, (event: any) => {
        console.log('successfully sent');
        console.log(event);
      });
    }
  };

  render() {
    const { getUrl, errorMsg } = this.state;
    return (
      <div className='wrapper'>
        <label htmlFor='file' className='custom-file-upload'>
          <input type='file' name='file' id='file' onChange={this.onChangeHandler}/>
          Upload File
        </label>
        {errorMsg && (<div className='error'>{errorMsg}</div>)}
        {getUrl && (<a href={getUrl} target='_blank' rel='noopener noreferrer' className='download-link'>Download</a>)}
      </div>
    );
  }
}

export default App;
