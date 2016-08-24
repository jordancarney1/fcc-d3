import React, {Component} from 'react'
import { render } from 'react-dom'
import * as d3 from 'd3'

class App extends Component {
  render () {
    return <div>Hello, world!</div>
  }
}

// Create new div with id = "root" for app root
const containerNode = document.createElement('div')
containerNode.id = 'root'

// Insert new app root before JS tag
const sTag = document.getElementsByTagName('script')[0]
document.body.insertBefore(containerNode, sTag)

//TEMP - verifying d3 is available and ready to go
d3.select("body").append("p").text("New paragraph!");

// Render app into root element
render(<App />, document.getElementById('root'))
