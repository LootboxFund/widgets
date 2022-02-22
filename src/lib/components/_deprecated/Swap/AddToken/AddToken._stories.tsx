import React from 'react'
import AddToken, { AddTokenProps } from 'lib/components/_deprecated/Swap/AddToken'
import { $CardViewport } from 'lib/components/Generics'

export default {
  title: 'AddToken',
  component: AddToken,
}

const Demo = (args: AddTokenProps) => (
  <$CardViewport>
    <AddToken {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
