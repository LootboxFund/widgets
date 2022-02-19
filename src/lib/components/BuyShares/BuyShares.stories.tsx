import React from 'react'
import BuyShares from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchLootboxData } from './state'
import Web3 from 'web3'

export default {
  title: 'BuyShares',
  component: BuyShares,
}

const Template = () => {
  useEffect(() => {
    ;(window as any).Web3 = Web3
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for BuyShares', err)
      }
      fetchLootboxData().catch((err) => console.error('Error fetching lootbox data', err))
    }
    load().catch((err) => console.error('Error loading buyShare widget', err))
  }, [])

  return (
    <$CardViewport width="340px">
      <BuyShares />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
