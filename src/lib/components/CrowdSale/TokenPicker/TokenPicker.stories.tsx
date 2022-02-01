import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import TokenPicker, { TokenPickerProps } from 'lib/components/CrowdSale/TokenPicker'
import { $CardViewport } from 'lib/components/Generics'

export default {
  title: 'TokenPicker',
  component: TokenPicker,
}

const Demo = (args: TokenPickerProps) => (
  <$CardViewport>
    <ThemeProvider theme={theme}>
      <TokenPicker {...args} />
    </ThemeProvider>
  </$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
