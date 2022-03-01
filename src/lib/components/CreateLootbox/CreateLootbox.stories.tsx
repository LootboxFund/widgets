import React, { useEffect } from 'react'
import CreateLootbox, { CreateLootboxProps } from 'lib/components/CreateLootbox'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'
import { initDApp } from 'lib/hooks/useWeb3Api'

export default {
  title: 'Create Lootbox',
  component: CreateLootbox,
}

const Template = (args: CreateLootboxProps) => {
  useEffect(() => {
    initDApp().catch((err) => console.error(err))
  }, [])
  return <CreateLootbox {...args} />
}

export const Basic = Template.bind({})
Basic.args = {}
