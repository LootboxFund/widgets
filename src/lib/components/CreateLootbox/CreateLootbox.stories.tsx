import React, { useEffect } from 'react'
import CreateLootbox, { CreateLootboxProps } from 'lib/components/CreateLootbox'
import Web3 from 'web3'


export default {
  title: 'Create Lootbox',
  component: CreateLootbox,
}

const Template = (args: CreateLootboxProps) => {
  useEffect(() => {
    (window as any).Web3 = Web3
  }, [])
  return (
    <CreateLootbox {...args} />
  )
}


export const Basic = Template.bind({})
Basic.args = {}
