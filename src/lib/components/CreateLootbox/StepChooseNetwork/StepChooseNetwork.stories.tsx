import React, { useState } from 'react'
import StepChooseNetwork, { NetworkOption, StepChooseNetworkProps } from 'lib/components/CreateLootbox/StepChooseNetwork'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Choose Network',
  component: StepChooseNetwork,
}

const Demo = (args: StepChooseNetworkProps) => {
  const [network, setNetwork] = useState<NetworkOption>()
  const [stage, setStage] = useState<StepStage>("in_progress")
  const selectNetwork = (network: NetworkOption) => {
    console.log("Selecting network: ", network)
    setNetwork(network)
    setStage("may_proceed")
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepChooseNetwork selectedNetwork={network} stage={stage} onSelectNetwork={selectNetwork} onNext={() => console.log("onNext")} />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
