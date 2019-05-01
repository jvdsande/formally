# Form*ally* - React forms made easy

Form*ally* brings validation and automated binding to React forms without hassle.
Simply instantiate a `Form` component, toss in a few `Input`, `Select` or `Button`s as children, and you're good to go!


## Getting started

You can install form*ally* simply by running

**```npm install @formally/react```**

Form*ally* is built on MobX, so you need to install it as well. If you are not using MobX already, run the following command:

**```npm install mobx mobx-react```**

*Note:* You don't have to use MobX as your state management in order to use Form*ally*, but you have to install it
nonetheless as it is defined as a peer dependency.

From there, you can start creating your first form.


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
        
        <button type="submit">Login</button>
      </Form>
    )
  }
}
```

## Adding validation
form*ally* provides a built-in validation handling. It follows the classic form validation system, and exposes for each 
field a usage state (pristine/dirty and touched/untouched) and provides a way to implement custom validation rules passed 
to the form instance.

#### 1. Passing custom validation rules
In order to add custom validation rules, you need to pass a `definition` object through the `handler` prop of the `Form` element.

This `definition` object must follow the shape of your form instance, but does not need to implement all the fields.

Each field is defined by an object containing two optional properties: `format`, which is a function allowing you to visually
modify the value before printing, and `validation`, an object used as a map of `validation rule -> validation function`. 
You can also use the special `required: true` rule which checks for input.
For instance, the following would
make sure that all passwords are at least 4 characters long, and are required:

```javascript 1.8
definition={{
 "password": {
   validation: {
     required: true,
     invalid: (v) => !v || v.length < 4  // A password is invalid if not provided, or less than 4 characters long
   }
 } 
}}
```

#### 2. Validation messages
Once the validation rules are in place, form*ally* provides an easy way to display a warning to the user: the `Message` component.
The `Message` components take a `path` and a `rule`, and only displays its children if the given rule is `true` for the path.

Here are the props for the `Message` Component.

- **`path`** : field to validate
- **`rule`** : custom rule to check
- **`display`** : state of the field needed for display. Can be `always`, `touched` and `dirty`. Defaults to `touched`.
- **`blurred`** : if true, only display the message when the field is blurred. 

Example:
```javascript 1.8
<Message path="password" rule="required">Password required</Message>
<Message path="password" rule="invalid" display="dirty" blurred>Invalid password: must be at least 4 characters</Message>
```

#### 3. Multiple rules, single message
Sometimes multiple rules can be broken at the same time. In our example, the `required` and `invalid` rules can both be triggered if no password is provided.

If we were to create a `Message` Component for both rules, both messages would be displayed to the user, which can be confusing.

form*ally* provides a `SwitchMessages` Component that can be used to wrap multiple messages, and will only ever display
one at a time: the first `Message` with a triggered rule.

```javascript 1.8
<SwitchMessages>
    <Message path="password" rule="required">Password required</Message>
    <Message path="password" rule="invalid" display="dirty" blurred>Invalid password: must be at least 4 characters</Message>
</SwitchMessages>
```

## Styling
W.I.P.

## Using custom input components
W.I.P.

## Using the "core" Handler
W.I.P.
