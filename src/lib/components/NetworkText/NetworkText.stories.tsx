import React from 'react'
import NetworkText, { NetworkTextProps } from 'lib/components/NetworkText'


export default {
  title: 'NetworkText',
  component: NetworkText,
}

const Demo = (args: NetworkTextProps) => (
  <NetworkText {...args} />
)

export const Basic = Demo.bind({})
Basic.args = {}
