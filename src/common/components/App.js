import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Home from '~/components/Home'

export default function App({ children }) {
  return (
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/bar-chart'>Bar Chart</Link></li>
        <li><Link to='/scatter-plot'>Scatter Plot</Link></li>
      </ul>
      {children || <Home />}
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object
}

App.defaultProps = {
  children: {}
}
