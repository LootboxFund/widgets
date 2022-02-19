import React, { useEffect, useState } from 'react'
import StepSocials, { StepSocialsProps } from 'lib/components/CreateLootbox/StepSocials'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Socials',
  component: StepSocials,
}


const Demo = (args: StepSocialsProps) => {
  const INITIAL_SOCIALS: Record<string, string> = {
    twitter: '',
    email: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    discord: '',
    youtube: '',
    snapchat: '',
    twitch: '',
    web: ''
  }
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [socialState, setSocialState] = useState(INITIAL_SOCIALS);
  useEffect(() => {
    if (socialState.email) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [socialState.email])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }

  const updateSocialState = (slug: string, text: string) => {
    setSocialState({ ...socialState, [slug]: text })
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepSocials
        setValidity={(valid: boolean) => { }}
        socialState={socialState}
        updateSocialState={updateSocialState}
        selectedNetwork={network}
        stage={stage}
        onNext={() => console.log("onNext")}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
