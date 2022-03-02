import React from 'react'
import BuyShares from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchLootboxData, buySharesState } from './state'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ContractAddress } from '@lootboxfund/helpers'

export default {
  title: 'BuyShares',
  component: BuyShares,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      const lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      buySharesState.lootbox.address = lootboxAddress ? lootboxAddress : undefined
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for BuyShares', err)
      }
      if (lootboxAddress) {
        fetchLootboxData(lootboxAddress).catch((err) => console.error('Error fetching lootbox data', err))
      }
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
