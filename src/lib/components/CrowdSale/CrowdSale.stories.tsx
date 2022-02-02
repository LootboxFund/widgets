import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import CrowdSale from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { fetchCrowdSaleData } from './state'
import Web3 from 'web3'

export default {
  title: 'CrowdSale',
  component: CrowdSale,
}

const Template = () => {
  useEffect(() => {
    initDApp().then(() => fetchCrowdSaleData())
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <ThemeProvider theme={theme}>
        <CrowdSale />
      </ThemeProvider>
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
