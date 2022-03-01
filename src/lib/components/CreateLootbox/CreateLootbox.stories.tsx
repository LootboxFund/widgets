import React, { useEffect } from 'react'
import CreateLootbox, { CreateLootboxProps } from 'lib/components/CreateLootbox'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'

export default {
  title: 'Create Lootbox',
  component: CreateLootbox,
}

const Template = (args: CreateLootboxProps) => {
  useEffect(() => {
    useHtmlEthers()
  }, [])
  return <CreateLootbox {...args} />
}

export const Basic = Template.bind({})
Basic.args = {}
