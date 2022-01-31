import React, { useEffect } from 'react'
import { crowdSaleState, CrowdSaleRoute, fetchCrowdSaleData } from './state'
import CrowdSale from './CrowdSale'
import { useSnapshot } from 'valtio'
import TokenPicker from 'lib/components/Swap/TokenPicker'
import { initDApp } from 'lib/hooks/useWeb3Api'

export interface CrowdSaleWidgetProps {
  initialRoute?: CrowdSaleRoute
}

const CrowdSaleWidget = (props: CrowdSaleWidgetProps) => {
  const snap = useSnapshot(crowdSaleState)

  // TODO: dynamically load this
  const crowdSaleAddress = '0x803c267a3bf44099b75ad4d244a1eddd98df13ba'

  useEffect(() => {
    window.onload = () => {
      initDApp().then(() => {
        fetchCrowdSaleData(crowdSaleAddress)
      })
    }
    if (props.initialRoute) {
      crowdSaleState.route = props.initialRoute
    }
  }, [])

  if (snap.route === '/search') {
    return <TokenPicker specificAddresses={[...snap.stableCoins]} />
  }

  return <CrowdSale />
}

export default CrowdSaleWidget
