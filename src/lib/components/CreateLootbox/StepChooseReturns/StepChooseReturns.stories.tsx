import React, { useEffect, useState } from 'react'
import StepChooseReturns, { StepChooseReturnsProps } from 'lib/components/CreateLootbox/StepChooseReturns'
import { StepStage } from 'lib/components/StepCard'
import { BigNumber } from 'bignumber.js';
import { useWeb3Utils } from 'lib/hooks/useWeb3Api';


export default {
  title: 'CreateLootbox Step - Choose Returns',
  component: StepChooseReturns,
}

const Demo = (args: StepChooseReturnsProps) => {
  const web3Utils = useWeb3Utils()
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [returnTarget, setReturnTarget] = useState(30);
  const [paybackDate, setPaybackDate] = useState<string>();
  useEffect(() => {
    if (returnTarget && paybackDate) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [returnTarget, paybackDate])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media', priceFeed: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526" }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepChooseReturns
        setValidity={(valid: boolean) => { }}
        selectedNetwork={network}
        fundraisingTarget={web3Utils.toBN(web3Utils.toWei("1", "ether"))}
        basisPoints={returnTarget}
        setBasisPoints={(basisPoints: number) => setReturnTarget(basisPoints)}
        paybackDate={paybackDate}
        setPaybackDate={(date: string) => date && setPaybackDate(date)}
        stage={stage}
        onNext={() => console.log("onNext")}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}