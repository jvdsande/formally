import React from 'react'
import { Provider } from 'mobx-react'
import { Handler } from '@formally/core'

export class Form extends React.Component {
  constructor(props) {
    super(props)

    this.handler = new Handler(props.values, props.definition)
    this.handler.onUpdate = props.onUpdate
  }

  render() {
    return (
      <Provider formallyHandler={this.handler}>
        <form onSubmit={this.props.onSubmit}>
          {this.props.children}
        </form>
      </Provider>
    )
  }
}
