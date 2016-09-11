import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import reducers from '~/store/reducers'
import Root from '~/components/Root'

const middleware = [ thunk ]

const store = createStore(
  reducers,
  applyMiddleware(...middleware)
)

render(<Root store={store} history={browserHistory} />,
  document.querySelector('#root')
)
