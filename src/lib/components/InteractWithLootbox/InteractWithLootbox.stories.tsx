import react, { useEffect } from 'react'
import InteractWithLootbox from './InteractWithLootbox'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { $CardViewport } from '../Generics'
import Web3 from 'web3'
import { onLoad } from './'
import { ContractAddress } from '@wormgraph/helpers'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'InteractWithLootbox',
  component: InteractWithLootbox,
}

const Template = () => {
  let lootboxAddress: ContractAddress | undefined

  useEffect(() => {
    const load = async () => {
      lootboxAddress = parseUrlParams('lootbox') as ContractAddress
      if (lootboxAddress) {
        onLoad(lootboxAddress)
      }
    }
    load()
  }, [])

  return (
    <$CardViewport margin="0 auto" width="100%" height="550px" maxWidth="940px">
      <LocalizationWrapper>
        <InteractWithLootbox />
      </LocalizationWrapper>
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
