import React from 'react'
import { Observable } from 'rx'
import { mapProps, mapPropsStream, setObservableConfig, compose } from 'recompose'
import rxjs4config from 'recompose/rxjs4ObservableConfig'

setObservableConfig(rxjs4config)

const getWindowDimensions = mapPropsStream(props$ => {
  const dimensions$ = Observable
    .fromEvent(window, 'resize')
    .map(e => ({ width: e.target.innerWidth, height: e.target.innerHeight }))
    .startWith({ width: window.innerWidth, height: window.innerHeight})
  return props$.combineLatest(dimensions$, (props, values) => ({
    ...props,
    values
  }))
})

const spreadProps = mapProps(({ values }) => ({
  height: values.height,
  width: values.width
}))

const component = ({ width, height }) =>
  <div style={{ width: '100vw', height: '50vh', backgroundColor: `rgb(${width}, ${height}, ${width - height})`}}>
    <small>Make me smaller and the screen will start to turn yellow...ooooohhhhhh aaaaahhhhhhhh</small>
    <h1>This is with the help of recompse! Yay!</h1>
    <div>{width}</div>
    <div>{height}</div>
  </div>

const dimensions = compose(
  getWindowDimensions,
  spreadProps
)(component)


export default dimensions
