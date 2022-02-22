import react, { useEffect } from 'react'
import TicketMinter from './TicketMinter'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { loadState } from './state'

const TicketMinterWidget = () => {
  useEffect(() => {
    const load = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing dapp', err)
      }
      if (lootboxAddress) {
        loadState(lootboxAddress)
      }
    }
  }, [])

  return <TicketMinter />
}

export default TicketMinterWidget
