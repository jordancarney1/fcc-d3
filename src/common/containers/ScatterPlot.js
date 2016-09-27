import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { mapProps, compose } from 'recompose'
import R from 'ramda'

import Maybe, { map, orElse, chain } from '~/maybe'
import { fetchDataIfNeeded } from '~/store/actions'
import * as selectors from '~/store/selectors'
import { windowDimensions, spinnerWhileLoading } from '~/hocs'

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

const enhance = compose(
  windowDimensions,
  connect(mapStateToProps, mapDispatchToProps),
  mapProps(({ data, ...props}) => ({ ...data, ...props})),
  spinnerWhileLoading(({ data }) => !R.isEmpty(data)),
)

@enhance
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
    const { data, window } = this.props
    const { width, height } = window
    const getFirstResultMaybe = R.pipe(
      Maybe.of,
      map(R.prop('Name')),
      orElse('Placeholder'),
      chain(m => m.toUpperCase())
    )
    const head = getFirstResultMaybe(R.head(data))
    return (
      <div>
        {head}<br />
        {height}<br />
        {width}<br />
        <ul>{data.map((value, index) => <li key={index}>{value.Name}</li> )}
        </ul>
      </div>
    )
  }
}
