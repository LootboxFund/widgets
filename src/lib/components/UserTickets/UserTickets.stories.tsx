import React from 'react'
import UserTickets from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadState } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'

export default {
  title: 'UserTickets',
  component: UserTickets,
}

const Template = () => {
  let lootboxAddress: string | undefined

  useEffect(() => {
    ;(window as any).Web3 = Web3
    const load = async () => {
      lootboxAddress = parseUrlParams('lootbox')
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
      if (lootboxAddress) {
        loadState(lootboxAddress)
      }
    }
    load()
  }, [])

  return (
    <$CardViewport width="100vw" height="450px">
      <UserTickets />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
