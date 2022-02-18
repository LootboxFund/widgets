import React from 'react'
import ManageTokens, { ManageTokensProps } from 'lib/components/Swap/ManageTokens'
import { $CardViewport } from 'lib/components/Generics'

export default {
  title: 'ManageTokens',
  component: ManageTokens,
}

const Demo = (args: ManageTokensProps) => (
  <$CardViewport>
    <ManageTokens {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
