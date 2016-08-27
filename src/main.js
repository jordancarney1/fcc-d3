import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'

class App extends Component {
  render () {
    return <div>Hello, world!</div>
  }
}

d3.select('body').append('p').text('New paragraph!')

render(<App />, document.getElementById('root'))
