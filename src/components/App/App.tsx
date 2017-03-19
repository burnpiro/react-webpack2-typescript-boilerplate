import * as React from 'react';
import * as style from './style.css'

interface AppProps {
}

interface AppState {
}

class App extends React.Component<AppProps, AppState>{
  render() {
    return (
      <div className={style.normal}>
        <h1>Test2</h1>
      </div>
    );
  }
}

export default App
