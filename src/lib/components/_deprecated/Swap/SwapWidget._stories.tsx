import React from 'react'
import SwapWidget, { SwapWidgetProps } from './index'
import { $CardViewport } from '../../Generics'

export default {
  title: 'SwapWidget',
  component: SwapWidget,
}

const Demo = (args: SwapWidgetProps) => (
  <$CardViewport>
    <SwapWidget {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
