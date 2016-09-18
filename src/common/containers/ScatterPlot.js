import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { mapProps } from 'recompose'

import { fetchDataIfNeeded } from '~/store/actions'
import * as selectors from '~/store/selectors'
import { windowDimensions } from '~/hocs'

const mapStateToProps = state => {
  const getResource = selectors.getResource('scatter-plot')
  return {
    data: getResource(state)
  }
}

const mapDispatchToProps = dispatch => ({
  fetchData() {
    dispatch(fetchDataIfNeeded('scatter-plot', 'cyclist-data'))
  }
})

@windowDimensions
@connect(mapStateToProps, mapDispatchToProps)
@mapProps(({ data, ...props}) => ({ ...data, ...props}))
export default class ScatterPlot extends Component {

  static propTypes = {
    data: PropTypes.array
  }

  static defaultProps = {
    data: []
  }

  componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  }

  render() {
    const { data } = this.props
    return <div>{JSON.stringify(data[0] || null)}</div>
  }
}
