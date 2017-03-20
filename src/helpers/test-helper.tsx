import * as React from 'react'
import * as enzyme from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

function renderComponent (ComponentClass, props = {}, state = {}, renderType = 'shallow') {
  // we're rendering MemoryRouter because it's requires by routes within our components
  // if you're using 'shallow' rendering you can remove it
  // by using MemoryRouter you can specify routing history ect
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
