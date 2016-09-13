import React from 'react'
import { Route } from 'react-router'

import App from './components/App'
import BarChart from './containers/BarChart'

export default (
  <Route path="/" component={App}>
    <Route path="/bar-chart" component={BarChart} />
  </Route>
)
