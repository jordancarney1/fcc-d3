import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Observable } from 'rx'
import { mapPropsStream, setObservableConfig, branch, renderComponent } from 'recompose'
import { fetchDataIfNeeded } from '~/store/actions'
import rxjs4config from 'recompose/rxjs4ObservableConfig'
import Spinner from 'react-spinkit'

import * as selectors from '~/store/selectors'

require('es6-promise').polyfill()
require('isomorphic-fetch')

setObservableConfig(rxjs4config)

// What each chart maps to in regards to the FCC data endpoint
const URI_CONFIG = {
  'heat-map': 'global-temperature'
}

// Emits an observable of window dimensions
// This needs to be updated to emit margins based on window dimensions
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

// This is a promise that fetches data
// It will also store the data in either localStorage or sessionStorage
const fetchDataSet = resource =>
  new Promise((resolve, reject) => {
    if (!window[resource.storage].getItem(resource.name)) {
      fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/${resource.name}.json`)
        .then(res => res.json())
        .then(dataObject => {
          const stringObject = JSON.stringify(dataObject)
          window[resource.storage].setItem(resource.name, stringObject)
          resolve(dataObject)
        })
        .catch(err => reject(err))
    } else {
      const dataObject = JSON.parse(window[resource.storage].getItem(resource.name))
      resolve(dataObject)
    }
  })

// Emits an Observable from a promise
export const fetchData = resource => mapPropsStream(props$ => {
  const promise$ = Observable.fromPromise(fetchDataSet(resource))
  return props$.combineLatest(promise$, (props, data) => ({
    ...props,
    data
  }))
})

// Styles for the spinner below
const styles = {
  spinner: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

// A named component that takes from the react-spinkit library
const SpinnerThreeBounce = () =>
  <div style={styles.spinner}>
    <Spinner spinnerName="three-bounce" noFadeIn />
  </div>

// This is the HOC that will render either the Spinner or BaseComponent based on a hasLoaded condition
export const spinnerWhileLoading = hasLoaded =>
  branch(
    hasLoaded,
    t => t,
    renderComponent(SpinnerThreeBounce)
  )

// This is a HOC that works with the Redux store
// This allows us to abstract away using lifecycle methods in our BaseComponent
export const getData = WrappedComponent =>
  class extends Component {

    componentDidMount() {
      const { dispatch, params } = this.props
      const { slug } = params
      dispatch(fetchDataIfNeeded(slug, URI_CONFIG[slug]))
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

const mapStateToProps = (state, props) => {
  const { params } = props
  const { slug } = params
  const getResource = selectors.getResource(slug)
  return {
    data: getResource(state)
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

// This is the HOC that encompases all that the getData HOC needs from the store
export const connectComponent = connect(mapStateToProps, mapDispatchToProps)
