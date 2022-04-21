import react, { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { $Vertical } from '../Generics'
import TicketMinter from '../TicketMinter/TicketMinter'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'
import Socials from '../Socials'
import { buySharesState } from '../BuyShares/state'
import { ContractAddress } from '@wormgraph/helpers'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const buySharesStateSnapshot = useSnapshot(buySharesState)

  return (
    <$Vertical spacing={4}>
      <TicketMinter ref={ref} />
      <$TicketContainer>
        <UserTickets
          onScrollToMint={() => {
            ref.current?.scrollIntoView()
          }}
        />
      </$TicketContainer>
      <$SocialsContainer>
        <Socials lootbox={buySharesStateSnapshot?.lootbox?.address as ContractAddress | undefined} />
      </$SocialsContainer>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{}>`
  height: 400px;
`

const $SocialsContainer = styled.section<{}>`
  padding: 20px;
`

export default InteractWithLootbox
