import React from 'react'
import { Link } from 'react-router'

export default function App() {
  return (
    <div>
      <ul>
        <li><Link to='/bar-chart'>Bar Chart</Link></li>
        <li><Link to='/scatter-plot'>Scatter Plot</Link></li>
      </ul>
    </div>
  )
}
