import React from 'react'
import { observer, inject } from 'mobx-react'

export class Option extends React.Component {
  render() {
    const { tag, ...props } = this.props

    const Component = tag || 'option'

    return (
      <Component
        {...props}
      />
    )
  }
}
