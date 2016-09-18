import { createSelector } from 'reselect'
import R from 'ramda'

const getData = name => state => state.store[name]
export const getResource = name => createSelector(
  [ getData(name) ],
  data => data
)
