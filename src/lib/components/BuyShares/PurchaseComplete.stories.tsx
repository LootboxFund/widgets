import React from 'react'
import PurchaseComplete from './PurchaseComplete'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchLootboxData } from './state'
import Web3 from 'web3'

export default {
  title: 'BuySharesPurchaseComplete',
  component: PurchaseComplete,
}

const Template = () => {
  useEffect(() => {
    initDApp()
      .then(() => fetchLootboxData())
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <PurchaseComplete />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
