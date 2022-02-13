import React from 'react'
import CrowdSaleWidget, { CrowdSaleWidgetProps } from './index'
import { $CardViewport } from '../Generics'

export default {
  title: 'CrowdSaleWidget',
  component: CrowdSaleWidget,
}

const Demo = (args: CrowdSaleWidgetProps) => (
  <$CardViewport>
    <CrowdSaleWidget {...args} />
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
