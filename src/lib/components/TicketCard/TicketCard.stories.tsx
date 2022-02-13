import React from 'react'
import TicketCard from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadTicketData, initializeLootbox } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'

export default {
  title: 'TicketCard',
  component: TicketCard,
}

const Template = () => {
  let lootboxAddress: string | undefined
  const ticketID = '0'

  useEffect(() => {
    ;[lootboxAddress] = parseUrlParams(['fundraisers'])
    initDApp()
      .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
      .then(() => (ticketID ? loadTicketData(ticketID) : undefined))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <TicketCard ticketID={ticketID} />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
