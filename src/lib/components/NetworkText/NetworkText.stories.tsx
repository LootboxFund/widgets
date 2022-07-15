import React from 'react'
import NetworkText, { NetworkTextProps } from 'lib/components/NetworkText'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'NetworkText',
  component: NetworkText,
}

const Demo = (args: NetworkTextProps) => (
  <LocalizationWrapper>
    <NetworkText {...args} />
  </LocalizationWrapper>
)

export const Basic = Demo.bind({})
Basic.args = {}
