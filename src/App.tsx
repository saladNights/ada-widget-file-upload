import React from 'react';
import axios from 'axios';

import { apiUrl } from './config';
import { getFileExtension } from './helpers';

import styles from './App.module.scss';

const AdaWidgetSDK = require('@ada-support/ada-widget-sdk');
const widgetSDK = new AdaWidgetSDK();

interface IProps {}

interface IState {
  errorMsgs: {
    [key: string]: string;
  };
  errors: string[];
  validationErrors: string[];
  isLoading: boolean;
  isActive: boolean;
  maxFileSize: number;
  allowedFileExtensions?: Array<string>;
  uploadPath: string;
}

class App extends React.Component<IProps, IState> {
  state = {
    errorMsgs: {
      initialized: 'ADA SDK could not be initialized',
    },
    errors: [],
    validationErrors: [],
    isLoading: false,
    isActive: false,
    maxFileSize: 10,
    allowedFileExtensions: undefined,
    uploadPath: '',
  };

  componentDidMount() {
    const { errorMsgs } = this.state;

    try {
      widgetSDK.init((event: any) => {
        console.log(event);
        if (event.type === 'WIDGET_INITIALIZED') {
          this.setState({
            isActive: true,
            uploadPath: event.metaData?.upload_path || event.metaData?.chatterToken || 'uploads',
            maxFileSize: +event.metaData?.max_file_size || 10,
            allowedFileExtensions: event.metaData?.allowed_file_extensions?.split(', '),
            errorMsgs: {
              ...errorMsgs,
              maxFileSize:
                event.metaData?.max_file_size_msg
                || `File size should be less than ${+event.metaData?.max_file_size || 10} Mb`,
              allowedFileExtensions: event.metaData?.allowed_file_extensions_msg
                || `File extension should be one of the list: ${event.metaData?.allowed_file_extensions}`,
            }
          });
        }
      });
    }

    catch (e) {
      console.error('ADA SDK could not be initialized');
      this.setState({
        errors: ['initialized']
      });
    }
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (!widgetSDK.widgetIsActive && prevState.isActive) this.setState({ isActive: false });

    console.log(this.state);
  }

  isFileVerified = (file: File) => {
    const { maxFileSize, allowedFileExtensions } = this.state;
    const currentErrors = [];

    if (file.size > (maxFileSize * 1048576)) {
      currentErrors.push('maxFileSize');
    }

    if (allowedFileExtensions) {
      const fileExtension = getFileExtension(file.name);

      // @ts-ignore
      if (!allowedFileExtensions.includes(fileExtension)) {
        currentErrors.push('allowedFileExtensions');
      }
    }

    if (currentErrors.length) {
      this.setState({ validationErrors: currentErrors });

      return false;
    } else {
      this.setState({ validationErrors: [] });

      return true;
    }
  }

  onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const { isLoading, isActive } = this.state;
    e.preventDefault();

    if (isLoading || !isActive || !widgetSDK.widgetIsActive) return;

    const file = e.currentTarget.files && e.currentTarget.files[0];

    if (file && this.isFileVerified(file)) this.uploadFile(file);
  };

  uploadFile = (file: File) => {
    const { uploadPath } = this.state;
    const fileName = file.name;
    const contentType = file.type;
    const options = {
      params: {
        Key: `${uploadPath}/${fileName}`,
        ContentType: contentType
      },
      headers: {
        'Content-Type': contentType
      }
    };

    this.setState({ isLoading: true });

    axios.get(
      `${apiUrl}/presigned-url-put-object`,
      options,
    )
      .then((response) => {
        axios.put(response.data.url, file, options)
          .then(res => {
            this.sendDataToADA(file, res.headers['x-amz-version-id']);

            this.setState({ isLoading: false });
          })
          .catch((error) => {
            console.error(error);
          })
      })
      .catch((error) => {
        console.error(error);
      });
  };

  sendDataToADA = (file: File, key: string) => {
    if (widgetSDK.widgetIsActive) {
      widgetSDK.sendUserData({
        fileData: file,
        s3Key: key
      }, (event: any) => {
        this.setState({ isActive: false });
      });
    }
  };

  render() {
    const { errorMsgs, errors, validationErrors, isLoading, isActive } = this.state;
    let btnClass = styles.disabledFileUploadBtn;

    if (isActive) btnClass = styles.fileUploadBtn;
    if (isLoading) btnClass = styles.loadingFileUploadBtn;

    console.log({ errorMsgs, errors, validationErrors });

    return (
      <div className={styles.wrapper}>
        <label
          htmlFor='file'
          className={btnClass}
        >
          <input
            type='file'
            name='file'
            id='file'
            onChange={this.onChangeHandler}
            disabled={isLoading || !isActive}
          />
          <span className={styles.btnText}>Upload File</span>
          {isLoading && (<div className={styles.loadingSpinner} />)}
        </label>
        <div className={styles.errorsWrapper}>
          {errors.map((error) => (
            <div key={error} className={styles.error}>{errorMsgs[error]}</div>
          ))}
          {validationErrors.map((error) => (
            <div key={error} className={styles.error}>{errorMsgs[error]}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
