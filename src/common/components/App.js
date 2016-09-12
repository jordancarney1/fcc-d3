import React from 'react'
import { Link } from 'react-router'

import ElmComponent from './ElmComponent'

export default function App() {
  return (
    <div>
      {/* One day...<ElmComponent /> */}
      <ul>
        <li><Link to='/bar-chart'>Bar Chart</Link></li>
      </ul>
    </div>
  )
}
