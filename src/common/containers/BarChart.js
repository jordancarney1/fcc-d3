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

      // Set dimensions and margins of the page elements based on viewport dimensions
      const margin = {
        top: this.props.margin.top,
        right: this.props.margin.right,
        bottom: this.props.margin.bottom,
        left: this.props.margin.left
      }
      const width = this.props.window.width - 2 * (margin.left + margin.right)
      const height = this.props.window.height / 2 - margin.top - margin.bottom

      //Define elements for graph
      const container = ReactFauxDOM.createElement('div')
      container.setAttribute('class', 'container')

      const headline = ReactFauxDOM.createElement('h1')
      headline.textContent = 'React and D3!'

      const header = ReactFauxDOM.createElement('div')
      header.setAttribute('class', 'header')

      const card = ReactFauxDOM.createElement('div')
      card.setAttribute('class', 'card')

      const cardHeader = ReactFauxDOM.createElement('h2')
      cardHeader.textContent = this.props.data.name ? this.props.data.name : 'Loading...'

      const footer = ReactFauxDOM.createElement('div')
      footer.setAttribute('class', 'card-footer')

      const cardFooter = ReactFauxDOM.createElement('p')
      cardFooter.textContent = this.props.data.description ? this.props.data.description : ''

      // Begin setting up DOM elements. **There is surely a better way to organize this...
      container.appendChild(header)
      header.appendChild(headline)
      container.appendChild(card)
      card.appendChild(cardHeader)
      footer.appendChild(cardFooter)

    if (this.props.data) {

      const graph = ReactFauxDOM.createElement('svg')
      graph.setAttribute('width', width + margin.left + margin.right)
      graph.setAttribute('height', height + margin.top + margin.bottom)

      // Define the div for the tooltip
      const toolTip = ReactFauxDOM.createElement('div')
      toolTip.setAttribute('class', 'tooltip')
      toolTip.setAttribute('id', 'tool-tip')
      toolTip.style.setProperty('opacity', 0)

      //Build DOM for graph structure. **There is surely a better way to organize this...
      card.appendChild(toolTip)
      card.appendChild(graph)
      card.appendChild(footer)

      // Get Data Ready
      const dataSet = this.props.data
      const dates = dataSet.data.map((d) => {
        return new Date(d[0])
      })

      // Define scaling for graph
      const barWidth = Math.ceil(width / dataSet.data.length)

      const x = d3.scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .rangeRound([0, width])

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataSet.data, (d) => {
          return d[1]
        })])
        .range([height, 0])

      const xAxis = d3.axisBottom(x)
        .ticks(d3.timeYear.every(5))
        .tickFormat(d3.timeFormat('%Y'))

      const yAxis = d3.axisLeft(y)

      // Chart the Graph!
      const bGraph = d3.select(graph)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Chart the X axis
      bGraph.append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)

      // Chart the Y axis
      bGraph.append('g')
          .attr('class', 'y-axis')
          .call(yAxis)

      // Chart the Bars
      bGraph.selectAll('rect')
          .data(dataSet.data)
        .enter()
        .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => {
            return x(new Date(d[0]))
          })
          .attr('y', (d) => {
            return y(d[1])
          })
          .attr('width', barWidth)
          .attr('height', (d) => {
            return height - y(d[1])
          })
          .on('mouseover', (d) => {
            this.handleHover(d)
          })
      return container.toReact()
    }

    return container.toReact()
  }
}
