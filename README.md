# Form*ally* - React forms made easy

Form*ally* brings validation and automated binding to React forms without hassle.
Simply instantiate a `Form` component, toss in a few `Input`, `Select` or `Button`s as children, and you're good to go!


## Getting started

You can install form*ally* simply by running

**```npm install @formally/react```**

From there, you can start creating your first form.

<br></br >

#### 1. The `Form` Component

The entry point for creating a form*ally* form is the `Form` component. The `Form` components does two things:
- It creates a new form handler instance for form*ally*'s internal computations
- It renders a `form` node wrapped in a `Provider` so that all `Input` children can have access to the form handler (form*ally* uses MobX under the hood, but you can use it without)

It takes the following props. All props are optional.
 - **`onUpdate`** : called every time a field is updated, with two arguments: `values` (the current form object) and `handler` (reference to the handler instance).
 - **`onSubmit`** : called whenever a submit button is clicked, or any other action that would trigger the `onSubmit` event of the rendered `form` node. It receives three arguments: `event` (the original event), `values` (the current form object), and `handler` (reference to the handler instance).
 - **`handler`** : passed during `componentDidMount` to the underlying handler instance. Takes two attributes, `values` for passing default values, and `definition`, which can be used to alter format and provide validation.

Any other props will be forwarded to the `form` node.

#### 2. The `Input`, `Select` and `Textarea` Components

All those components must be children of a `Form` Component, otherwise they cannot work.
They work just as their HTML twins, but do not need `value` or `onChange` props. Instead, they take a `path` prop that automatically binds their value to the corresponding property in the form instance.

Here are the accepted props. `path` is mandatory, others are optional.
 - **`path`** : object path of the property to bind the value to. It can be a nested path, using the dot notation `"my.nested.property"`.
 - **`tag`** : React Component to draw instead of the default HTML node. This component **must** accept the `value/onChange` pair of props.
 - **`onChange`** : a custom `onChange` can be passed, it will be called whenever the value changes, for convenience. Most of the time it will not by needed.
 
 All other props are forwarded to the underlying HTML node, except for:
 - **`value`** : value is overridden with the internal value for the field.
 
#### 3. Putting it all together

Here is a very basic working sample:

```javascript 1.8
import React from 'react'
import { Form, Input } from '@formally/react'
import { login } from './my-login-service'

class MyLoginForm extends React.Component {
  render() {
    return (
      <Form
        onSubmit={(e, values) => {
          e.preventDefault()
          login(values) // values will be an object of shape { email: "", password: "" }
        }}
      >
        <Input path="email" placeholder="Email address" />
        <Input path="password" type="password" />
      </Form>
    )
  }
}
```

## Adding validation
W.I.P.

## Styling
W.I.P.

## Using custom input components
W.I.P.

## Using the "core" Handler
W.I.P.
