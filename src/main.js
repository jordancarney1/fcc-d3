import React, { Component } from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import * as topojson from 'topojson'


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
        heatMap: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
        forceGraph: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
        meteorMap: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'
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
        <HeatMap urls={this.state.urls} window={this.state.window} margin={this.state.margin} />
        <ForceGraph url={this.state.urls.forceGraph} window={this.state.window} margin={this.state.margin} />
        <MeteorMap url={this.state.urls.meteorMap} window={this.state.window} margin={this.state.margin} />
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
      const height = this.props.window.height / 2 - (margin.top - margin.bottom)

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
      const height = this.props.window.height / 2 - (margin.top - margin.bottom)

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
      // X Axes Label
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
      // Y Axes Label
      bGraph.append('text')
        .attr('class', 'y-axis-label')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'translate(15, 0)rotate(-90)')
        .text('Ranking')

      // Draw the data-points
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

  handleHover(d, theYear, theTemp, theMonth) {
    const theToolTip = document.getElementById('tool-tip')
    theToolTip.innerHTML = '<strong>' + theYear + '</strong>' + ' - ' + theMonth + '<br />' + 
                           '<strong>' + theTemp + ' &deg;C</strong><br />' +
                            d3.format('.3f')(d.variance) + ' &deg;C'
    theToolTip.style.opacity = 0.9
    theToolTip.style.left = (d3.event.pageX + 4) + 'px'
    theToolTip.style.top = (d3.event.pageY - 44) + 'px'
  }

  handleMouseOut() {
    const theToolTip = document.getElementById('tool-tip')
    theToolTip.style.opacity = 0
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
    // Set dimensions and margins of the page elements based on viewport dimensions
    const margin = {
      top: this.props.margin.top,
      right: this.props.margin.right,
      bottom: this.props.margin.bottom + 45,
      left: this.props.margin.left + 25
    }
    const width = this.props.window.width - 2 * (margin.left + margin.right)
    const height = this.props.window.height / 2 - (margin.top - margin.bottom)


    //Define elements for graph
    const card = ReactFauxDOM.createElement('div')
    card.setAttribute('class', 'card')

    const cardHeader = ReactFauxDOM.createElement('h2')
    cardHeader.textContent = this.state.data ? 'Monthly Global Land-Surface Temperature' : 'Loading...'

    const cardSubHeader = ReactFauxDOM.createElement('div')
    cardSubHeader.setAttribute('class', 'card-subheader')
    cardSubHeader.textContent = this.state.data? '1753 - 2015' : ''
    
    const cardSubHeaderSpan = ReactFauxDOM.createElement('div')
    cardSubHeaderSpan.setAttribute('class', 'card-subheader card-subheader-one')
    cardSubHeaderSpan.textContent = this.state.data ? 'Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.' : ''

    const cardSubHeaderSpanTwo = ReactFauxDOM.createElement('div')
    cardSubHeaderSpanTwo.setAttribute('class', 'card-subheader card-subheader-two')
    cardSubHeaderSpanTwo.textContent = this.state.data ? 'Estimated Jan 1951-Dec 1980 absolute temperature C: 8.66 +/- 0.07' : ''

    // Begin setting up DOM elements. **There is surely a better way to organize this...
    card.appendChild(cardHeader)
    card.appendChild(cardSubHeader)
    card.appendChild(cardSubHeaderSpan)
    card.appendChild(cardSubHeaderSpanTwo)

    if (this.state.data) {

      const graph = ReactFauxDOM.createElement('svg')
      graph.setAttribute('width', width + margin.left + margin.right)
      graph.setAttribute('height', height + margin.top + margin.bottom)

      // Define the div for the tooltip
      const toolTip = ReactFauxDOM.createElement('div')
      toolTip.setAttribute('class', 'tooltip')
      toolTip.setAttribute('id', 'heatmap-tool-tip')
      toolTip.style.setProperty('opacity', 0)

      //Build DOM for graph structure. **There is surely a better way to organize this...
      card.appendChild(toolTip)
      card.appendChild(graph)

      // Get Data Ready
      const dataSet = this.state.data.monthlyVariance
      const baseTemp = this.state.data.baseTemperature

      // Years (X)
      const years = dataSet.map( d => new Date(d.year, 0))
      const formatYear = d3.timeFormat('%Y')
      const minYear = d3.min(years)
      const maxYear = d3.max(years)

      // Months (Y)
      const months = dataSet.map( d => new Date(0, d.month-1))
      const formatMonth = d3.timeFormat('%B')
      const minMonth = d3.min(months)
      const maxMonth = d3.max(months)

      // Temps (Color)
      const temps = dataSet.map( d => (baseTemp + d.variance))
      const colorRange = ['#2433FF', '#3C2EE3', '#542AC7', '#6D26AB', '#85228F', '#9D1D74', '#B61958', '#CE153C', '#E61120', '#FF0D05']
      
      // Bar Sizes
      const barWidth = Math.ceil(width / (maxYear.getFullYear() - minYear.getFullYear()))
      const barHeight = Math.ceil(height / (maxMonth.getMonth() - minMonth.getMonth()))

      // Define scaling for graph
      const x = d3.scaleTime()
        .domain([minYear, maxYear])
        .rangeRound([0, width])

      const y = d3.scaleTime()
        .domain([minMonth, maxMonth])
        .rangeRound([height, 0])

      const colorFill = d3.scaleQuantize()
        .domain(d3.extent(temps))
        .range(colorRange)

      // Define the axes
      const xAxis = d3.axisBottom(x).tickFormat(formatYear)

      const yAxis = d3.axisLeft(y).tickFormat(formatMonth)

      //Draw the Graph!
      const heatMap = d3.select(graph)
        .append('g')
          .attr('class', 'graph')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Draw the X axis
      heatMap.append('g')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0,' + (height + (barHeight / 2)) + ')')
          .call(xAxis)

      // Draw the Y axis
      heatMap.append('g')
          .attr('class', 'y-axis')
          .call(yAxis)

      // Draw the data-points
      heatMap.selectAll('rect')
        .data(dataSet)
        .enter()
        .append('rect')
          .attr('class', 'heat-bar')
          .attr('x', d => x(new Date(d.year, 0)))
          .attr('y', d => y(new Date(0, d.month-1)) - (barHeight / 2))
          .attr('width', barWidth)
          .attr('height', barHeight)
          .attr('fill', d => colorFill( d.variance + baseTemp ))
          .on('mouseover', (d) => {
            let theYear = d.year
            let theTemp = d3.format('.3f')(d.variance + baseTemp)
            let theMonth = formatMonth(new Date(0, d.month - 1))
            this.handleHover(d, theYear, theTemp, theMonth )
          })
          .on('mouseout', d => this.handleMouseOut())

      // Legend for heat map
      const legendRectSize = 20
      const keys = colorRange.length
      const legend = d3.select(graph)
        .append('g')
          .attr('class', 'legend')
      
      // Minimum Range
      legend.append('text')
          .attr('class', 'range-min')
          .attr('x', (width - legendRectSize * keys ) - 40)
          .attr('y', height + 79)
          .text( d3.format('.3f')(d3.min(dataSet.map( d => d.variance))))

      // Color Scale
      legend.selectAll('rect')
          .data(colorFill.range())
          .enter()
        .append('rect')
          .attr('class', 'key')
          .attr('x', (d, i) => {
            return legendRectSize * i + ( width - legendRectSize * keys )
          })
          .attr('y', height + 70)
          .attr('width', legendRectSize)
          .attr('height', legendRectSize / 2)
          .style('fill', d => d)
          .style('stroke', '#fff')
      // Maximum Range
      legend.append('text')
          .attr('class', 'range-max')
          .attr('x', (width - legendRectSize ) + 27)
          .attr('y', height + 79)
          .text( d3.format('.3f')(d3.max(dataSet.map( d => d.variance))))

      return card.toReact()
    }

    return card.toReact()
  }

}

