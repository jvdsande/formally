import React from 'react'
import { Form, Input, Message, SwitchMessages, withTag, Select, Option, Textarea } from '@formally/react'

import { Input as BSInput } from 'reactstrap'

const TagInput = withTag(Input, BSInput)

export default class SampleLogin extends React.Component {
  state = {
    form: {
      email: ""
    }
  }

  render() {
    return (
      <Form values={this.state.form} definition={{
        email: {
          format: v => v.toLowerCase(),
          validation: {
            required: true,
            invalid: (v) => !v.match(/^[a-zA-Z0-9_.+\-]+@[a-zA-Z]+\.[a-zA-Z][a-zA-Z]+$/)
          },
        }
      }} onUpdate={(form, computed, formatted) => this.setState({ form, computed, formatted })}>
        <TagInput className="input" path="email" />
        <div>{this.state.form.email}</div>
        <TagInput path="password" type="password" />
        <div>{this.state.form.password}</div>

        <Select path="type">
          <Option>Admin</Option>
          <Option>Other</Option>
        </Select>


        <Textarea path="area" />

        <h3>
          {
          <SwitchMessages>
            <Message path="email" rule="required" display="touched">
              Email required
            </Message>
            <Message path="email" rule="invalid" display="dirty" blurred>
              Invalid email
            </Message>
          </SwitchMessages>
          }
        </h3>

        {
          JSON.stringify(this.state.form)
        }
      </Form>
    )
  }
}
