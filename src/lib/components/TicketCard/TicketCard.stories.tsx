import React from 'react'
import TicketCard from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { ticketCardState, initializeLootbox } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'

export default {
  title: 'TicketCard',
  component: TicketCard,
}

const Template = () => {
  useEffect(() => {
    const [lootboxAddress] = parseUrlParams(['fundraisers'])
    initDApp()
      .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <TicketCard />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
