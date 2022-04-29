import React from 'react'
import BadgeMinter, { TemplateProps } from 'lib/components/BadgeMinter'

export default {
  title: 'BadgeMinter',
  component: BadgeMinter,
}

const Demo = (args: TemplateProps) => <BadgeMinter {...args} />

export const Basic = Demo.bind({})
Basic.args = {}
