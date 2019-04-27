import React from 'react'

export { Form  } from './components/Form'

export { Input } from './components/Input'
export { Button } from './components/Button'
export { Textarea } from './components/Textarea'
export { Select } from './components/Select'
export { Option } from './components/Option'

export { Message, SwitchMessages } from './components/Message'

export function withTag(Component, Tag) {
  return function TaggedComponent(props) {
    return (
      <Component tag={Tag} {...props} />
    )
  }
}
