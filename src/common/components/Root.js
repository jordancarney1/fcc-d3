import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import routes from '~/routes'

export default function Root({ store, history }) {
  return (
    <Provider store={store}>
      <div>
        <Router history={history} routes={routes} />
      </div>
    </Provider>
  )
}

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
}
