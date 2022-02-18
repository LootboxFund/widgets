import React, { useEffect, useState } from 'react'
import StepChooseFunding, { NetworkOption, StepChooseFundingProps } from 'lib/components/CreateLootbox/StepChooseFunding'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Choose Funding',
  component: StepChooseFunding,
}

const Demo = (args: StepChooseFundingProps) => {
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [fundraisingTarget, setFundraisingTarget] = useState<string>("");
  const [receivingWallet, setReceivingWallet] = useState<string>("");
  useEffect(() => {
    if (fundraisingTarget && receivingWallet) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [fundraisingTarget, receivingWallet])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepChooseFunding
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        setFundraisingTarget={(amount: string) => setFundraisingTarget(amount)}
        receivingWallet={receivingWallet}
        setReceivingWallet={(addr: string) => setReceivingWallet(addr)}
        stage={stage}
        onNext={() => console.log("onNext")}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
