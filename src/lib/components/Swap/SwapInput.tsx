import react, { useState } from 'react'
import styled, { css } from 'styled-components'
import { COLORS } from 'lib/theme'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Button'
import { $Input } from 'lib/components/Input'
import { swapState, TokenPickerTarget } from './state'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, TokenData } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import BN from 'bignumber.js'
import useWindowSize from 'lib/hooks/useScreenSize'
import { screen } from '@testing-library/react'
import { ScreenSize } from '../../hooks/useScreenSize/index'

export interface SwapInputProps {
  selectedToken?: TokenData
  targetToken: TokenPickerTarget
  tokenDisabled?: boolean
  quantityDisabled?: boolean
}
const SwapInput = (props: SwapInputProps) => {
  const snap = useSnapshot(swapState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const selectToken = async () => {
    swapState.targetToken = props.targetToken
    swapState.route = '/search'
  }
  const setQuantity = (quantity: number) => {
    if (props.targetToken) {
      if (isNaN(quantity)) {
        swapState[props.targetToken].quantity = '0'
      } else {
        swapState[props.targetToken].quantity = quantity.toString()
      }
    }
  }

  const validChain =
    snapUserState.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.currentNetworkIdHex)

  const renderSelectTokenButton = () => {
    if (validChain) {
      return (
        <$Button
          backgroundColor={`${COLORS.dangerFontColor}80`}
          backgroundColorHover={`${COLORS.dangerFontColor}`}
          color={COLORS.trustFontColor}
          onClick={selectToken}
          disabled={props.tokenDisabled}
          screen={screen}
          style={{
            height: '20px',
            fontSize: screen === 'desktop' ? '1rem' : '0.9rem',
            fontWeight: 'lighter',
            padding: '5px 20px',
          }}
        >
          Select Token
        </$Button>
      )
    }
    return (
      <$Button
        backgroundColor={`${COLORS.surpressedBackground}10`}
        color={COLORS.surpressedFontColor}
        disabled
        screen={screen}
        style={{ height: '20px', fontSize: '1rem', fontWeight: 'lighter', padding: '5px 20px' }}
      >
        Select Token
      </$Button>
    )
  }

  const balance =
    props.targetToken && snap[props.targetToken].displayedBalance ? snap[props.targetToken].displayedBalance : 0
  const quantity = props.targetToken ? snap[props.targetToken].quantity : undefined
  const usdUnitPrice =
    props.targetToken &&
    snap[props.targetToken] &&
    snap[props.targetToken].data &&
    snap[props.targetToken].data?.usdPrice
  const usdValue =
    props.targetToken && quantity && snap[props.targetToken] && usdUnitPrice
      ? new BN(usdUnitPrice).multipliedBy(new BN(quantity))
      : ''
  return (
    <$SwapInput screen={screen}>
      <$Horizontal flex={1}>
        <$Vertical flex={screen === 'desktop' ? 3 : 2}>
          <$Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.valueAsNumber)}
            type="number"
            placeholder="0.00"
            disabled={props.quantityDisabled || !snap.inputToken.data}
            screen={screen}
          ></$Input>
          {usdValue ? (
            <$FineText screen={screen}>{`$${new BN(usdValue).decimalPlaces(6).toString()}`} USD</$FineText>
          ) : null}
        </$Vertical>
        <$Vertical flex={1}>
          {props.selectedToken ? (
            <$Button
              backgroundColor={`${COLORS.white}10`}
              backgroundColorHover={`${COLORS.surpressedBackground}50`}
              color={COLORS.black}
              onClick={selectToken}
              disabled={props.tokenDisabled && props.selectedToken ? true : false}
              screen={screen}
              style={{
                height: '30px',
                fontSize: screen === 'desktop' ? '1rem' : '0.9rem',
                fontWeight: 'bold',
                padding: screen === 'desktop' ? '5px 20px' : '5px 10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <$CoinIcon screen={screen} src={props.selectedToken.logoURI}></$CoinIcon>
              {props.selectedToken.symbol}
            </$Button>
          ) : (
            renderSelectTokenButton()
          )}
          <$BalanceText screen={screen} style={{ flex: 1 }}>
            {balance} balance
          </$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$SwapInput>
  )
}

const $SwapInput = styled.div<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.3rem')};
  padding: 10px 10px 15px 10px;
  background-color: ${`${COLORS.surpressedBackground}20`};
  border: 0px solid transparent;
  border-radius: 10px;
  display: flex;
  max-height: 150px;
`

export const $FineText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '0.9rem' : '0.8rem')};
  padding: 0px 0px 0px 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export const $CoinIcon = styled.img<{ screen: ScreenSize }>`
  width: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  height: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  margin-right: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
`

export const $BalanceText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '0.8rem' : '0.7rem')};
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 5px;
  margin-top: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export default SwapInput
