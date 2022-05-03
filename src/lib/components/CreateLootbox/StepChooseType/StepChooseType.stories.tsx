import React, { useState } from 'react'
import StepChooseType, { LootboxType, StepChooseTypeProps } from 'lib/components/CreateLootbox/StepChooseType'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import { ContractAddress } from '@wormgraph/helpers'

export default {
  title: 'CreateLootbox Step - Choose Type',
  component: StepChooseType,
}

const Demo = (args: StepChooseTypeProps) => {
  const [lootboxType, setLootboxType] = useState<LootboxType>('escrow')
  const [stage, setStage] = useState<StepStage>('in_progress')
  const selectType = (type: LootboxType) => {
    console.log('Selecting type: ', type)
    setLootboxType(type)
    setStage('may_proceed')
  }
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
      <StepChooseType
        selectedType={lootboxType}
        selectedNetwork={network}
        stage={stage}
        onSelectType={selectType}
        onNext={() => console.log('onNext')}
        setValidity={(bool: boolean) => console.log(bool)}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
