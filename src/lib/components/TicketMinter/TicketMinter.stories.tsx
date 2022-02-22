import React from 'react'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import TicketMinter from '.'
import { loadState } from './state'

export default {
  title: 'TicketMinter',
  component: TicketMinter,
}

const Template = () => {
  useEffect(() => {
    ;(window as any).Web3 = Web3
    const load = async () => {
      const lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing dapp', err)
      }
      if (lootboxAddress) {
        loadState(lootboxAddress)
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
