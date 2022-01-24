import react, { useState } from 'react'
import styled, { css } from 'styled-components'
import { COLORS } from 'lib/theme'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Button'
import { $Input } from 'lib/components/Input'
import { stateOfSwap, TokenPickerTarget } from './state'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, TokenData } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'

export interface SwapInputProps {
  selectedToken?: TokenData
  targetToken: TokenPickerTarget
  tokenDisabled?: boolean
  quantityDisabled?: boolean
}
const SwapInput = (props: SwapInputProps) => {
  const snap = useSnapshot(stateOfSwap)
  const snapUserState = useSnapshot(userState)
  const selectToken = async () => {
    stateOfSwap.targetToken = props.targetToken
    stateOfSwap.route = '/search'
  }
  const setQuantity = (quantity: number) => {
    console.log(quantity)
    if (props.targetToken) {
      if (isNaN(quantity)) {
        console.log('not a number')
        stateOfSwap[props.targetToken].quantity = 0
      } else {
        stateOfSwap[props.targetToken].quantity = quantity
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
          style={{ height: '20px', fontSize: '1rem', fontWeight: 'lighter', padding: '5px 20px' }}
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
        style={{ height: '20px', fontSize: '1rem', fontWeight: 'lighter', padding: '5px 20px' }}
      >
        Select Token
      </$Button>
    )
  }

  const balance =
    props.targetToken && snap[props.targetToken].displayedBalance ? snap[props.targetToken].displayedBalance : 0
  const quantity = props.targetToken ? snap[props.targetToken].quantity : undefined
  const usdValue = props.targetToken && quantity ? (snap[props.targetToken].data?.usdPrice || 1) * quantity : quantity
  return (
    <$SwapInput>
      <$Horizontal flex={1}>
        <$Vertical flex={3}>
          <$Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.valueAsNumber)}
            type="number"
            placeholder="0.00"
            disabled={props.quantityDisabled || !snap.inputToken.data}
          ></$Input>
          {usdValue ? <$FineText>{`$${usdValue}`}</$FineText> : null}
        </$Vertical>
        <$Vertical>
          {props.selectedToken ? (
            <$Button
              backgroundColor={`${COLORS.white}10`}
              backgroundColorHover={`${COLORS.surpressedBackground}50`}
              color={COLORS.black}
              onClick={selectToken}
              disabled={props.tokenDisabled && props.selectedToken ? true : false}
              style={{
                height: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '5px 20px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <$CoinIcon src={props.selectedToken.logoURI}></$CoinIcon>
              {props.selectedToken.symbol}
            </$Button>
          ) : (
            renderSelectTokenButton()
          )}
          <$BalanceText style={{ flex: 1 }}>{balance} balance</$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$SwapInput>
  )
}

const $SwapInput = styled.div<{}>`
  font-size: 1.5rem;
  padding: 10px 10px 15px 10px;
  background-color: ${`${COLORS.surpressedBackground}20`};
  border: 0px solid transparent;
  border-radius: 10px;
  display: flex;
  max-height: 150px;
`

export const $FineText = styled.span<{}>`
  font-size: 0.9rem;
  padding: 0px 0px 0px 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export const $CoinIcon = styled.img<{}>`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 10px;
`

export const $BalanceText = styled.span`
  font-size: 0.8rem;
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 5px;
  margin-top: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export default SwapInput
