import React from 'react'
import WalletButton, { WalletButtonProps } from 'lib/components/WalletButton'

export default {
  title: 'WalletButton',
  component: WalletButton,
}

const Template = (args: WalletButtonProps) => <WalletButton {...args} />

export const Basic = Template.bind({})
Basic.args = {}
