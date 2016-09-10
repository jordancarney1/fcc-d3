import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import App from './App'
import BarChart from '~/components/BarChart'

export default class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Route path='/' component={App} />
            <Route path='/bar-chart' component={BarChart} />
          </Router>
        </div>
      </Provider>
    )
  }
}
