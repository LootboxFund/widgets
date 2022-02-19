import react from 'react'
import { COLORS } from 'lib/theme'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Button'
import { $Input } from 'lib/components/Input'
import { buySharesState } from '../state'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, TokenDataFE, USD_DECIMALS } from 'lib/hooks/constants'
import { userState } from 'lib/state/userState'
import BN from 'bignumber.js'
import useWindowSize from 'lib/hooks/useScreenSize'
import { parseEth } from '../helpers'
import { $TokenInput, $FineText, $CoinIcon, $BalanceText, $TokenSymbol } from './shared'

export interface TokenInputProps {
  selectedToken?: TokenDataFE
  tokenDisabled?: boolean
  quantityDisabled?: boolean
  selectDisabled?: boolean
}

const TokenInput = (props: TokenInputProps) => {
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const setQuantity = (quantity: string) => {
    if (quantity?.length === 0) {
      buySharesState.inputToken.quantity = undefined
    } else {
      buySharesState.inputToken.quantity = !isNaN(parseFloat(quantity)) ? quantity : '0'
    }
  }

  const Button = ({}) => {
    if (props.selectedToken) {
      return (
        <$Button
          backgroundColor={`${COLORS.white}10`}
          backgroundColorHover={`${COLORS.surpressedBackground}50`}
          color={COLORS.black}
          disabled={true}
          screen={screen}
          style={{ display: 'flex' }}
          justifyContent="center"
        >
          <$CoinIcon screen={screen} src={props.selectedToken.logoURI}></$CoinIcon>
          <$TokenSymbol screen={screen}> {props.selectedToken.symbol}</$TokenSymbol>
        </$Button>
      )
    } else {
      return (
        <$Button
          backgroundColor={`${COLORS.white}10`}
          backgroundColorHover={`${COLORS.surpressedBackground}50`}
          color={COLORS.surpressedFontColor}
          disabled={true}
          screen={screen}
          style={{ color: COLORS.surpressedFontColor }}
          justifyContent="center"
        >
          <$TokenSymbol screen={screen} padding={'10px'}>
            loading...
          </$TokenSymbol>
        </$Button>
      )
    }
  }

  const balance = snap.inputToken && snap.inputToken.balance ? (snap.inputToken.balance as string) : '0'

  const quantity = snap.inputToken.quantity
  const usdValue =
    quantity && snap.inputToken?.data?.usdPrice
      ? new BN(snap.inputToken.data.usdPrice).multipliedBy(new BN(quantity)).dividedBy(new BN(10).pow(USD_DECIMALS))
      : '0'

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
          <Button />
          <$BalanceText screen={screen} style={{ flex: 1 }}>
            {parseEth(balance)} balance
          </$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default TokenInput
