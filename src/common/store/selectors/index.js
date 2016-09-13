import { createSelector } from 'reselect'
import R from 'ramda'

const barChartData = state => state.store['bar-chart']
export const getBarChartData = createSelector(
  [ barChartData ],
  data => {
    return data
  }
)
