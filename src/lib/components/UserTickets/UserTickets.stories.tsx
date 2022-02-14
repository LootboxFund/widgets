import React from 'react'
import UserTickets from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadUserTickets } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { initializeLootbox } from '../TicketCard/state'

export default {
  title: 'UserTickets',
  component: UserTickets,
}

const Template = () => {
  let lootboxAddress: string | undefined

  useEffect(() => {
    ;[lootboxAddress] = parseUrlParams(['fundraisers'])
    initDApp()
      .then(() => (lootboxAddress ? loadUserTickets(lootboxAddress) : undefined))
      .then(() => (lootboxAddress ? initializeLootbox(lootboxAddress) : undefined))
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <UserTickets />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
