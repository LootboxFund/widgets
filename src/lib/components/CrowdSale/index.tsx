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

  useEffect(() => {
    window.onload = () => {
      initDApp().then(() => fetchCrowdSaleData())
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
