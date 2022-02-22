import react, { useEffect } from 'react'
import UserTickets from './UserTickets'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { loadState } from './state'

const UserTicketsWidget = () => {
  useEffect(() => {
    const load = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
      if (lootboxAddress) {
        loadState(lootboxAddress)
      }
    }
    load()
  }, [])

  return <UserTickets />
}

export default UserTicketsWidget
