export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export const requestData = component => {
  return {
    type: REQUEST_DATA,
    component
  }
}

export const receiveData = (component, data) => {
  return {
    type: RECEIVE_DATA,
    component,
    data
  }
}

const fetchData = (component, type) => {
  return dispatch => {
    dispatch(requestData(component))
    return fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/${type}.json`)
      .then(res => res.json())
      .then(data => {
        dispatch(receiveData(component, data))
      })
      .catch(err => console.log(err))
  }
}

const shouldFetchData = (state, component) => {
  if (!state.store[component]) return true
  if (!state.store[component].data) return true
  if (state.store[component].fetching) return false
  return false
}

export const fetchDataIfNeeded = (component, type) => {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), component)) {
      return dispatch(fetchData(component, type))
    }
  }
}
