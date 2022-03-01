import react, { forwardRef } from 'react'
import BuyShares from 'lib/components/BuyShares'
import TicketCard from 'lib/components/TicketCard'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketMinterState } from './state'
import useWindowSize from 'lib/hooks/useScreenSize'
import React from 'react'

export const $TicketMinterContainer = styled.section`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; */
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
  height: 100%;
`

const TicketMinter = forwardRef((props: {}, ref: React.RefObject<HTMLDivElement>) => {
  const snap = useSnapshot(ticketMinterState)
  const { screen } = useWindowSize()
  const buyWidth = screen === 'desktop' ? '65%' : '100%'
  const ticketWidth = screen === 'desktop' ? '35%' : '0%'
  return (
    <$TicketMinterContainer>
      {ref && <div ref={ref} />}
      <$Row>
        <$Col width={buyWidth}>
          <BuyShares />
        </$Col>
        {screen === 'desktop' ? (
          <$Col width={ticketWidth}>
            <TicketCard ticketID={snap.ticketID} />
          </$Col>
        ) : null}
      </$Row>
    </$TicketMinterContainer>
  )
})

export default TicketMinter
