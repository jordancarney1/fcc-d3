import React, { Component } from 'react'
import Elm from 'react-elm-components'

import { Header } from '../../Elm/header.js'

export default class ElmContainer extends Component {

  componentDidMount() {
    this.refs.elm.style.display = 'block'
  }

  componentWillUnmount() {
    this.refs.elm.style.display = 'none'
  }

  render() {
    return (
      <div>
        { <Elm ref='elm' src={Header} /> }
      </div>
    )
  }
}
