import React from 'react'
import { observer, inject } from 'mobx-react'
import className from 'classnames'

@inject(({ formallyHandler }) => ({ handler: formallyHandler }))
@observer
export class Value extends React.Component {
  static defaultProps = {
    onChange: () => {}
  }

  componentDidMount() {
    const { path, handler } = this.props
    handler.initialize(path)
  }

  componentDidUpdate(prevProps) {
    const { path, handler } = this.props
    if(prevProps.path !== path) {
      handler.initialize(path)
    }
  }

  render() {
    const { path, handler, tag, children, ...props } = this.props

    const Component = tag || 'span'

    const value = handler.getFormattedValue(path, handler.values, handler.formatted)
    const state = handler.getStateFromPath(path) || {}

    return (
      <Component
        {...props}
        className={className(this.props.className, state.pure, handler.getComputedValue(path).__error)}
      >
        { (children && (children instanceof Function)) ? children(value) : value }
      </Component>
    )
  }
}
