import React from 'react'
import BuyShares from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchLootboxData } from 'lib/components/BuyShares/state'
import Web3 from 'web3'
import { loadTicketData, initializeLootbox } from 'lib/components/TicketCard/state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import TicketMinter from './TicketMinter'

export default {
  title: 'TicketMinter',
  component: TicketMinter,
}

const Template = () => {
  let lootboxAddress: string | undefined
  const ticketID = '0'

  useEffect(() => {
    ;[lootboxAddress] = parseUrlParams(['fundraisers'])
    initDApp()
      .then(() => fetchLootboxData())
      .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
      .then(() => loadTicketData(ticketID))
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="1000px">
      <TicketMinter />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
