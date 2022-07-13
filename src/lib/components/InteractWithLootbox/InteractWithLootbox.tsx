import react, { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import { $Vertical } from '../Generics'
import UserTickets from '../UserTickets/UserTickets'
import styled from 'styled-components'
import Socials from '../Socials'
import { buySharesState } from '../BuyShares/state'
import { ContractAddress, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import LootboxFundraisingProgressBar from '../FundraisingProgressBar'
import BuyShares from '../BuyShares/BuyShares'
import $Button from '../Generics/Button'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from '../../../manifest'
import { FormattedMessage } from 'react-intl'

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
      <$ButtonLink
        href={`${manifest.microfrontends.webflow.managePage}?lootbox=${lootboxAddress}`}
        screen={screen}
        color={COLORS.surpressedFontColor}
        backgroundColor={COLORS.white}
      >
        <FormattedMessage
          id="interactWithLootbox.manageLootbox.button"
          defaultMessage="Manage Lootbox"
          description='Button prompt leading to the "Manage" Lootbox page (AKA: "Edit" lootbox page)'
        />
      </$ButtonLink>
    </$Vertical>
  )
}

const $TicketContainer = styled.section<{ screen: ScreenSize }>`
  padding-top: 40px;
`

const $ButtonLink = styled.a<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
  screen: ScreenSize
  justifyContent?: string
}>`
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  flex: 1;
  text-align: center;
  text-decoration: none;
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  line-height: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  border: 0px solid transparent;
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => props.color && `color: ${props.color}`};
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor}`};
  &:hover {
    ${(props) => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
    ${(props) => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
  }
`

export default InteractWithLootbox
