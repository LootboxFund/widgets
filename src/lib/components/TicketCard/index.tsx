import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import ViewPayout from 'lib/components/TicketCard/ViewPayout'
import { useSnapshot } from 'valtio'
import { ticketCardState, loadTicketData } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import RedeemButton from 'lib/components/TicketCard/RedeemButton'
import styled from 'styled-components'
import { generateStateID } from './state'
import { ContractAddress } from '@wormgraph/helpers'

export interface TicketCardWidgetProps {
  ticketID: string | undefined
  isRedeemEnabled?: boolean
  onScrollToMint?: () => void
  forceLoading?: boolean
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const snap = useSnapshot(ticketCardState)
  const stateID =
    snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID]

  useEffect(() => {
    window.onload = async () => {
      const lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      ticketCardState.lootboxAddress = lootboxAddress
      try {
        await initDApp()
      } catch (err) {
        console.error('Error loading DApp in TicketCard', err)
      }
      if (props.ticketID) {
        loadTicketData(props.ticketID).catch((err) => console.error('Error loading ticket data', err))
      }
    }
  }, [])

  useEffect(() => {
    if (props.ticketID) {
      loadTicketData(props.ticketID).catch((err) => console.error(err))
    }
  }, [props.ticketID])

  const dividends = ticket && ticket.dividends
  const activeDividends = dividends && dividends.filter((dividend) => !dividend.isRedeemed)
  const isRedeemable = activeDividends && activeDividends.length > 0

  return (
    <$RootContainer>
      {ticket && ticket.route === '/payout' ? (
        <ViewPayout ticketID={props.ticketID} />
      ) : (
        <TicketCard ticketID={props.ticketID} onScrollToMint={props.onScrollToMint} forceLoading={props.forceLoading} />
      )}
      {props.isRedeemEnabled && <RedeemButton ticketID={props.ticketID} isRedeemable={isRedeemable as boolean} />}
    </$RootContainer>
  )
}

export const $RootContainer = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export default TicketCardWidget
