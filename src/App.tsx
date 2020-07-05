import React from 'react';
import axios from 'axios';

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
        // Perform additional setup steps in here.
        // event will be one of `WIDGET_INITIALIZED` or `WIDGET_INITIALIZATION_FAILED`
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
          Key: `user/${fileName}`,
          ContentType: contentType
        },
        headers: {
          'Content-Type': contentType
        }
      };

      axios.get(
        'http://localhost:3001/presigned-url-put-object',
        options,
      )
        .then((response) => {
          axios.put(response.data.url, file, options)
            .then(res => {
              console.log(res);
              this.generateGetUrl(fileName);
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

  generateGetUrl = (fileName: string) => {
    const options = {
      params: {
        Key: fileName,
      }
    };

    axios.get('http://localhost:3001/presigned-url-get-object', options)
      .then((res) => {
        // TODO send link to ADA
        this.setState({ getUrl: res.data.url });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { errorMsg } = this.state;
    return (
      <div className='wrapper'>
        <label htmlFor='file' className='custom-file-upload'>
          <input type='file' name='file' id='file' onChange={this.onChangeHandler}/>
          Upload File
        </label>
        {errorMsg && (<div className='error'>{errorMsg}</div>)}
        {/* for testing */}
        {/*{getUrl && (<a href={getUrl} target='_blank' rel='noopener noreferrer'>Download</a>)}*/}
      </div>
    );
  }
}

export default App;
