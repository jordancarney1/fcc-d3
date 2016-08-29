import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import './main.css'

require('es6-promise').polyfill();
require('isomorphic-fetch');

const URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

class App extends Component {

  constructor () {
    super()
    this.state = {
      data: {}
    }
  }

  componentDidMount () {
    fetch(URL)
      .then(res => res.json())
      .then(data => this.setState({data}))
  }

  render () {
    return <div>React and D3!</div>
  }
}


const dataSet = [1, 2, 3, 4, 5, 6]

d3.select('body')
  .selectAll('div')
  .data(dataSet)
  .enter()
  .append('div')
  .attr('class', 'bar')
  .style('height', d => d * 5 + 'px')

render(<App />, document.getElementById('root'))
