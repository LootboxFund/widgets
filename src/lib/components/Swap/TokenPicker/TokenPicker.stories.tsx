import React from 'react'
import TokenPicker, { TokenPickerProps } from 'lib/components/Swap/TokenPicker'
import { $CardViewport } from 'lib/components/Generics'

export default {
  title: 'TokenPicker',
  component: TokenPicker,
}

const Demo = (args: TokenPickerProps) => (
  <$CardViewport>
    <TokenPicker {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
