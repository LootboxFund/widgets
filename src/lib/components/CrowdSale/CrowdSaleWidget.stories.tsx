import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import CrowdSaleWidget, { CrowdSaleWidgetProps } from './index'
import { $CardViewport } from '../Generics'

export default {
  title: 'CrowdSaleWidget',
  component: CrowdSaleWidget,
}

const Demo = (args: CrowdSaleWidgetProps) => (
  <$CardViewport>
    <ThemeProvider theme={theme}>
      <CrowdSaleWidget {...args} />
    </ThemeProvider>
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
