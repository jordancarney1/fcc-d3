import React from 'react'
import { Observable } from 'rx'
import { mapPropsStream, setObservableConfig } from 'recompose'
import rxjs4config from 'recompose/rxjs4ObservableConfig'

setObservableConfig(rxjs4config)

const Enhance = mapPropsStream(props$ => {
  const dimensions$ = Observable
    .fromEvent(window, 'resize')
    .map(e => ({ width: e.target.innerWidth, height: e.target.innerHeight }))
    .startWith({ width: window.innerWidth, height: window.innerHeight})
  return props$.combineLatest(dimensions$, (props, values) => ({
    ...props,
    values
  }))
})

const Dimensions = Enhance(({ values }) =>
  <div>
    <h1>This is with the help of recompse! Yay!</h1>
    <div>{values.width}</div>
    <div>{values.height}</div>
  </div>
)

export default Dimensions
