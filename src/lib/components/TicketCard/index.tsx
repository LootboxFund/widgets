import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import { useSnapshot } from 'valtio'
import { ticketCardState, initializeLootbox, loadTicketData } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { Address } from 'lib/types'

export interface TicketCardWidgetProps {
  ticketID: string | undefined
}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const snap = useSnapshot(ticketCardState)

  useEffect(() => {
    window.onload = () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      initDApp()
        .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
        .then(() => (props.ticketID ? loadTicketData(props.ticketID) : undefined))
        .catch((err) => console.error(err))
    }
  }, [])

  useEffect(() => {
    if (props.ticketID) {
      loadTicketData(props.ticketID).catch((err) => console.error(err))
    }
  }, [props.ticketID])

  return <TicketCard ticketID={props.ticketID} />
}

export default TicketCardWidget
