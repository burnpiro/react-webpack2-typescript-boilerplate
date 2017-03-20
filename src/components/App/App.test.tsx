// empty import but typescript knows types for jest that way
import {} from 'jest'

import * as React from 'react'
import App from './App'
import { renderComponent } from '../../helpers/test-helper'

describe('App', function () {
  it('renders without crashing', () => {
    const { component } = renderComponent(App)
  })
})
