import {observable, action, toJS} from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'

function shouldMessageRender(props) {
  const { value, rule, display, blurred } = props

  const { __error, __state } = value

  if(!__error || !__state) {
    return false
  }

  if(blurred && __state.modified) {
    return false
  }

  const shouldDisplay = {
    "always": true,
    "dirty": __state.dirty,
    "touched": __state.touched,
    "undefined": __state.touched,
  }[display]

  return !!(__error[rule] && shouldDisplay);
}

@inject(({ formallyHandler }, { path }) => ({ value: formallyHandler.getComputedValue(path) }))
@observer
export class Message extends React.Component {
  render() {
    const { children, ...props } = this.props

    if(shouldMessageRender(props)) {
      return children
    }

    return null
  }
}


@inject(({ formallyHandler }) => ({ handler: formallyHandler }))
@observer
export class SwitchMessages extends React.Component {
  // Observe the child to display
  @observable child = null

  // Keep a raw reference not wrapped in observable for reference equality check
  raw = null

  // Upon creation or update, find the first child that should be rendered
  @action.bound findChild() {
    const { children, handler } = this.props

    let child = null
    React.Children.forEach(children, c => {
      if (child == null && React.isValidElement(c)) {
        const shouldRender = shouldMessageRender({ ...c.props, value: handler.getComputedValue(c.props.path) })

        if(shouldRender) {
          child = c
        }
      }
    })

    if(child !== this.raw) {
      this.raw = child
      this.child = child
    }
  }

  componentDidMount() {
    this.findChild()
  }

  componentDidUpdate() {
    this.findChild()
  }

  render() {
    const { child } = this

    return (
      child
    )
  }
}
