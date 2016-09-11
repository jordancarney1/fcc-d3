import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchDataIfNeeded } from '~/store/actions'
import * as selectors from '~/store/selectors'

const mapStateToProps = state => ({
  data: selectors.getBarChartData(state)
})

const mapDispatchToProps = dispatch => ({
  fetchData() {
    dispatch(fetchDataIfNeeded('bar-chart', 'GDP-data'))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class BarChart extends Component {

  static defaultProps = {
    data: {}
  }

  componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  }

  render() {
    const { data } = this.props
    return <div>Bar Chart Component</div>
  }
}
