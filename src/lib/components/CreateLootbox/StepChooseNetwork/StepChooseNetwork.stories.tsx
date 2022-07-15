import React, { useState } from 'react'
import StepChooseNetwork, { StepChooseNetworkProps } from 'lib/components/CreateLootbox/StepChooseNetwork'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import { NetworkOption } from 'lib/api/network'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'CreateLootbox Step - Choose Network',
  component: StepChooseNetwork,
}

const Demo = (args: StepChooseNetworkProps) => {
  const [network, setNetwork] = useState<NetworkOption>()
  const [stage, setStage] = useState<StepStage>('in_progress')
  const selectNetwork = (network: NetworkOption) => {
    console.log('Selecting network: ', network)
    setNetwork(network)
    setStage('may_proceed')
  }
  return (
    <LocalizationWrapper>
      <div style={{ width: '760px', height: '600px' }}>
        <StepChooseNetwork
          selectedNetwork={network}
          stage={stage}
          onSelectNetwork={selectNetwork}
          onNext={() => console.log('onNext')}
          setValidity={(bool: boolean) => console.log(bool)}
          setDoesNetworkMatch={(bool: boolean) => console.log(bool)}
        />
      </div>
    </LocalizationWrapper>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
