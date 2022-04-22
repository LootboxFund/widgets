import React, { useEffect } from 'react'
import styled from 'styled-components'
import BuyButton from 'lib/components/BuyShares/BuyButton'
import TokenInput from 'lib/components/BuyShares/Input/TokenInput'
import ShareOutput from 'lib/components/BuyShares/Input/ShareOutput'
import BuySharesHeader from 'lib/components/BuyShares/Header'
import { useSnapshot } from 'valtio'
import { buySharesState } from './state'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { smallScreens, TokenDataFE } from 'lib/hooks/constants'
import { ILootbox } from 'lib/types'
import InfoText from './InfoText'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Container, $Horizontal, $Vertical } from '../Generics'
import TicketCard from '../TicketCard'
import PurchaseComplete from './PurchaseComplete'

interface BuySharesProps {}
const BuyShares = (props: BuySharesProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const isMobile = smallScreens.indexOf(screen) >= 0
  const buyWidth = isMobile ? '100%' : '65%'
  const ticketWidth = isMobile ? '100%' : '35%'
  const isLoggedIn = snapUserState.accounts.length > 0

  const ticketId = snap?.lootbox?.data?.ticketIdCounter || '0'

  return (
    <$Container screen={screen}>
      {isMobile ? (
        <$TicketWrapper marginBottom="20px" width={ticketWidth}>
          <TicketCard ticketID={ticketId} />
        </$TicketWrapper>
      ) : undefined}
      <BuySharesHeader />
      <$Horizontal spacing={2}>
        <$Vertical spacing={2} width={buyWidth}>
          {snap.route === '/complete' ? (
            <PurchaseComplete />
          ) : (
            <$Vertical spacing={2} width="100%">
              <TokenInput selectedToken={snap.inputToken.data as TokenDataFE} tokenDisabled={!isLoggedIn} />
              <ShareOutput lootbox={snap.lootbox.data as ILootbox} />
              <BuyButton />
            </$Vertical>
          )}
          <InfoText />
        </$Vertical>
        {!isMobile ? (
          <$TicketWrapper width={ticketWidth}>
            <TicketCard ticketID={ticketId} />
          </$TicketWrapper>
        ) : undefined}
      </$Horizontal>
    </$Container>
  )
}

const $TicketWrapper = styled.section<{ width: string; marginBottom?: string }>`
  height: 100%;
  width: ${(props) => props.width};
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '0px')};
`

export const $CurrencyExchangeRate = styled.span`
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: lighter;
  color: ${COLORS.surpressedFontColor};
`

export default BuyShares
