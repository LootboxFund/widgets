import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import { useSnapshot } from 'valtio'
import { ticketCardState, initializeLootbox, loadTicketData } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { Address } from 'lib/types'

export interface TicketCardWidgetProps {
  lootboxAddress: Address | undefined
  ticketID: string | undefined
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const snap = useSnapshot(ticketCardState)

  useEffect(() => {
    window.onload = () => {
      initDApp()
        .then(() => (props.lootboxAddress ? initializeLootbox(props.lootboxAddress) : undefined))
        .then(() => (props.ticketID ? loadTicketData(props.ticketID) : undefined))
        .catch((err) => console.error(err))
    }
  }, [])

  return <TicketCard ticketID={props.ticketID} />
}

export default TicketCardWidget
