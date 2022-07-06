import react, { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { $Horizontal, $ScrollHorizontal, $Vertical } from '../Generics'
import TicketCard from 'lib/components/TicketCard'
import useWindowSize from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { Address, ContractAddress } from '@wormgraph/helpers'
import RightChevronIcon from 'lib/theme/icons/Right.icon'
import LeftChevronIcon from 'lib/theme/icons/Left.icon'
import { $BuySharesHeaderSubTitle, $BuySharesHeaderTitle } from '../BuyShares/Header'
import { fetchUserTicketsFromLootbox } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'
import { loadLootboxMetadata } from 'lib/state/lootbox.state'
import { loadTicketData } from '../TicketCard/state'
import { promiseChainDelay } from 'lib/utils/promise'

const TICKET_PAGINATION = 3

interface Props {
  lootboxAddress?: Address
}
const UserTicketsSimple = (props: Props) => {
  const { screen } = useWindowSize()
  const [tickets, setTickets] = useState<number[]>([])
  const [pageIdx, setPageIdx] = useState(0)
  const isPaginated = screen === 'desktop'

  const ticketCopy: (number | undefined)[] = [...tickets.map((e) => Number(e.toString()))].reverse()
  ticketCopy.sort((a: number, b: number) => a - b)

  const ticketsPaginated: (number | undefined)[] = isPaginated
    ? ticketCopy.slice(pageIdx, pageIdx + TICKET_PAGINATION)
    : [...ticketCopy]

  if (ticketsPaginated.length < TICKET_PAGINATION) {
    for (let i = 0; i < TICKET_PAGINATION - ticketCopy.length; i++) {
      ticketsPaginated.push(undefined)
    }
  }

  useEffect(() => {
    if (props.lootboxAddress && userState.currentAccount) {
      fetchUserTicketsFromLootbox(userState.currentAccount, props.lootboxAddress)
        .then((_tickets) => {
          setTickets(_tickets)
          return promiseChainDelay(_tickets.map(loadTicketData))
        })
        .catch((err) => {
          console.error('error loading user tickets', err)
        })
    }
  }, [props.lootboxAddress, userState.currentAccount, loadTicketData, setTickets])

  const decrementPage = () => {
    if (pageIdx === 0) {
      const newIdx = tickets.length - TICKET_PAGINATION
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
          <div>
            <LeftChevronIcon onClick={decrementPage} />
          </div>
          <$Horizontal justifyContent="center" height="100%" width="100%" spacing={3}>
            {children}
          </$Horizontal>
          <div>
            <RightChevronIcon onClick={incrementPage} />
          </div>
        </$Horizontal>
      )
    } else {
      return <$ScrollHorizontal height="100%">{children}</$ScrollHorizontal>
    }
  }

  return (
    <$Vertical height="100%" width="100%">
      <Wrapper>
        {ticketsPaginated.map((ticketID, idx) => (
          <$TicketWrapper key={`${props.lootboxAddress}-ticket-${ticketID}-${idx}`}>
            <TicketCard
              ticketID={ticketID?.toString()}
              isRedeemEnabled={true}
              // staticHeight="320px"
              allowNFTTransferUI
            ></TicketCard>
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

export default UserTicketsSimple
