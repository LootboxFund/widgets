import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import BuySharesWidget, { BuySharesWidgetProps } from './index'
import { $CardViewport } from '../Generics'

export default {
  title: 'CrowdSaleWidget',
  component: BuySharesWidget,
}

const Demo = (args: BuySharesWidgetProps) => (
  <$CardViewport>
    <ThemeProvider theme={theme}>
      <BuySharesWidget {...args} />
    </ThemeProvider>
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
