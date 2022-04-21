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
import { TokenDataFE } from 'lib/hooks/constants'
import { ILootbox } from 'lib/types'
import InfoText from './InfoText'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Container } from '../Generics'

interface BuySharesProps {}
const BuyShares = (props: BuySharesProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const isLoggedIn = snapUserState.accounts.length > 0

  return (
    <$Container screen={screen}>
      <BuySharesHeader />
      <TokenInput selectedToken={snap.inputToken.data as TokenDataFE} tokenDisabled={!isLoggedIn} />
      <ShareOutput lootbox={snap.lootbox.data as ILootbox} />
      <BuyButton />
      <InfoText />
    </$Container>
  )
}

export const $CurrencyExchangeRate = styled.span`
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: lighter;
  color: ${COLORS.surpressedFontColor};
`

export default BuyShares