//
// FORCE-DIRECTED GRAPH
//
class ForceGraph extends Component {

  componentDidMount() {
    const margin = {
      top: this.props.margin.top,
      right: this.props.margin.right,
      bottom: this.props.margin.bottom,
      left: this.props.margin.left
    }
    const width = this.props.window.width - 2 * (margin.left + margin.right)
    const height = this.props.window.height / 2 - (margin.top - margin.bottom)
    const radius = 0

    const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id( (d, i) => { return i }))
    .force('charge', d3.forceManyBody().strength(-2))
    .force('center', d3.forceCenter(width / 2, height / 2))

    const svg = d3.select(this.refs.d3Mount)
    svg.append('div')
          .attr('class', 'nodes')

    svg.append('svg')
        .attr('class', 'link-box')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    svg.append('div')
      .attr('id', 'force-tool-tip')

    d3.json(this.props.url, function(error, graph) {
      if (error) throw error;

      const node = d3.select('.nodes')
        .selectAll('div')
        .data(graph.nodes)
        .enter()
        .append('div')
          .attr('class', (d) => {
            return 'flag ' + d.code
          })
          .call(d3.drag()
              .on('start', dragstarted)
              .on('drag', dragged)
              .on('end', dragended))
          .on('mouseover', (d) => { handleHover(d) })
          .on('mouseout', (d) => { handleMouseOut(d) })

      const link = d3.select('.link-box').append('g')
          .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
          .attr('stroke-width', 1)

      simulation
          .nodes(graph.nodes)
          .on('tick', ticked);

      simulation.force('link')
          .links(graph.links);

      resize()
      d3.select(window).on('resize', resize)

      function ticked() {
        link
            .attr('x1', function(d) { return d.source.x })
            .attr('y1', function(d) { return d.source.y })
            .attr('x2', function(d) { return d.target.x })
            .attr('y2', function(d) { return d.target.y })

        node
            .attr('cx', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)) })
            .attr('cy', function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)) })
            .attr('style', function(d) { 
              let styleString =  'left:' + Math.max(radius, Math.min(width - radius, d.x)) + 'px; ' +
                'top:' + Math.max(radius, Math.min(height - radius, d.y)) + 'px;'
              return styleString
            })
      }

      function resize() {
        const width = window.innerWidth - 2 * (margin.left + margin.right)
        const height = window.innerHeight / 2 - (margin.top - margin.bottom)

        d3.select('.link-box')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)

        simulation.force('center')
          .x(width / 2)
          .y(height / 2)
        }

        function handleHover(d) {
          const theToolTip = document.getElementById('force-tool-tip')
          theToolTip.innerHTML = '<strong>' + d.country + '</strong>'
          theToolTip.style.opacity = 0.9
          theToolTip.style.left = (d3.event.pageX + 4) + 'px'
          theToolTip.style.top = (d3.event.pageY - 40) + 'px'
        }

        function handleMouseOut() {
          const theToolTip = document.getElementById('force-tool-tip')
          theToolTip.style.opacity = 0
        }
    })// End d3 fetch data

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null
      d.fy = null
    }
  }

  render() {

    return (
      <div className="card" id="forceGraph" ref="d3Mount">
        <h2>National Contiguity</h2>
      </div>
    )
  }
}

