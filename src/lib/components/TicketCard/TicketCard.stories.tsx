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
      .then(() => loadTicketData(ticketID))
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <TicketCard lootboxAddress={lootboxAddress} ticketID={'0'} />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
