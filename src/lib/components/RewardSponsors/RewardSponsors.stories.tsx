import React, { useEffect } from 'react'
import RewardSponsors, { RewardSponsorsProps } from 'lib/components/RewardSponsors'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { TicketID, ContractAddress } from '@wormgraph/helpers'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'Reward Sponsors',
  component: RewardSponsors,
}

const Template = (args: RewardSponsorsProps) => {
  useEffect(() => {
    initDApp().catch((err) => console.error(err))
  }, [])
  const network = {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: '0x61',
    chainIdDecimal: '97',
    isAvailable: true,
    isTestnet: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
    faucetUrl: 'https://testnet.binance.org/faucet-smart',
    blockExplorerUrl: 'https://bscscan.com/',
  }
  return (
    <LocalizationWrapper>
      <RewardSponsors
        {...args}
        lootboxAddress={'0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress}
        lootboxType={'Escrow'}
        network={network}
      />
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
