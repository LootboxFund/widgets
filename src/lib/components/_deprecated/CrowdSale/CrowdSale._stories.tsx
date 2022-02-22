import React from 'react'
import CrowdSale from '.'
import { $CardViewport } from '../../Generics'
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
    initDApp()
      .then(() => fetchCrowdSaleData())
      .catch((err) => console.error(err))
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <CrowdSale />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
