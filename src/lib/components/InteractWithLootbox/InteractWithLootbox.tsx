import react, { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { $Vertical } from '../Generics'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'
import Socials from '../Socials'
import { buySharesState } from '../BuyShares/state'
import { ContractAddress, COLORS } from '@wormgraph/helpers'
import LootboxFundraisingProgressBar from '../FundraisingProgressBar'
import BuyShares from '../BuyShares/BuyShares'
import $Button from '../Generics/Button'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from '../../../manifest'

const InteractWithLootbox = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { screen } = useWindowSize()
  const buySharesStateSnapshot = useSnapshot(buySharesState)
  const lootboxAddress = buySharesStateSnapshot?.lootbox?.address as ContractAddress | undefined

  return (
    <$Vertical spacing={5} padding="1em">
      <LootboxFundraisingProgressBar lootbox={lootboxAddress} />
      <BuyShares ref={ref} />
      <$TicketContainer screen={screen}>
        <UserTickets
          onScrollToMint={() => {
            ref.current?.scrollIntoView()
          }}
        />
      </$TicketContainer>
      <Socials lootbox={lootboxAddress} />
      <br />
      <$Button
        onClick={() => window.open(`${manifest.microfrontends.webflow.managePage}?lootbox=${lootboxAddress}`, '_self')}
        screen={screen}
        color={COLORS.surpressedFontColor}
        backgroundColor={COLORS.white}
      >
        Manage Lootbox
      </$Button>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{screen: ScreenSize}>`
  padding-top: 40px;
`

export default InteractWithLootbox
