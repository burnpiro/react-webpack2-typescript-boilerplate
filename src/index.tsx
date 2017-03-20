import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './components'
import {AppContainer} from 'react-hot-loader'
import {BrowserRouter} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter history={history}>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  // undefined because we want to accept all changes
  module.hot.accept(undefined, () => { render(App) })
}
