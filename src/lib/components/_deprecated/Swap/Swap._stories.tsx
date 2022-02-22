import React from 'react'
import Swap from '.'
import { $CardViewport } from '../../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import Web3 from 'web3'

export default {
  title: 'Swap',
  component: Swap,
}

const Template = () => {
  useEffect(() => {
    initDApp()
    ;(window as any).Web3 = Web3
  }, [])

  return (
    <$CardViewport width="340px">
      <Swap />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
