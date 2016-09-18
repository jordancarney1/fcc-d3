import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'

import { fetchDataIfNeeded } from '~/store/actions'
import * as selectors from '~/store/selectors'
import { windowDimensions } from '~/hocs'

const mapStateToProps = state => ({
  data: selectors.getBarChartData(state)
})

const mapDispatchToProps = dispatch => ({
  fetchData() {
    dispatch(fetchDataIfNeeded('bar-chart', 'GDP-data'))
  }
})

@windowDimensions
@connect(mapStateToProps, mapDispatchToProps)
export default class BarChart extends Component {

  static propTypes = {
    data: PropTypes.object
  }

  static defaultProps = {
    data: {}
  }

  componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  }

  render() {
    const { data, window } = this.props
    const { height, width } = window
    const barChartData = R.merge(data, data.data)
    const { source_name } = barChartData
    return (
      <div>
        {source_name}
        <br />
        {height}
        <br />
        {width}
      </div>
    )
  }
}
