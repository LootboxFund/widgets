import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import SwapWidget, { SwapWidgetProps } from './index'
import { $CardViewport } from '../Generics'


export default {
  title: 'SwapWidget',
  component: SwapWidget,
}

const Demo = (args: SwapWidgetProps) => (
	<$CardViewport>
		<ThemeProvider theme={theme}>
			<SwapWidget {...args} />
		</ThemeProvider>
	</$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
