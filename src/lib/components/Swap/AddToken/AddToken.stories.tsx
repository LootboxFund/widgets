import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import AddToken, { AddTokenProps } from 'lib/components/Swap/AddToken'
import { $CardViewport } from 'lib/components/Generics'


export default {
  title: 'AddToken',
  component: AddToken,
}

const Demo = (args: AddTokenProps) => (
	<$CardViewport>
		<ThemeProvider theme={theme}>
			<AddToken {...args} />
		</ThemeProvider>
	</$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
