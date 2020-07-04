import React from 'react';

import './App.scss';

const AdaWidgetSDK = require("@ada-support/ada-widget-sdk");
const widgetSDK = new AdaWidgetSDK();

class App extends React.Component<{}, {}> {
  componentDidMount() {
    widgetSDK.init((event: any) => {
      console.log(event);
      // Perform additional setup steps in here.
      // event will be one of `WIDGET_INITIALIZED` or `WIDGET_INITIALIZATION_FAILED`
    });
  }

  onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    console.log(e.currentTarget.files && e.currentTarget.files[0]);
  };

  render() {
    return (
      <div>
        <label htmlFor='file' className='custom-file-upload'>
          <input type='file' name='file' id='file' onChange={this.onChangeHandler}/>
          Upload File
        </label>
      </div>
    );
  }
}

export default App;
