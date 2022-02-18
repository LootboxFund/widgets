import React from 'react'
import CreateLootbox, { CreateLootboxProps } from 'lib/components/CreateLootbox'


export default {
  title: 'Create Lootbox',
  component: CreateLootbox,
}

const Template = (args: CreateLootboxProps) => (
  <CreateLootbox {...args} />
)

export const Basic = Template.bind({})
Basic.args = {}
