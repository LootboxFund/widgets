import React from 'react'
import BadgeList, { BadgeListProps } from 'lib/components/BadgeList'

export default {
  title: 'BadgeList',
  component: BadgeList,
}

const Demo = (args: BadgeListProps) => <BadgeList {...args} />

export const Basic = Demo.bind({})
Basic.args = {}
