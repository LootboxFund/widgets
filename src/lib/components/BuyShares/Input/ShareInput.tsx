import react, { useState } from 'react'
import { COLORS } from 'lib/theme'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Button'
import { $Input } from 'lib/components/Input'
import { buySharesState } from '../state'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import BN from 'bignumber.js'
import useWindowSize from 'lib/hooks/useScreenSize'
import { parseEth } from '../helpers'
import { $TokenInput, $FineText, $CoinIcon, $BalanceText } from './shared'
import { ILootbox } from 'lib/types'

export interface ShareInputProps {
  lootbox?: ILootbox
  quantityDisabled?: boolean
  selectDisabled?: boolean
}

const ShareInput = (props: ShareInputProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const selectToken = async () => {
    // if (!props.selectDisabled) {
    //   buySharesState.targetToken = props.targetToken
    //   buySharesState.route = '/search'
    // }
  }
  const setQuantity = (quantity: string) => {
    if (quantity?.length === 0) {
      buySharesState.inputToken.quantity = undefined
    } else {
      buySharesState.inputToken.quantity = !isNaN(parseFloat(quantity)) ? quantity : '0'
    }
  }

  const validChain =
    snapUserState.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.currentNetworkIdHex)

  const balance = snap.inputToken && snap.inputToken.balance ? (snap.inputToken.balance as string) : '0'

  const quantity = snap.inputToken.quantity
  const usdUnitPrice = snap.inputToken && snap.inputToken.data && snap.inputToken.data?.usdPrice
  const usdValue =
    quantity && snap.inputToken && usdUnitPrice ? new BN(usdUnitPrice).multipliedBy(new BN(quantity)) : ''
  return (
    <$TokenInput screen={screen}>
      <$Horizontal flex={1}>
        <$Vertical flex={screen === 'desktop' ? 3 : 2}>
          <$Input
            value={quantity || ''}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            placeholder="0.00"
            disabled={props.quantityDisabled || !snap.inputToken.data}
            screen={screen}
            min={0}
          ></$Input>
          {usdValue ? (
            <$FineText screen={screen}>{`Spend ${new BN(usdValue).decimalPlaces(2).toString()}`} USD</$FineText>
          ) : null}
        </$Vertical>
        <$Vertical flex={1}>
          {props.lootbox ? (
            <$Button
              backgroundColor={`${COLORS.white}10`}
              backgroundColorHover={`${COLORS.surpressedBackground}50`}
              color={COLORS.black}
              onClick={selectToken}
              disabled={true}
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
                ...(props.selectDisabled && { cursor: 'not-allowed' }),
              }}
            >
              {/* <$CoinIcon screen={screen} src={props.lootbox.logoURI}></$CoinIcon> */}
              {props.lootbox.symbol}
            </$Button>
          ) : (
            <>Loading</>
          )}
          <$BalanceText screen={screen} style={{ flex: 1 }}>
            {parseEth(balance)} balance
          </$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default ShareInput
