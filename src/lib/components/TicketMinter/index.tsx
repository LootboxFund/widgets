import react, { useEffect } from 'react'
import TicketMinter from './TicketMinter'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { useSnapshot } from 'valtio'
import { ticketMinterState } from './state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { initializeLootbox } from '../TicketCard/state'
import { loadTicketData } from '../TicketCard/state'

const TicketMinterWidget = () => {
  const snap = useSnapshot(ticketMinterState)

  useEffect(() => {
    window.onload = () => {
      const [lootboxAddress] = parseUrlParams(['fundraisers'])
      initDApp()
        .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
        .then(async () => {
          if (lootboxAddress) {
            ticketMinterState.lootboxAddress = lootboxAddress
            const ticketId = await getLootboxTicketId(lootboxAddress)
            ticketMinterState.ticketID = ticketId
            return loadTicketData(ticketId)
          }
          return
        })
        .catch((err) => console.error(err))
    }
  }, [])

  return <TicketMinter ticketID={snap.ticketID}></TicketMinter>
}

export default TicketMinterWidget
