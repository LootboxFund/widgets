import react, { useState } from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal, $ScrollHorizontal } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import { $Icon } from 'lib/components/TicketCard/TicketCard'
import useWindowSize from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { Address } from '@wormgraph/helpers'
import RightChevronIcon from 'lib/theme/icons/Right.icon'
import LeftChevronIcon from 'lib/theme/icons/Left.icon'

const TICKET_PAGINATION = 3

interface Props {
  onScrollToMint?: () => void
}
const UserTickets = (props: Props) => {
  const snap = useSnapshot(userTicketState)
  const { screen } = useWindowSize()
  const [pageIdx, setPageIdx] = useState(0)
  const isPaginated = screen === 'desktop'

  const ticketCopy: (string | undefined)[] = [...snap.userTickets].reverse() as Address[]

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
        <$Horizontal justifyContent="center" height="100%" width="100%" spacing={3} position="relative" verticalCenter>
          <LeftChevronIcon onClick={decrementPage} />
          <$Horizontal justifyContent="center" height="100%" width="100%" spacing={3}>
            {children}
          </$Horizontal>
          <RightChevronIcon onClick={incrementPage} />
        </$Horizontal>
      )
    } else {
      return <$ScrollHorizontal height="100%">{children}</$ScrollHorizontal>
    }
  }

  return (
    <Wrapper>
      {tickets.map((ticketID, idx) => (
        <$TicketWrapper key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}>
          <TicketCard ticketID={ticketID} isRedeemEnabled={true} onScrollToMint={props.onScrollToMint}></TicketCard>
        </$TicketWrapper>
      ))}
    </Wrapper>
  )
}

const $TicketWrapper = styled.div`
  max-width: 260px;
  min-width: 220px;
  width: 100%;
  height: 100%;
`

export default UserTickets
