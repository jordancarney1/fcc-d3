import React, { PropTypes } from 'react'
import { compose } from 'recompose'
import R from 'ramda'

import { windowDimensions, fetchData, spinnerWhileLoading } from '~/hocs'

const enhance = compose(
  windowDimensions,
  fetchData({ name: 'GDP-data', storage: 'localStorage' }),
  spinnerWhileLoading(({ data }) => !R.isEmpty(data))
)
const BarChart = enhance(({ data, window }) => {
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
})

BarChart.defaultProps = {
  data: {}
}


BarChart.propTypes = {
  data: PropTypes.object
}

export default BarChart
