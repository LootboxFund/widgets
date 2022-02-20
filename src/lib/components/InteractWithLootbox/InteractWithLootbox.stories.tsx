import react, { useEffect } from 'react'
import InteractWithLootbox from './InteractWithLootbox'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { $CardViewport } from '../Generics'
import Web3 from 'web3'
import { onLoad } from './'

export default {
  title: 'InteractWithLootbox',
  component: InteractWithLootbox,
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
        onLoad(lootboxAddress)
      }
    }
    load()
  }, [])

  return (
    <$CardViewport width="100vw" height="550px" maxWidth="1300px">
      <InteractWithLootbox />
    </$CardViewport>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
