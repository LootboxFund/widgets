import React, { useEffect } from 'react'
import ManageLootbox, { ManageLootboxProps } from 'lib/components/ManageLootbox'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { TicketID, ContractAddress } from '@wormgraph/helpers'

export default {
  title: 'Manage Lootbox',
  component: ManageLootbox,
}

const Template = (args: ManageLootboxProps) => {
  useEffect(() => {
    initDApp().catch((err) => console.error(err))
  }, [])
  return (
    <ManageLootbox
      {...args}
      themeColor={'#F0B90B'}
      lootboxAddress={'0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress}
      ticketID={'0' as TicketID}
    />
  )
}

export const Basic = Template.bind({})
Basic.args = {}
