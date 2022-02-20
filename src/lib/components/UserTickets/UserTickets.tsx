import react, { useState } from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal, $ScrollHorizontal } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import { $Icon } from 'lib/components/TicketCard/TicketCard'
import useWindowSize from 'lib/hooks/useScreenSize'
import styled from 'styled-components'

const TICKET_PAGINATION = 3

const UserTickets = () => {
  const snap = useSnapshot(userTicketState)
  const { screen } = useWindowSize()
  const [pageIdx, setPageIdx] = useState(0)
  const isPaginated = screen === 'desktop'

  const ticketCopy: (string | undefined)[] = [...snap.userTickets]

  if (ticketCopy.length >= TICKET_PAGINATION) {
    ticketCopy.unshift(undefined) // Adds a placeholder at the front of list
  }

  const tickets: (string | undefined)[] = isPaginated
    ? ticketCopy.slice(pageIdx, pageIdx + TICKET_PAGINATION)
    : [...ticketCopy]

  if (tickets.length < TICKET_PAGINATION) {
    for (let i = 0; i < TICKET_PAGINATION - ticketCopy.length; i++) {
      tickets.push(undefined)
    }
  }

  const decrementPage = () => {
    if (pageIdx === 0) {
      const newIdx = snap.userTickets.length - TICKET_PAGINATION
      setPageIdx(newIdx > 0 ? newIdx : 0)
    } else {
      setPageIdx(pageIdx - 1)
    }
  }

  const incrementPage = () => {
    if (pageIdx + 1 + TICKET_PAGINATION > ticketCopy.length) {
      setPageIdx(0)
    } else {
      setPageIdx(pageIdx + 1)
    }
  }

  const Wrapper = ({ children }: { children: JSX.Element[] }) => {
    if (isPaginated) {
      return (
        <$Horizontal justifyContent="center" height="100%" width="100%" spacing={3}>
          <$IconWrapper onClick={decrementPage}>
            <$Icon size="56px">{'<'}</$Icon>
          </$IconWrapper>
          <$Horizontal wrap overflow justifyContent="center" height="100%" width="100%" spacing={3}>
            {children}
          </$Horizontal>
          <$IconWrapper onClick={incrementPage}>
            <$Icon size="56px">{'>'}</$Icon>
          </$IconWrapper>
        </$Horizontal>
      )
    } else {
      return <$ScrollHorizontal>{children}</$ScrollHorizontal>
    }
  }

  return (
    <Wrapper>
      {tickets.map((ticketID, idx) => (
        <$TicketWrapper>
          <TicketCard
            key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}
            ticketID={ticketID}
            isRedeemEnabled={true}
          ></TicketCard>
        </$TicketWrapper>
      ))}
    </Wrapper>
  )
}

const $IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  margin: auto 0px;
`

const $TicketWrapper = styled.div`
  max-width: 260px;
  min-width: 220px;
  width: 100%;
  height: 100%;
`

export default UserTickets
