import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import './main.css'

require('es6-promise').polyfill();
require('isomorphic-fetch');

class App extends Component {
  render() {
    return(
      <BarChart />
    )
  }
}

class BarChart extends Component {

  constructor() {
    super()

    this.state = {
      urls:{
        barChart: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
      },
      data: false,
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
    this.setState( Object.assign({}, this.state, {
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      }  
    }))
  }

  handleHover(d) {
    const formatDate = d3.timeFormat('%Y - %B')
    const formatCurrency = d3.format('$,.2f')
    const theToolTip = document.getElementById('tool-tip')
    theToolTip.innerHTML = '<strong>' + formatCurrency(d[1]) + ' Billion</strong>' + '<br />' + formatDate(new Date(d[0]))
    theToolTip.style.opacity = 0.9
    theToolTip.style.left = (d3.event.pageX + 4) + "px"
    theToolTip.style.top = (d3.event.pageY - 44) + "px"
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this))
    fetch(this.state.urls.barChart)
      .then(res => res.json())
      .then(data => this.setState(
        Object.assign({}, this.state, {
          data: data
        })
        )
      )
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this))
  }

  render() {

      // Set dimensions and margins of the page elements based on viewport dimensions
      const margin = {
        top: this.state.margin.top,
        right: this.state.margin.right,
        bottom: this.state.margin.bottom,
        left: this.state.margin.left
      }
      const width = this.state.window.width - 2 * (margin.left + margin.right)
      const height = this.state.window.height / 2 - margin.top - margin.bottom

      //Define elements for graph
      const container = ReactFauxDOM.createElement('div')
      container.setAttribute('class', 'container')
      
      const headline = ReactFauxDOM.createElement('h1')
      headline.textContent = "React and D3!"

      const header = ReactFauxDOM.createElement('div')
      header.setAttribute('class', 'header')

      const card = ReactFauxDOM.createElement('div')
      card.setAttribute('class', 'card')

      const cardHeader = ReactFauxDOM.createElement('h2')
      cardHeader.textContent = this.state.data.name ? this.state.data.name : 'Loading...'

      const footer = ReactFauxDOM.createElement('div')
      footer.setAttribute('class', 'card-footer')
      
      const cardFooter = ReactFauxDOM.createElement('p')
      cardFooter.textContent = this.state.data.description ? this.state.data.description : ''

      // Begin setting up DOM elements. **There is surely a better way to organize this...
      container.appendChild(header)
      header.appendChild(headline)
      container.appendChild(card)
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


      return container.toReact()
    }

    return container.toReact()
  }
}


render(<App />, document.getElementById('root'))
