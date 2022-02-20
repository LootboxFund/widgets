import React from 'react'
import UserTickets from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadUserTickets, userTicketState } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ticketCardState } from 'lib/components/TicketCard/state'

export default {
  title: 'UserTickets',
  component: UserTickets,
}

const Template = () => {
  let lootboxAddress: string | undefined

  useEffect(() => {
    ;(window as any).Web3 = Web3
    const load = async () => {
      lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
      if (lootboxAddress) {
        userTicketState.lootboxAddress = lootboxAddress
        ticketCardState.lootboxAddress = lootboxAddress
        try {
          await loadUserTickets()
        } catch (err) {
          console.error('Error loading user tickets', err)
        }
      }
    }
    load()
  }, [])

  return (
    <$CardViewport width="100vw" height="550px">
      <UserTickets />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
