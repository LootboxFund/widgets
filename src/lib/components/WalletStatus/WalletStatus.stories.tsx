import React, { useEffect } from 'react'
import WalletStatus, { WalletStatusProps } from 'lib/components/WalletStatus'
import Web3 from 'web3'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'WalletStatus',
  component: WalletStatus,
}

const Template = (args: WalletStatusProps) => {
  useEffect(() => {}, [])
  return (
    <LocalizationWrapper>
      <WalletStatus {...args} />
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
