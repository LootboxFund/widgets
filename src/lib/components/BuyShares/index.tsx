import React, { useEffect } from 'react'
import { buySharesState, BuySharesRoute, initBuySharesState } from './state'
import BuyShares from './BuyShares'
import { useSnapshot } from 'valtio'
import { initDApp } from 'lib/hooks/useWeb3Api'
import PurchaseComplete from './PurchaseComplete'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ContractAddress } from '@lootboxfund/helpers'

export interface BuySharesWidgetProps {
  initialRoute?: BuySharesRoute
}

const BuySharesWidget = (props: BuySharesWidgetProps) => {
  const snap = useSnapshot(buySharesState)

  useEffect(() => {
    const load = async () => {
      const lootbox = parseUrlParams('lootbox') as ContractAddress
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp for BuyShares', err)
      }
      if (lootbox) {
        initBuySharesState(lootbox).catch((err) => console.error('Error fetching lootbox data', err))
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
