import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import PurchaseComplete from './PurchaseComplete'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchCrowdSaleData } from './state'
import Web3 from 'web3'

export default {
  title: 'PurchaseComplete',
  component: PurchaseComplete,
}

const Template = () => {
  useEffect(() => {
    initDApp()
      .then(() => fetchCrowdSaleData())
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <ThemeProvider theme={theme}>
        <PurchaseComplete />
      </ThemeProvider>
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
