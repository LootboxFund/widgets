import React from 'react'
import QuickCreate, { QuickCreateProps } from 'lib/components/QuickCreate'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'
import { ContractAddress } from '@wormgraph/helpers'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'

export default {
  title: 'QuickCreate',
  component: QuickCreate,
}
const network = {
  name: 'Polygon',
  symbol: 'MATIC',
  themeColor: '#8F5AE8',
  chainIdHex: '0x13881',
  chainIdDecimal: '80001',
  isAvailable: true,
  isTestnet: true,
  icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC_COLORED.png?alt=media',
  priceFeed: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada' as ContractAddress,
  faucetUrl: 'https://faucet.polygon.technology/',
  blockExplorerUrl: 'https://mumbai.polygonscan.com/',
}
const Demo = (args: QuickCreateProps) => {
  const web3Utils = useWeb3Utils()
  return (
    <LocalizationWrapper>
      <QuickCreate
        {...args}
        tournamentName={'3PG Axie Tournament'}
        network={network}
        fundraisingLimit={web3Utils.toBN(web3Utils.toWei('1', 'ether'))}
        fundraisingTarget={web3Utils.toBN(web3Utils.toWei('1', 'ether'))}
      />
    </LocalizationWrapper>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
