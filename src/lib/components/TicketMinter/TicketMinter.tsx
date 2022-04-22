import React, { forwardRef } from 'react'
import BuyShares from 'lib/components/BuyShares'
import TicketCard from 'lib/components/TicketCard'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketMinterState } from './state'
import useWindowSize from 'lib/hooks/useScreenSize'
import FundraisingProgressBar from '../FundraisingProgressBar'
import { ContractAddress } from '@wormgraph/helpers'
import { smallScreens } from 'lib/hooks/constants'

export const $TicketMinterContainer = styled.section`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`

const $Row = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`

const $Col = styled.section<{ width: string }>`
  width: ${(props) => props.width};
`

const $TicketWrapper = styled.section<{ screen: string | undefined }>`
  height: ${(props) => (props.screen === 'mobile' ? '520px !important' : '100%')};
  padding-bottom: ${(props) => (props.screen === 'mobile' ? '30px' : '0px')};
`

const TicketMinter = forwardRef((props: {}, ref: React.RefObject<HTMLDivElement>) => {
  const snap = useSnapshot(ticketMinterState)
  const { screen } = useWindowSize()
  const isMobile = smallScreens.indexOf(screen) >= 0
  const buyWidth = '100%'
  const ticketWidth = '100%'

  return (
    <$TicketMinterContainer>
      {ref && <div ref={ref} />}
      <FundraisingProgressBar lootbox={snap.lootboxAddress as ContractAddress | undefined} />
      <$Row
        style={
          isMobile
            ? {
                flexDirection: 'column-reverse',
              }
            : {}
        }
      >
        <$Col width={buyWidth}>
          <BuyShares />
        </$Col>
        {/* {isMobile ? (
          <$Col width={ticketWidth}>
            <$TicketWrapper screen={screen}>
              <TicketCard ticketID={snap.ticketID} />
            </$TicketWrapper>
          </$Col>
        ) : undefined} */}
      </$Row>
    </$TicketMinterContainer>
  )
})

export default TicketMinter
