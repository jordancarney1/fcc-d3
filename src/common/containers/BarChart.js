import React, { PropTypes } from 'react'
import { compose } from 'recompose'

import { windowDimensions, fetchData } from '~/hocs'

const BarChart = ({ data, window }) => {
  const { height, width } = window
  const { source_name } = data
  return (
    <div>
      {source_name}
      <br />
      {height}
      <br />
      {width}
    </div>
  )
}

BarChart.defaultProps = {
  data: {}
}

BarChart.propTypes = {
  data: PropTypes.object
}

export default compose(
  windowDimensions,
  fetchData({ name: 'GDP-data'})
)(BarChart)
