import React, { useEffect, useState } from 'react'
import StepChooseReturns, { StepChooseReturnsProps } from 'lib/components/CreateLootbox/StepChooseReturns'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Choose Returns',
  component: StepChooseReturns,
}

const Demo = (args: StepChooseReturnsProps) => {
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [returnTarget, setReturnTarget] = useState<number>();
  const [paybackDate, setPaybackDate] = useState<Date>();
  useEffect(() => {
    if (returnTarget && paybackDate) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [returnTarget, paybackDate])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepChooseReturns
        selectedNetwork={network}
        returnTarget={returnTarget}
        setReturnTarget={(amount: number) => setReturnTarget(amount)}
        paybackDate={paybackDate}
        setPaybackDate={(date: Date | null) => date && setPaybackDate(date)}
        stage={stage}
        onNext={() => console.log("onNext")}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
