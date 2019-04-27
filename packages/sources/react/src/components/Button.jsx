import React from 'react'

export class Button extends React.Component {
  render() {
    const { tag } = this.props

    const Component = tag || 'button'

    return (
      <Component {...this.props} />
    )
  }
}
