import React, { useEffect } from 'react'
import { Label, Input } from '@rebass/forms'
import styled from 'styled-components'
import SwapButton from 'lib/components/Swap/SwapButton'
import SwapInput from 'lib/components/Swap/SwapInput'
import SwapHeader from 'lib/components/Swap/SwapHeader'
import { useSnapshot } from 'valtio'
import { useTokenList } from 'lib/hooks/useTokenList'
import { TokenDataFE } from 'lib/hooks/constants'
import { crowdSaleState } from './state'
import { getPriceFeed } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import BN from 'bignumber.js'
import CrowdSaleButton from './BuyButton'

export const $SwapContainer = styled.section`
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

interface SwapProps {
  inputToken?: TokenDataFE
  outputToken?: TokenDataFE
}
const CrowdSale = (props: SwapProps) => {
  const snap = useSnapshot(crowdSaleState)
  const snapUserState = useSnapshot(userState)

  const isLoggedIn = snapUserState.accounts.length > 0

  useEffect(() => {
    if (props.inputToken) {
      crowdSaleState.inputToken.data = props.inputToken
    }
    if (props.outputToken) {
      crowdSaleState.outputToken.data = props.inputToken
    }
  }, [])

  const inputPriceUSD = snap.inputToken.data?.usdPrice
  const outputPriceUSD = snap.outputToken.data?.usdPrice
  const outputQuantity =
    inputPriceUSD && outputPriceUSD ? new BN(inputPriceUSD).dividedBy(new BN(outputPriceUSD)).decimalPlaces(8) : 0

  return (
    <$SwapContainer>
      <SwapHeader />
      <SwapInput selectedToken={snap.inputToken.data} targetToken="inputToken" tokenDisabled={!isLoggedIn} />
      <SwapInput
        selectedToken={snap.outputToken.data}
        targetToken="outputToken"
        quantityDisabled
        tokenDisabled={!isLoggedIn}
        selectDisabled
      />
      {snap.inputToken.data && snap.outputToken.data ? (
        <$CurrencyExchangeRate>
          <span style={{ marginRight: '10px' }}>ℹ️</span>
          {`1 ${snap.inputToken.data.symbol} = ${outputQuantity} ${snap.outputToken.data.symbol}`}
        </$CurrencyExchangeRate>
      ) : null}
      <CrowdSaleButton></CrowdSaleButton>
    </$SwapContainer>
  )
}

export const $CurrencyExchangeRate = styled.span`
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: lighter;
  color: ${COLORS.surpressedFontColor};
`

export default CrowdSale
