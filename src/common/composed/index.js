import React from 'react'
import { mapProps, compose } from 'recompose'

import * as hoc from '../hocs'

// Window Dimensions HOC
const dimensionProps = mapProps(props => ({
  h: props.values.height,
  w: props.values.width,
  ...props
}))

const component = props =>
  <div>{props.h} and {props.w}</div>

const enhance = compose(
  hoc.windowDimensions,
  dimensionProps
)

export const Dimensions = enhance(component)
