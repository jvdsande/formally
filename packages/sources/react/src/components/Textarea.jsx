import React from 'react'
import { observer, inject } from 'mobx-react'
import className from 'classnames'

@inject(({ formallyHandler }) => ({ handler: formallyHandler }))
@observer
export class Textarea extends React.Component {
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
    const { path, handler, tag, onChange } = this.props

    const Component = tag || 'textarea'

    const value = handler.getFormattedValue(path, handler.values, handler.formatted)
    const state = handler.getStateFromPath(path) || {}
    const inputProps = {}

    inputProps.value = value || ""
    inputProps.onChange = e => {
      onChange(e)
      handler.update(path, e.target.value)
    }

    return (
      <Component
        {...this.props}
        {...inputProps}
        className={className(this.props.className, state.pure, handler.getComputedValue(path).__error)}
        onBlur={() => handler.touch(path)}
      />
    )
  }
}
