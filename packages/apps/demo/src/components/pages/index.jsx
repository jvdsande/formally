import React from 'react'
import { Scroller, Section } from 'react-fully-scrolled'
import SampleLogin from './samples/login'

export default class Component extends React.Component {
  render() {
    return (
      <Scroller controls>
        <Section>
          <h1>Form<em>ally</em></h1>
          <div className="sample">
            <SampleLogin />
          </div>
        </Section>
        <Section>
          <h1>Form<em>ally</em></h1>
        </Section>
      </Scroller>
    )
  }
}
