import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import BarChart from './components/BarChart'

export default (
  <Route path="/" component={App}>
    <Route path="/bar-chart" component={BarChart} />
  </Route>
)
