import React from 'react'
import { mapProps, componentFromProp, compose } from 'recompose'
import R from 'ramda'

import { windowDimensions, connectComponent, getData, spinnerWhileLoading } from '~/hocs'
import HeatMap from '~/components/HeatMap'

const enhance = compose(
  windowDimensions,
  connectComponent,
  getData,
  mapProps(({ data, ...props}) => ({ ...data, ...props})),
  spinnerWhileLoading(({ data }) => !R.isEmpty(data)),
)
const Component = componentFromProp('chart')

export default enhance(props =>
  // This is the same as <HeatMap {...props} />
  <Component chart={HeatMap} {...props} />
)
