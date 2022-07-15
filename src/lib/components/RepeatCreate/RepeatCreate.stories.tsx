import React from 'react'
import RepeatCreate, { RepeatCreateProps } from 'lib/components/RepeatCreate'

export default {
  title: 'RepeatCreate',
  component: RepeatCreate,
}

const Demo = (args: RepeatCreateProps) => <RepeatCreate {...args} />

export const Basic = Demo.bind({})
Basic.args = {}
