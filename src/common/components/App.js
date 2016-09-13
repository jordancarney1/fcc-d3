import React from 'react'
import { Link } from 'react-router'

import Dimensions from '../hoc/Dimensions'

export default function App() {
  return (
    <div>
      <ul>
        <Dimensions />
        <li><Link to='/bar-chart'>Bar Chart</Link></li>
      </ul>
    </div>
  )
}
