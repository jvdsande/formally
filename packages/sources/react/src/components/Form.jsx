import {toJS} from 'mobx'
import React from 'react'
import { Provider } from 'mobx-react'
import { Handler } from '@formally/core'
import className from 'classnames'

export class Form extends React.Component {
  static defaultProps = {
    onSubmit: () => {},
    onUpdate: () => {},
    onBlur: () => {},
    onFocus: () => {},
    tag: "form",
  }

  constructor(props) {
    super(props)

    this.handler = new Handler(props.handler)
    this.handler.onUpdate = props.onUpdate
    this.handler.onBlur = props.onBlur
    this.handler.onFocus = props.onFocus
  }

  onSubmit = (e) => {
    this.props.onSubmit(e, toJS(this.handler.values), this.handler)
  }

  render() {
    const { onUpdate, onSubmit, onBlur, onFocus, children, tag, ...props } = this.props

    const Component = tag

    return (
      <Provider formallyHandler={this.handler}>
        <Component
          {...props}
          className={className(props.className, { invalid: !this.handler.isValid, valid: this.handler.isValid }, this.handler.formState)}
          onSubmit={this.onSubmit}
        >
          {children}
        </Component>
      </Provider>
    )
  }
}
