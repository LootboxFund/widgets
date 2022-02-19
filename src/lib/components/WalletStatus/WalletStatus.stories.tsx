import React, { useEffect } from 'react'
import WalletStatus, { WalletStatusProps } from 'lib/components/WalletStatus'
import Web3 from 'web3'

export default {
  title: 'WalletStatus',
  component: WalletStatus,
}

const Template = (args: WalletStatusProps) => {
  useEffect(() => {
    (window as any).Web3 = Web3
  }, [])
  return <WalletStatus {...args} />
}

export const Basic = Template.bind({})
Basic.args = {}
