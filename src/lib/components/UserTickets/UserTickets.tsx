import react, { useState } from 'react'
import { userTicketState } from './state'
import { useSnapshot } from 'valtio'
import { $Horizontal, $ScrollHorizontal, $Vertical } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import useWindowSize from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { Address } from '@wormgraph/helpers'
import RightChevronIcon from 'lib/theme/icons/Right.icon'
import LeftChevronIcon from 'lib/theme/icons/Left.icon'
import { $BuySharesHeaderSubTitle, $BuySharesHeaderTitle } from '../BuyShares/Header'
import { buySharesState } from '../BuyShares/state'

const TICKET_PAGINATION = 3

interface Props {
  onScrollToMint?: () => void
}
const UserTickets = (props: Props) => {
  const snap = useSnapshot(userTicketState)
  const buySharesSnapshot = useSnapshot(buySharesState)
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

  const subheader = buySharesSnapshot.lootbox?.data
    ? `${buySharesSnapshot.lootbox.data?.variant} Lootbox - ${buySharesSnapshot.lootbox.data?.name}`
    : undefined

  return (
    <$Vertical height="100%" width="100%">
      <$Vertical padding={screen === 'mobile' || screen === 'tablet' ? '0px 0px 20px 0px' : '0px 0px 20px 75px'}>
        <$BuySharesHeaderTitle>REDEEM PROFIT SHARING</$BuySharesHeaderTitle>
        {subheader ? <$BuySharesHeaderSubTitle>{subheader}</$BuySharesHeaderSubTitle> : undefined}
      </$Vertical>
      <Wrapper>
        {tickets.map((ticketID, idx) => (
          <$TicketWrapper key={`${snap.lootboxAddress}-ticket-${ticketID}-${idx}`}>
            <TicketCard ticketID={ticketID} isRedeemEnabled={true} onScrollToMint={props.onScrollToMint} staticHeight="320px"></TicketCard>
          </$TicketWrapper>
        ))}
      </Wrapper>
    </$Vertical>
  )
}

const $TicketWrapper = styled.div`
  max-width: 280px;
  min-width: 240px;
  width: 100%;
`

export default UserTickets
