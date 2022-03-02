import React from 'react'
import PurchaseComplete from './PurchaseComplete'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { initBuySharesState } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ContractAddress } from '@lootboxfund/helpers'

export default {
  title: 'BuySharesPurchaseComplete',
  component: PurchaseComplete,
}

const Template = () => {
  useEffect(() => {
    const load = async () => {
      const lootbox = parseUrlParams('lootbox') as ContractAddress
      try {
        await initDApp()
      } catch (err) {
        console.error(err)
      }
      if (lootbox) {
        await initBuySharesState(lootbox).catch((err) => console.error(err))
      }
    }
    load()
  }, [])

  return (
    <$CardViewport width="340px">
      <PurchaseComplete />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
