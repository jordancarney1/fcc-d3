import React, { Component } from 'react'
import { Link } from 'react-router'

export default class App extends Component {

  render() {
    return (
      <div>
        <ul>
          <li><Link to='/bar-chart'>Bar Chart</Link></li>
        </ul>
      </div>
    )
  }
}
