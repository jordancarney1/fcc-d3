import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchDataIfNeeded } from '~/store/actions'
import * as selectors from '~/store/selectors'

const mapStateToProps = state => {
  return {
    data: selectors.getBarChartData(state)
  }
}

class BarChart extends Component {

  static defaultProps = {
    data: {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchDataIfNeeded('bar-chart', 'GDP-data'))
  }

  render() {
    const { data } = this.props
    return <div>Bar Chart Component</div>
  }
}

export default connect(mapStateToProps)(BarChart)
