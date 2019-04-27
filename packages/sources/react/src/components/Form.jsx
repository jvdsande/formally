import React from 'react'
import { Provider } from 'mobx-react'
import { Handler } from '@formally/core'
import className from 'classnames'

export class Form extends React.Component {
  constructor(props) {
    super(props)

    this.handler = new Handler(props.handler)
    this.handler.onUpdate = props.onUpdate
  }

  render() {
    return (
      <Provider formallyHandler={this.handler}>
        <form {...this.props} className={className(this.props.className, { invalid: !this.handler.isValid, valid: this.handler.isValid }, this.handler.formState)}>
          {this.props.children}
        </form>
      </Provider>
    )
  }
}
