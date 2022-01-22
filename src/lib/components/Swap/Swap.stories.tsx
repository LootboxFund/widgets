import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import Swap from '.'
import { $CardViewport } from '../Generics'

export default {
  title: 'Swap',
  component: Swap,
}

const Template = () => (
	<$CardViewport>
		<ThemeProvider theme={theme}>
			<Swap />
		</ThemeProvider>
	</$CardViewport>
)

export const Basic = Template.bind({})
Basic.args = {}
