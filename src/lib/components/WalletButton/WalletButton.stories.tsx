import React from 'react'
import WalletButton, { WalletButtonProps } from 'lib/components/WalletButton'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'WalletButton',
  component: WalletButton,
}

const Template = (args: WalletButtonProps) => (
  <LocalizationWrapper>
    <WalletButton {...args} />
  </LocalizationWrapper>
)

export const Basic = Template.bind({})
Basic.args = {}
