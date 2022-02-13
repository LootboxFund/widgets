import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Web3 from 'web3'
import { initializeLootbox } from 'lib/components/TicketCard/state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import TicketMinter from '.'
import { ticketMinterState } from './state'
import { getLootboxTicketId } from 'lib/hooks/useContract'
import { loadTicketData } from 'lib/components/TicketCard/state'

export default {
  title: 'TicketMinter',
  component: TicketMinter,
}

const Template = () => {
  let lootboxAddress: string | undefined

  useEffect(() => {
    ;[lootboxAddress] = parseUrlParams(['fundraisers'])

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
