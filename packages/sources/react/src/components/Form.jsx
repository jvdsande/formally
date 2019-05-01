import {toJS} from 'mobx'
import React from 'react'
import { Provider } from 'mobx-react'
import { Handler } from '@formally/core'
import className from 'classnames'

export class Form extends React.Component {
  static defaultProps = {
    onSubmit: () => {},
    onUpdate: () => {},
  }

  constructor(props) {
    super(props)

    this.handler = new Handler(props.handler)
    this.handler.onUpdate = props.onUpdate
  }

  onSubmit = (e) => {
    this.props.onSubmit(e, toJS(this.handler.values), this.handler)
  }

  render() {
    const { onUpdate, onSubmit, ...props } = this.props
    return (
      <Provider formallyHandler={this.handler}>
        <form
          {...props}
          className={className(this.props.className, { invalid: !this.handler.isValid, valid: this.handler.isValid }, this.handler.formState)}
          onSubmit={this.onSubmit}
        >
          {this.props.children}
        </form>
      </Provider>
    )
  }
}
