import React from 'react'
import BuySharesWidget, { BuySharesWidgetProps } from './index'
import { $CardViewport } from '../Generics'

export default {
  title: 'BuySharesWidget',
  component: BuySharesWidget,
}

const Demo = (args: BuySharesWidgetProps) => (
  <$CardViewport>
    <BuySharesWidget {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
