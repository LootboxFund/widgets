import react, { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import TicketCard from 'lib/components/TicketCard/TicketCard'
import { useSnapshot } from 'valtio'
import { ticketCardState, initializeLootbox } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'

export interface TicketCardWidgetProps {}

const TicketCardWidget = (props: TicketCardWidgetProps) => {
  const snap = useSnapshot(ticketCardState)

  useEffect(() => {
    window.onload = () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      initDApp()
        .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
        .catch((err) => console.error(err))
    }
  }, [])

  return <TicketCard />
}

export default TicketCardWidget
