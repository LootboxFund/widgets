import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import CrowdSale, { CrowdSaleProps } from './index'


export default {
  title: 'CrowdSale',
  component: CrowdSale,
}

const Template = (args: CrowdSaleProps) => (
	<ThemeProvider theme={theme}>
		<CrowdSale {...args} />
	</ThemeProvider>
)

export const Basic = Template.bind({})
Basic.args = {}
