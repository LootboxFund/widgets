import React, { useEffect, useState } from 'react'
import StepCustomize, { StepCustomizeProps } from 'lib/components/CreateLootbox/StepCustomize'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import BN from 'bignumber.js'
import useHtmlScript, { useHtmlFirebaseStorage } from 'lib/api/useHtmlScript'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'CreateLootbox Step - Customize',
  component: StepCustomize,
}

const Demo = (args: StepCustomizeProps) => {
  const INITIAL_TICKET: Record<string, string | number> & { logoFile?: File; coverFile?: File; badgeFile?: File } = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: 0.05,
    lootboxThemeColor: '#B48AF7',
    logoUrl: 'https://gateway.pinata.cloud/ipfs/Qmdit9THgH3ifxYZnc4f1oHtifwxVcGMeVdUpWCPD2LuYC',
    coverUrl: 'https://gateway.pinata.cloud/ipfs/QmdZ2uzY9N77j95Vib8nM8AXBfDC4RctqefRwGLZjdsyxN',
    badgeUrl: 'https://i.pinimg.com/736x/14/b4/c2/14b4c205eba27ac480719a51adc98169.jpg',
  }
  const [stage, setStage] = useState<StepStage>('in_progress')
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  useEffect(() => {
    if (
      ticketState.name &&
      ticketState.symbol &&
      ticketState.biography &&
      ticketState.pricePerShare &&
      ticketState.lootboxThemeColor &&
      ticketState.logoUrl &&
      ticketState.coverUrl
    ) {
      setStage('may_proceed')
    } else {
      setStage('in_progress')
    }
  }, [ticketState])
  const network = {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: 'a',
    chainIdDecimal: '',
    isAvailable: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
  }

  const updateTicketState = (slug: string, value: string | number) => {
    setTicketState({ ...ticketState, [slug]: value })
  }
  return (
    <LocalizationWrapper>
      <div style={{ width: '760px', height: '600px' }}>
        <StepCustomize
          setValidity={(valid: boolean) => {}}
          ticketState={ticketState}
          updateTicketState={updateTicketState}
          selectedNetwork={network}
          stage={stage}
          fundraisingTarget={new BN('10000000000000000000')}
          onNext={() => console.log('onNext')}
        />
      </div>
    </LocalizationWrapper>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
