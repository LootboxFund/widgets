import React, { useEffect } from 'react'
import styled from 'styled-components'
import BuyButton from 'lib/components/BuyShares/BuyButton'
import TokenInput from 'lib/components/BuyShares/Input/TokenInput'
import ShareOutput from 'lib/components/BuyShares/Input/ShareOutput'
import BuySharesHeader from 'lib/components/BuyShares/Header'
import { useSnapshot } from 'valtio'
import { TokenDataFE } from 'lib/hooks/constants'
import { buySharesState, fetchLootboxData } from './state'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import BN from 'bignumber.js'

export const $BuySharesContainer = styled.section`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`

interface BuySharesProps {}
const BuyShares = (props: BuySharesProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)

  const isLoggedIn = snapUserState.accounts.length > 0

  return (
    <$BuySharesContainer>
      <BuySharesHeader />
      <TokenInput selectedToken={snap.inputToken.data} tokenDisabled={!isLoggedIn} />
      <ShareOutput lootbox={snap.lootbox.data} />
      <BuyButton />
    </$BuySharesContainer>
  )
}

export const $CurrencyExchangeRate = styled.span`
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: lighter;
  color: ${COLORS.surpressedFontColor};
`

export default BuyShares
