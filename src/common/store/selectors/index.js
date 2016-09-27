import { createSelector } from 'reselect'

const getData = name => state => state.store[name]
export const getResource = name => createSelector(
  [ getData(name) ],
  data => data
)
