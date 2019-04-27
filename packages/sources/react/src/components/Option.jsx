import React from 'react'
import { observer, inject } from 'mobx-react'

export class Option extends React.Component {
  render() {
    const { tag } = this.props

    const Component = tag || 'option'

    return (
      <Component
        {...this.props}
      />
    )
  }
}
