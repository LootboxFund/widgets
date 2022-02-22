import React, { useEffect } from 'react'
import styled from 'styled-components'
import { swapState, SwapRoute } from './state'
import Swap from './Swap'
import { useSnapshot } from 'valtio'
import TokenPicker from './TokenPicker'
import ManageTokens from './ManageTokens'
import AddToken from './AddToken'
import { initTokenList } from 'lib/hooks/useTokenList'
import { initDApp } from 'lib/hooks/useWeb3Api'

export interface SwapWidgetProps {
  initialRoute?: SwapRoute
}
const SwapWidget = (props: SwapWidgetProps) => {
  const snap = useSnapshot(swapState)
  useEffect(() => {
    window.onload = () => {
      initDApp()
    }
    if (props.initialRoute) {
      swapState.route = props.initialRoute
    }
  }, [])

  if (swapState.route === '/search') {
    return <TokenPicker />
  } else if (swapState.route === '/customs') {
    return <ManageTokens />
  } else if (swapState.route === '/add') {
    return <AddToken />
  }
  return <Swap />
}

export default SwapWidget
