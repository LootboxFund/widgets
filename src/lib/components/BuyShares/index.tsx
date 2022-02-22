import React, { useEffect } from 'react'
import { buySharesState, BuySharesRoute, fetchLootboxData } from './state'
import BuyShares from './BuyShares'
import { useSnapshot } from 'valtio'
import { initDApp } from 'lib/hooks/useWeb3Api'
import PurchaseComplete from './PurchaseComplete'
import parseUrlParams from 'lib/utils/parseUrlParams'

export interface BuySharesWidgetProps {
  initialRoute?: BuySharesRoute
}

const BuySharesWidget = (props: BuySharesWidgetProps) => {
  const snap = useSnapshot(buySharesState)

  useEffect(() => {
    const load = async () => {
      const lootbox = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for BuyShares', err)
      }
      if (lootbox) {
        fetchLootboxData(lootbox).catch((err) => console.error('Error fetching lootbox data', err))
      }
    }
    load()
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
