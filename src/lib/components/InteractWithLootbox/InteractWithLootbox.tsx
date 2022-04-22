import react, { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { $Vertical } from '../Generics'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'
import Socials from '../Socials'
import { buySharesState } from '../BuyShares/state'
import { ContractAddress } from '@wormgraph/helpers'
import LootboxFundraisingProgressBar from '../FundraisingProgressBar'
import BuyShares from '../BuyShares/BuyShares'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const buySharesStateSnapshot = useSnapshot(buySharesState)
  const lootboxAddress = buySharesStateSnapshot?.lootbox?.address as ContractAddress | undefined

  return (
    <$Vertical spacing={4} padding="1em">
      <LootboxFundraisingProgressBar lootbox={lootboxAddress} />
      <BuyShares ref={ref} />
      <$TicketContainer>
        <UserTickets
          onScrollToMint={() => {
            ref.current?.scrollIntoView()
          }}
        />
      </$TicketContainer>
      <Socials lootbox={lootboxAddress} />
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{}>`
  height: 400px;
`

export default InteractWithLootbox
