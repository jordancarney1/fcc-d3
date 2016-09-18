import { Observable } from 'rx'
import { mapPropsStream, setObservableConfig } from 'recompose'
import rxjs4config from 'recompose/rxjs4ObservableConfig'

require('es6-promise').polyfill();
require('isomorphic-fetch');

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

export const fetchData = resource => mapPropsStream(props$ => {
  const promise$ = Observable.fromPromise(
    () => new Promise((resolve, reject) => {
      if (!window.localStorage.getItem(resource.name)) {
        fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/${resource.name}.json`)
          .then(res => res.json())
          .then(dataObject => {
            window.localStorage.setItem(resource.name, JSON.stringify(dataObject))
            resolve(dataObject)
          })
          .catch(err => reject(err))
      } else {
        const dataObject = JSON.parse(window.localStorage.getItem(resource.name))
        resolve(dataObject)
      }
    })
  )
  return props$.combineLatest(promise$, (props, data) => ({
    ...props,
    data
  }))
})
