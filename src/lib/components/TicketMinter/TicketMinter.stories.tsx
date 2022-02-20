import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import TicketMinter from '.'
import { ticketMinterState } from './state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData, ticketCardState } from 'lib/components/TicketCard/state'
import { fetchLootboxData } from 'lib/components/BuyShares/state'

export default {
  title: 'TicketMinter',
  component: TicketMinter,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      ;(window as any).Web3 = Web3
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing dapp', err)
      }
      if (lootboxAddress) {
        ticketCardState.lootboxAddress = lootboxAddress
        ticketMinterState.lootboxAddress = lootboxAddress
        let ticketID = undefined
        try {
          ;[ticketID] = await Promise.all([getLootboxTicketId(lootboxAddress), fetchLootboxData(lootboxAddress)])
        } catch (err) {
          console.error('Error fetching ticket id', err)
          ticketID = '0'
        }
        ticketMinterState.ticketID = ticketID
        loadTicketData(ticketID).catch((err) => console.error('Error loading ticket data', err))
      }
    }
    load().catch((err) => console.error(err))
  }, [])

  return (
    <$CardViewport width="1000px">
      <TicketMinter />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
