import React, { useEffect, useState } from 'react'
import StepCustomize, { StepCustomizeProps } from 'lib/components/CreateLootbox/StepCustomize'
import { StepStage } from 'lib/components/StepCard'


export default {
  title: 'CreateLootbox Step - Customize',
  component: StepCustomize,
}


const Demo = (args: StepCustomizeProps) => {
  const INITIAL_TICKET: Record<string, string> = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: '',
    lootboxThemeColor: '',
    logoUrl: '',
    coverUrl: '',
  }
  const [stage, setStage] = useState<StepStage>("in_progress")
  const [ticketState, setTicketState] = useState(INITIAL_TICKET);
  useEffect(() => {
    if (ticketState.name && ticketState.symbol && ticketState.biography && ticketState.pricePerShare && ticketState.lootboxThemeColor && ticketState.logoUrl && ticketState.coverUrl) {
      setStage("may_proceed")
    } else {
      setStage("in_progress")
    }
  }, [ticketState])
  const network = { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' }

  const updateTicketState = (slug: string, text: string) => {
    setTicketState({ ...ticketState, [slug]: text })
  }
  return (
    <div style={{ width: '760px', height: '600px' }}>
      <StepCustomize
        ticketState={ticketState}
        updateTicketState={updateTicketState}
        selectedNetwork={network}
        stage={stage}
        onNext={() => console.log("onNext")}
      />
    </div>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
