import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import ManageTokens, { ManageTokensProps } from 'lib/components/Swap/ManageTokens'
import { $CardViewport } from 'lib/components/Generics'


export default {
  title: 'ManageTokens',
  component: ManageTokens,
}

const Demo = (args: ManageTokensProps) => (
	<$CardViewport>
		<ThemeProvider theme={theme}>
			<ManageTokens {...args} />
		</ThemeProvider>
	</$CardViewport>
)

export const Basic = Demo.bind({})
Basic.args = {}
