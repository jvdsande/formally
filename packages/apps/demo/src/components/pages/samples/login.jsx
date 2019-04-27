import React from 'react'
import { Form, Input, Message, SwitchMessages, withTag } from '@formally/react'

import { Input as BSInput, Button } from 'reactstrap'

import './login.scss'

const TagInput = withTag(Input, BSInput)

export default class SampleLogin extends React.Component {
  state = {
    form: {
      email: ""
    }
  }

  render() {
    return (
      <Form
        className="login-sample"

        handler={{
          values: this.state.form,
          definition: {
            email: {
              format: v => v.toLowerCase(),
              validation: {
                required: true,
                invalid: (v) => !v.match(/^[a-zA-Z0-9_.+\-]+@[a-zA-Z]+\.[a-zA-Z][a-zA-Z]+$/)
              },
            },
            password: {
              validation: {
                required: true,
                invalid: (v) => v && v.length < 4
              },
            }
          }
        }}

        onUpdate={(form) => this.setState({ form })}
        onSubmit={(e) => {
          e.preventDefault()
          console.log(this.state.form)
        }}
      >
        <h3>Login sample</h3>

        <TagInput path="email" placeholder="Email address" />
        <span className="error">
          <SwitchMessages>
            <Message path="email" rule="required" display="touched">
              Email required
            </Message>
            <Message path="email" rule="invalid" display="dirty" blurred>
              Invalid email
            </Message>
          </SwitchMessages>
        </span>

        <TagInput path="password" type="password" placeholder="Password" />
        <span className="error">
          <SwitchMessages>
            <Message path="password" rule="required" display="touched">
              Password required
            </Message>
            <Message path="password" rule="invalid" display="dirty" blurred>
              Password should be at least 4 characters long
            </Message>
          </SwitchMessages>
        </span>

        <Button type="submit">
          Log in
        </Button>
      </Form>
    )
  }
}



