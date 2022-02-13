import React, { useEffect } from 'react'
import styled from 'styled-components'
import BuyButton from 'lib/components/BuyShares/BuyButton'
import TokenInput from 'lib/components/BuyShares/Input/TokenInput'
import ShareOutput from 'lib/components/BuyShares/Input/ShareOutput'
import BuySharesHeader from 'lib/components/BuyShares/Header'
import { useSnapshot } from 'valtio'
import { TokenDataFE } from 'lib/hooks/constants'
import { buySharesState } from './state'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import BN from 'bignumber.js'
import { ILootbox } from 'lib/types'

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
  min-height: 600px;
`

interface BuySharesProps {
  inputToken?: TokenDataFE
  lootbox?: ILootbox
}
const BuyShares = (props: BuySharesProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)

  const isLoggedIn = snapUserState.accounts.length > 0

  useEffect(() => {
    if (props.inputToken) {
      buySharesState.inputToken.data = props.inputToken
    }
    if (props.lootbox) {
      buySharesState.lootbox.data = props.lootbox
    }
  }, [])

  const inputPriceUSD = snap.inputToken.data?.usdPrice
  const outputPriceUSD = snap.lootbox.data?.sharePriceUSD
  const outputQuantity =
    inputPriceUSD && outputPriceUSD ? new BN(inputPriceUSD).dividedBy(new BN(outputPriceUSD)).decimalPlaces(8) : 0

  return (
    <$BuySharesContainer>
      <BuySharesHeader />
      <TokenInput selectedToken={snap.inputToken.data} tokenDisabled={!isLoggedIn} />
      <ShareOutput lootbox={snap.lootbox.data} quantityDisabled selectDisabled />
      {/* {snap.inputToken.data && snap.outputToken.data ? (
        <$CurrencyExchangeRate>
          <span style={{ marginRight: '10px' }}>ℹ️</span>
          {`1 ${snap.inputToken.data.symbol} = ${outputQuantity} ${snap.outputToken.data.symbol}`}
        </$CurrencyExchangeRate>
      ) : null} */}
      <BuyButton></BuyButton>
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
