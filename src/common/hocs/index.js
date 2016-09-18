import { Observable } from 'rx'
import { mapPropsStream, setObservableConfig } from 'recompose'
import rxjs4config from 'recompose/rxjs4ObservableConfig'

setObservableConfig(rxjs4config)

export const windowDimensions = mapPropsStream(props$ => {
  const dimensions$ = Observable
    .fromEvent(window, 'resize')
    .map(e => ({ width: e.target.innerWidth, height: e.target.innerHeight }))
    .startWith({ width: window.innerWidth, height: window.innerHeight})
  return props$.combineLatest(dimensions$, (props, values) => ({
    ...props,
    window: {...values}
  }))
})
