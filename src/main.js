import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import './main.css'

require('es6-promise').polyfill();
require('isomorphic-fetch');

//
// APP CONTAINER
//
class App extends Component {

  constructor() {
    super()

    this.state = {
      urls: {
        barChart: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
        scatterPlot: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
        heatMap: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
      },
      margin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 50
      },
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  handleResize() {

    this.setState(
      Object.assign(this.state, {
        window: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }

  render() {
    return (
      <div className="container">
        <h1>React and D3!</h1>
        <BarChart urls={this.state.urls} window={this.state.window} margin={this.state.margin} />
        <ScatterPlot urls={this.state.urls} window={this.state.window} margin={this.state.margin} />
      </div>
    )
  }
}

//
// BAR CHART CARD
//
class BarChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: false
    }
  }

  handleHover(d) {
    const formatDate = d3.timeFormat('%Y - %B')
    const formatCurrency = d3.format('$,.2f')
    const theToolTip = document.getElementById('tool-tip')
    theToolTip.innerHTML = '<strong>' + formatCurrency(d[1]) + ' Billion</strong>' + '<br />' + formatDate(new Date(d[0]))
    theToolTip.style.opacity = 0.9
    theToolTip.style.left = (d3.event.pageX + 4) + 'px'
    theToolTip.style.top = (d3.event.pageY - 44) + 'px'
  }

  handleMouseOut() {
    const theToolTip = document.getElementById('tool-tip')
    theToolTip.style.opacity = 0
  }

  componentDidMount() {
    fetch(this.props.urls.barChart)
      .then(res => res.json())
      .then(data => this.setState(
        Object.assign(this.state, {
          data: data
        })
        )
      )
  }

  render() {

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
      const card = ReactFauxDOM.createElement('div')
      card.setAttribute('class', 'card')

      const cardHeader = ReactFauxDOM.createElement('h2')
      cardHeader.textContent = this.state.data.name ? this.state.data.name : 'Loading...'

      const footer = ReactFauxDOM.createElement('div')
      footer.setAttribute('class', 'card-footer')

      const cardFooter = ReactFauxDOM.createElement('p')
      cardFooter.textContent = this.state.data.description ? this.state.data.description : ''

      // Begin setting up DOM elements. **There is surely a better way to organize this...
      card.appendChild(cardHeader)
      footer.appendChild(cardFooter)

    if (this.state.data) {

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
      const dataSet = this.state.data
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
          .on('mouseout', () => this.handleMouseOut())

      return card.toReact()
    }

    return card.toReact()
  }
}

//
// SCATTER PLOT CARD
//
class ScatterPlot extends Component {

  constructor() {
    super()

    this.state = {
      data: false
    }
  }

  handleHover(d) {
    const theToolTip = document.getElementById('scatter-tool-tip')
    theToolTip.innerHTML = '<strong>' + d.Name + '</strong> - ' + d.Nationality +
                           '<br>Time: ' + d.Time +
                           '<br>Year: ' + d.Year +
                           '<br>' + d.Doping
    theToolTip.style.opacity = 0.9
    theToolTip.style.left = (d3.event.pageX + 4) + 'px'
    theToolTip.style.top = (d3.event.pageY - 44) + 'px'
  }

  handleMouseOut() {
    const theToolTip = document.getElementById('scatter-tool-tip')
    theToolTip.style.opacity = 0
  }

  componentDidMount() {
    fetch(this.props.urls.scatterPlot)
      .then(res => res.json())
      .then(data => this.setState(
          Object.assign(this.state, {
            data: data
          })
        )
      )
  }

  render() {

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
      const card = ReactFauxDOM.createElement('div')
      card.setAttribute('class', 'card')

      const cardHeader = ReactFauxDOM.createElement('h2')
      cardHeader.textContent = this.state.data ? 'Doping in Professional Bicycle Racing' : 'Loading...'

      const footer = ReactFauxDOM.createElement('div')
      footer.setAttribute('class', 'card-footer')

      const cardFooter = ReactFauxDOM.createElement('p')
      cardFooter.textContent = this.state.data ? '35 Fastest times up Alpe d\'Huez - Normalized to 13.8km distance' : ''

      // Begin setting up DOM elements. **There is surely a better way to organize this...
      card.appendChild(cardHeader)
      footer.appendChild(cardFooter)

    if (this.state.data) {

      const graph = ReactFauxDOM.createElement('svg')
      graph.setAttribute('width', width + margin.left + margin.right)
      graph.setAttribute('height', height + margin.top + margin.bottom)

      // Define the div for the tooltip
      const toolTip = ReactFauxDOM.createElement('div')
      toolTip.setAttribute('class', 'tooltip')
      toolTip.setAttribute('id', 'scatter-tool-tip')
      toolTip.style.setProperty('opacity', 0)

      //Build DOM for graph structure. **There is surely a better way to organize this...
      card.appendChild(toolTip)
      card.appendChild(graph)
      card.appendChild(footer)

      // Get Data Ready
      const dataSet = this.state.data

      const formatTime = d3.timeFormat('%M:%S')
      const formatMinutes = function (d) {
        return formatTime( new Date( 2012, 0, 1, 0, 0, d ))
      }

      // Define scaling for graph
      const x = d3.scaleLinear()
        //.domain([d3.min(dataSet, d => d.Seconds), d3.max(dataSet, d => d.Seconds)])
        .domain([0, (d3.max(dataSet, d => d.Seconds) - d3.min(dataSet, d => d.Seconds))])
        .rangeRound([0, width])

      const y = d3.scaleLinear()
        .domain([1, d3.max(dataSet, d => d.Place)])
        .range([height, 0])

      const xAxis = d3.axisBottom(x).tickFormat(formatMinutes)

      const yAxis = d3.axisLeft(y)

      // Draw the Graph!
      const bGraph = d3.select(graph)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Draw the X axis
      bGraph.append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)

      bGraph.append('text')
          .attr('class', 'x-axis-label')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .attr('transform', 'translate(' + width / 2 + ',' + (height + margin.top) + ')')
          .text('Minutes Behind Fastest Time')

      // Draw the Y axis
      bGraph.append('g')
          .attr('class', 'y-axis')
          .call(yAxis)

      bGraph.append('text')
        .attr('class', 'y-axis-label')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'translate(15, 0)rotate(-90)')
        .text('Ranking')

      // Chart the Dots
      bGraph.selectAll('dot')
          .data(dataSet)
        .enter()
        .append('circle')
          .attr('class', d => d.Doping ? 'circ dope' : 'circ')
          .attr('r', 5)
          .attr('cx', data => {
              let secondsBehind = data.Seconds - d3.min(dataSet, d => d.Seconds)
              return x(secondsBehind)
            })
          .attr('cy', d => y(d.Place))
          .on('mouseover', d => this.handleHover(d))
          .on('mouseout', () => this.handleMouseOut())

      return card.toReact()
    }

    return card.toReact()
  }
}

//
// HEAT MAP CARD
//

class HeatMap extends Component {
  constructor() {
    super()

    this.state = {
      data: false
    }
  }

  handleHover(d) {

  }

  handleMouseOut() {

  }

  componentDidMount() {
    fetch(this.props.urls.heatMap)
      .then(res => res.json())
      .then(data => this.setState(
          Object.assign(this.state, {
            data: data
          })
        )
      )
  }

  render() {
    
  }

}

render(<App />, document.getElementById('root'))
