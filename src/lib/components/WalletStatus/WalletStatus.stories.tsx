import React from 'react'
import WalletStatus, { WalletStatusProps } from 'lib/components/WalletStatus'

export default {
  title: 'WalletStatus',
  component: WalletStatus,
}

const Template = (args: WalletStatusProps) => <WalletStatus {...args} />

export const Basic = Template.bind({})
Basic.args = {}
