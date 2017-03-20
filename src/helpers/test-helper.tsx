import * as React from 'react'
import * as enzyme from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

function renderComponent (ComponentClass, props = {}, state = {}, renderType = 'shallow') {
  const component = enzyme[renderType](
    <MemoryRouter>
      <ComponentClass {...props} />
    </MemoryRouter>
  )

  return {
    component
  }
}

export {renderComponent}
