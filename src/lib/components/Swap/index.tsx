import React, { useEffect } from 'react'
import styled from 'styled-components'
import { stateOfSwap, SwapRoute } from './state'
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
  const snap = useSnapshot(stateOfSwap)
  useEffect(() => {
    initDApp()
    if (props.initialRoute) {
      stateOfSwap.route = props.initialRoute
    }
  }, [])

  if (stateOfSwap.route === '/search') {
    return <TokenPicker />
  } else if (stateOfSwap.route === '/customs') {
    return <ManageTokens />
  } else if (stateOfSwap.route === '/add') {
    return <AddToken />
  }
  return <Swap />
}

export default SwapWidget
