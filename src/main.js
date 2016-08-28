import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import styles from './main.css'

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
    return <div className={styles.main}>Hello, world!</div>
  }
}

d3.select('body').append('p').text('New paragraph!')

render(<App />, document.getElementById('root'))
