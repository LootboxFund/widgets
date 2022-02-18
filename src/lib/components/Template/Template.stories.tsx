import React from 'react'
import Template, { TemplateProps } from 'lib/components/Template'


export default {
  title: 'Template',
  component: Template,
}

const Demo = (args: TemplateProps) => (
  <Template {...args} />
)

export const Basic = Demo.bind({})
Basic.args = {}
