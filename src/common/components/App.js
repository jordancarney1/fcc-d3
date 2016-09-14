import React from 'react'
import { Link } from 'react-router'

import { Dimensions } from '../composed'

export default function App() {
  return (
    <div>
      <Dimensions />
      <ul>
        <li><Link to='/bar-chart'>Bar Chart</Link></li>
      </ul>
    </div>
  )
}
