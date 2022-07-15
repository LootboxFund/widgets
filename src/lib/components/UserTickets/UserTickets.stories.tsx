import React from 'react'
import UserTickets from '.'
import { $CardViewport } from '../Generics'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { loadState } from './state'
import Web3 from 'web3'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { ContractAddress } from '@wormgraph/helpers'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'UserTickets',
  component: UserTickets,
}

const Template = () => {
  let lootboxAddress: ContractAddress | undefined

  useEffect(() => {
    const load = async () => {
      lootboxAddress = parseUrlParams('lootbox') as ContractAddress
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
    <LocalizationWrapper>
      <$CardViewport width="100vw" height="450px">
        <UserTickets />
      </$CardViewport>
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
