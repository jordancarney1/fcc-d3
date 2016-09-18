import React from 'react'
import { IndexRoute, Route } from 'react-router'

import App from './components/App'
import Home from './components/Home'
import NoMatch from './components/NoMatch'
import BarChart from './containers/BarChart'
import ScatterPlot from './containers/ScatterPlot'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="bar-chart" component={BarChart} />
    <Route path="scatter-plot" component={ScatterPlot} />
    <Route path="*" component={NoMatch}/>
  </Route>
)
