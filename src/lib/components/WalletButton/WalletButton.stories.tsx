import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import WalletButton, { WalletButtonProps } from 'lib/components/WalletButton'


export default {
  title: 'WalletButton',
  component: WalletButton,
}

const Template = (args: WalletButtonProps) => (
	<ThemeProvider theme={theme}>
		<WalletButton {...args} />
	</ThemeProvider>
)

export const Basic = Template.bind({})
Basic.args = {}