class MeteorMap extends Component {
  componentDidMount() {
    const margin = {
      top: this.props.margin.top,
      right: this.props.margin.right,
      bottom: this.props.margin.bottom,
      left: this.props.margin.left
    }
    const width = this.props.window.width - 2 * (margin.left + margin.right)
    const height = this.props.window.height / 2 - (margin.top - margin.bottom)

    var svg = d3.select(this.refs.mapMount)
    svg.append('svg')
        .attr('id', 'map')
        .attr('width', width)
        .attr('height', height)

    svg.append('div')
      .attr('id', 'map-tool-tip')

    var projection = d3.geoMercator()
        .scale(width/20)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    var graticule = d3.geoGraticule();
    
    const map = d3.select('#map')

    map.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

    map.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    map.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    map.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    // WORLD MAP
    d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(error, world) {
      if (error) throw error

      map.append('g')
        .selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
          .append('path')
          .attr('fill', '#336600')
          .attr('stroke', '#fff')
          .attr('d', path)

       // METEOR STRIKES
       d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(error, meteorJson) {
        if (error) throw error

        const masses = meteorJson.features.map( (d) => {
          if ( d.properties.mass == null ) { return 2 }
          return parseInt(d.properties.mass)
        })

        const m = function(d) {
          if ( d <= 1000 ) return 2
          if ( d <= 5000 ) return 3
          if ( d <= 10000 ) return 4
          if ( d <= 20000 ) return 5
          if ( d <= 50000 ) return 6
          if ( d <= 100000 ) return 7
          if ( d <= 500000 ) return 8
          if ( d <= 1000000 ) return 10
          return 16;
        }


        map.append('g')
          .selectAll('path')
          .data(meteorJson.features)
          .enter()
            .append('circle')
              .attr('class', 'meteor-strike')
              .attr('cx', (d) => {
                return projection([d.properties.reclong, d.properties.reclat])[0]
              })
              .attr('cy', (d) => {
                return projection([d.properties.reclong, d.properties.reclat])[1]
              })
              .attr('r', ( d => m(d.properties.mass) ))
              .attr('fill', '#ff0000')
              .attr('opacity', 0.3)
              .attr('stroke-width', 1)
              .attr('stroke', '#000')
              .on('mouseover', handleMouseOver)
              .on('mouseout', handleMouseOut)


        function handleMouseOver(d) {

          d3.select(this).attr('opacity', 1)
          const theToolTip = document.getElementById('map-tool-tip')
          theToolTip.innerHTML = '<strong>' + d.properties.name + '</strong><br>' +
                                'ID: ' + d.properties.id + '<br>' +
                                'Mass: ' + d.properties.mass + '<br>' +
                                d.properties.fall + '<br>' +
                                new Date(d.properties.year).getFullYear() + '<br>'
          theToolTip.style.opacity = 0.9
          theToolTip.style.left = (d3.event.pageX + 4) + 'px'
          theToolTip.style.top = (d3.event.pageY - 40) + 'px'
        }

        function handleMouseOut(d) {
          d3.select(this).attr('opacity', 0.3)
          const theToolTip = document.getElementById('map-tool-tip')
          theToolTip.style.opacity = 0
        }
      })    
    })  
  }

  render() {
    return(
      <div className="card" id="meteor-map" ref="mapMount">
        <h2>Meteor Strikes</h2>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))