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

export const $BuySharesContainer = styled.section<{ screen: string | undefined }>`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  padding: ${(props) => (props.screen === 'mobile' ? '0px' : '20px')};
  box-shadow: ${(props) => (props.screen === 'mobile' ? 'none' : '0px 4px 4px rgba(0, 0, 0, 0.1)')};
`

interface BuySharesProps {}
const BuyShares = (props: BuySharesProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const isLoggedIn = snapUserState.accounts.length > 0

  return (
    <$BuySharesContainer screen={screen}>
      <BuySharesHeader />
      <TokenInput selectedToken={snap.inputToken.data as TokenDataFE} tokenDisabled={!isLoggedIn} />
      <ShareOutput lootbox={snap.lootbox.data as ILootbox} />
      <BuyButton />
      <InfoText />
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
