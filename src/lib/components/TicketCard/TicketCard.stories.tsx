import React from 'react'
import TicketCard from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadTicketData, ticketCardState } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'

export default {
  title: 'TicketCard',
  component: TicketCard,
}

const Template = () => {
  const ticketID = '0'

  useEffect(() => {
    const lootboxAddress = parseUrlParams('lootbox')
    ticketCardState.lootboxAddress = lootboxAddress
    ;(window as any).Web3 = Web3
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp in TicketCard stories', err)
      }
      if (ticketID) {
        await loadTicketData(ticketID)
      }
    }
    load().catch((err) => console.error('Error loading ticket data', err))
  }, [])

  return (
    <$CardViewport width="340px">
      <TicketCard ticketID={ticketID} isRedeemEnabled={true} />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
