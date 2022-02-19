import React, { useEffect, useState } from 'react'
import StepTermsConditions, { StepTermsConditionsProps } from 'lib/components/CreateLootbox/StepTermsConditions'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Terms',
  component: StepTermsConditions,
}


const Demo = (args: StepTermsConditionsProps) => {
  const INITIAL_TERMS: Record<string, boolean> = {
    agreeEthics: false,
    agreeLiability: false,
    agreeVerify: false
  }
  const reputationWallet = "0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A"
  const [treasuryWallet, setTreasuryWallet] = useState("0xA86E179eCE6785ad758cd35d81006C12EbaF8D2A")
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [termsState, setTermsState] = useState(INITIAL_TERMS);
  useEffect(() => {
    if (termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && treasuryWallet) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [termsState])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }

  const updateTermsState = (slug: string, bool: boolean) => {
    setTermsState({ ...termsState, [slug]: bool })
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepTermsConditions
        setValidity={(valid: boolean) => { }}
        allConditionsMet={stage === "may_proceed"}
        termsState={termsState}
        updateTermsState={updateTermsState}
        selectedNetwork={network}
        stage={stage}
        reputationWallet={reputationWallet}
        treasuryWallet={treasuryWallet}
        updateTreasuryWallet={setTreasuryWallet}
        onNext={() => console.log("onNext")}
        onSubmit={() => console.log('onSubmit')}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
