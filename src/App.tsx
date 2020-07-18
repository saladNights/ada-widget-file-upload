import React from 'react';
import axios from 'axios';

import { apiUrl } from './config';
import { getFileExtension } from './helpers';

import styles from './App.module.scss';

const AdaWidgetSDK = require('@ada-support/ada-widget-sdk');
const widgetSDK = new AdaWidgetSDK();

interface IState {
  isLoading: boolean;
  isActive: boolean;
  s3AccessKeyId: string;
  s3UrlExpire: number;
  s3SecretAccessKey: string;
  bucketName: string;
  errorMsgs: {
    [key: string]: string;
  };
  errors: string[];
  validationErrors: string[];
  maxFileSize: number;
  allowedFileExtensions: string[];
  uploadPath: string;
}

class App extends React.Component<any, IState> {
  state = {
    isLoading: false,
    isActive: false,
    s3AccessKeyId: '',
    s3UrlExpire: 86400,
    s3SecretAccessKey: '',
    bucketName: '',
    errorMsgs: {
      initialized: 'ADA SDK could not be initialized',
    },
    errors: [],
    validationErrors: [],
    maxFileSize: 10,
    allowedFileExtensions: [],
    uploadPath: '',
  };

  componentDidMount() {
    const { errorMsgs } = this.state;

    try {
      widgetSDK.init((event: any) => {
        if (event.type === 'WIDGET_INITIALIZED') {
          this.setState({
            isActive: true,
            s3AccessKeyId: event.metaData?.s3_access_key_id,
            s3UrlExpire: +event.metaData?.s3_url_expire || 86400,
            s3SecretAccessKey: event.metaData?.s3_secret_access_key,
            bucketName: event.metaData?.bucket_name,
            uploadPath: event.metaData?.upload_path || event.metaData?.chatterToken || 'uploads',
            maxFileSize: +event.metaData?.max_file_size || 10,
            allowedFileExtensions: event.metaData?.allowed_file_extensions?.split(', ') || [],
            errorMsgs: {
              ...errorMsgs,
              maxFileSize:
                event.metaData?.max_file_size_msg ||
                `File size should be less than ${+event.metaData?.max_file_size || 10} Mb`,
              allowedFileExtensions:
                event.metaData?.allowed_file_extensions_msg ||
                `File extension should be one of the list: ${event.metaData?.allowed_file_extensions}`,
            },
          });
        }
      });
    } catch (e) {
      this.setState({
        errors: ['initialized'],
      });
    }
  }

  componentDidUpdate(prevProps: any, prevState: IState) {
    if (!widgetSDK.widgetIsActive && prevState.isActive) this.setState({ isActive: false });
  }

  isFileValid = (file: File) => {
    const { maxFileSize, allowedFileExtensions }: { maxFileSize: number; allowedFileExtensions: string[] } = this.state;
    const currentErrors = [];

    if (file.size > maxFileSize * 1048576) {
      currentErrors.push('maxFileSize');
    }

    const fileExtension = getFileExtension(file.name);

    if (fileExtension && !allowedFileExtensions.includes(fileExtension)) {
      currentErrors.push('allowedFileExtensions');
    }

    if (currentErrors.length) {
      this.setState({ validationErrors: currentErrors });

      return false;
    } else {
      this.setState({ validationErrors: [] });

      return true;
    }
  };

  onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const { isLoading, isActive } = this.state;
    e.preventDefault();

    if (isLoading || !isActive || !widgetSDK.widgetIsActive) return;

    const file = e.currentTarget.files && e.currentTarget.files[0];

    if (file && this.isFileValid(file)) this.uploadFile(file);
  };

  createGetUrl = async (fileName: string, s3Key: string): Promise<string> => {
    const { s3AccessKeyId, s3UrlExpire, s3SecretAccessKey, bucketName, uploadPath } = this.state;
    const options = {
      params: {
        BucketName: bucketName,
        Key: `${uploadPath}/${fileName}`,
        s3Key,
        s3UrlExpire,
      },
      headers: {
        'X-S3-P-Key': s3AccessKeyId,
        'X-S3-S-Key': s3SecretAccessKey,
      },
    };
    let getUrl = '';

    const { data } = await axios.get(`${apiUrl}/presigned-url-get-object`, options);

    if (data.url) getUrl = data.url;

    return getUrl;
  };

  uploadFile = async (file: File) => {
    const { s3AccessKeyId, s3UrlExpire, s3SecretAccessKey, bucketName, uploadPath } = this.state;
    const fileName = file.name;
    const contentType = file.type;
    const options = {
      params: {
        BucketName: bucketName,
        Key: `${uploadPath}/${fileName}`,
        ContentType: contentType,
        s3UrlExpire,
      },
      headers: {
        'Content-Type': contentType,
        'X-S3-P-Key': s3AccessKeyId,
        'X-S3-S-Key': s3SecretAccessKey,
      },
    };

    this.setState({ isLoading: true });

    try {
      const { data } = await axios.get(`${apiUrl}/presigned-url-put-object`, options);
      try {
        const { headers } = await axios.put(data.url, file, options);
        const presignedDownloadUrl = await this.createGetUrl(fileName, headers['x-amz-version-id']);

        this.sendDataToADA(file, headers['x-amz-version-id'], presignedDownloadUrl);

        this.setState({ isLoading: false });
      } catch (error) {
        console.error(error);
        this.setState({
          isActive: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({
        isActive: false,
        isLoading: false,
      });
    }
  };

  sendDataToADA = (file: File, s3Key: string, presignedDownloadUrl: string) => {
    if (widgetSDK.widgetIsActive) {
      widgetSDK.sendUserData(
        {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          s3Key,
          presignedDownloadUrl,
        },
        () => {
          this.setState({ isActive: false });
        },
      );
    }
  };

  render() {
    const { isLoading, isActive, errorMsgs, errors, validationErrors } = this.state;
    let btnClass = styles.disabledFileUploadBtn;

    if (isActive) btnClass = styles.fileUploadBtn;
    if (isLoading) btnClass = styles.loadingFileUploadBtn;

    return (
      <div className={styles.wrapper}>
        <label htmlFor="file" className={btnClass}>
          <input type="file" name="file" id="file" onChange={this.onChangeHandler} disabled={isLoading || !isActive} />
          <span className={styles.btnText}>Upload File</span>
          {isLoading && <div className={styles.loadingSpinner} />}
        </label>
        <div className={styles.errorsWrapper}>
          {errors.map((error) => (
            <div key={error} className={styles.error}>
              {errorMsgs[error]}
            </div>
          ))}
          {validationErrors.map((error) => (
            <div key={error} className={styles.error}>
              {errorMsgs[error]}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
