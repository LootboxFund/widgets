import React, { useEffect } from 'react'
import RewardSponsors, { RewardSponsorsProps } from 'lib/components/RewardSponsors'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { TicketID, ContractAddress } from '@wormgraph/helpers'

export default {
  title: 'Reward Sponsors',
  component: RewardSponsors,
}

const Template = (args: RewardSponsorsProps) => {
  useEffect(() => {
    initDApp().catch((err) => console.error(err))
  }, [])
  return <RewardSponsors {...args} lootboxAddress={'0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress} />
}

export const Basic = Template.bind({})
Basic.args = {}
