import React, { useEffect, useState } from 'react'
import StepChooseFunding, { StepChooseFundingProps } from 'lib/components/CreateLootbox/StepChooseFunding'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import Web3 from 'web3'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { BigNumber } from 'bignumber.js'
import { Address, ContractAddress } from '@lootboxfund/helpers'

export default {
  title: 'CreateLootbox Step - Choose Funding',
  component: StepChooseFunding,
}

const Demo = (args: StepChooseFundingProps) => {
  const web3Utils = useWeb3Utils()
  const [stage, setStage] = useState<StepStage>('in_progress')
  const [fundraisingTarget, setFundraisingTarget] = useState(web3Utils.toWei('1', 'ether'))
  const [receivingWallet, setReceivingWallet] = useState<Address>('' as Address)
  useEffect(() => {
    ;(window as any).Web3 = Web3
  }, [])
  useEffect(() => {
    if (fundraisingTarget && receivingWallet) {
      setStage('may_proceed')
    } else {
      setStage('in_progress')
    }
  }, [fundraisingTarget, receivingWallet])
  const network = {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: 'a',
    chainIdDecimal: '',
    isAvailable: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepChooseFunding
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        setFundraisingTarget={(amount: BigNumber) => setFundraisingTarget(amount)}
        receivingWallet={receivingWallet}
        setReceivingWallet={(addr: Address) => setReceivingWallet(addr)}
        stage={stage}
        setValidity={(valid: boolean) => {}}
        onNext={() => console.log('onNext')}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
