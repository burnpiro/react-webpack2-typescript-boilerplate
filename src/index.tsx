import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './components'
import {AppContainer} from 'react-hot-loader'

const mountApp = document.getElementById('root')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    mountApp
  )
}

render(App)

if (module.hot) {
  // undefined because we want to accept all changes
  module.hot.accept(undefined, () => { render(App) })
}
