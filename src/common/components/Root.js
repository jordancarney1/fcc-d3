import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import App from './App'
import BarChart from '~/containers/BarChart'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <Router history={history}>
        <Route path='/' component={App} />
        <Route path='/bar-chart' component={BarChart} />
      </Router>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
}

export default Root
