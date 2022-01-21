import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import Swap from '.'

export default {
  title: 'Swap',
  component: Swap,
}

const Template = () => (
	<ThemeProvider theme={theme}>
		<Swap />
	</ThemeProvider>
)

export const Basic = Template.bind({})
Basic.args = {}
