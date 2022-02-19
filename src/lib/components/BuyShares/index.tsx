import React, { useEffect } from 'react'
import { buySharesState, BuySharesRoute, fetchLootboxData } from './state'
import BuyShares from './BuyShares'
import { useSnapshot } from 'valtio'
import { initDApp } from 'lib/hooks/useWeb3Api'
import PurchaseComplete from './PurchaseComplete'

export interface BuySharesWidgetProps {
  initialRoute?: BuySharesRoute
}

const BuySharesWidget = (props: BuySharesWidgetProps) => {
  const snap = useSnapshot(buySharesState)

  useEffect(() => {
    window.onload = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for BuyShares', err)
      }
      fetchLootboxData().catch((err) => console.error('Error fetching lootbox data', err))
    }
    if (props.initialRoute) {
      buySharesState.route = props.initialRoute
    }
  }, [])

  if (snap.route === '/complete') {
    return <PurchaseComplete />
  }

  return <BuyShares />
}

export default BuySharesWidget
