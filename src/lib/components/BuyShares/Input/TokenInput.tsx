import react from 'react'
import { COLORS } from 'lib/theme'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Generics/Button'
import { InputDecimal } from 'lib/components/Generics/Input'
import { buySharesState } from '../state'
import { useSnapshot } from 'valtio'
import { TokenDataFE, USD_DECIMALS } from 'lib/hooks/constants'
import BN from 'bignumber.js'
import useWindowSize from 'lib/hooks/useScreenSize'
import { parseEth } from '../helpers'
import { $TokenInput, $FineText, $CoinIcon, $TokenSymbol } from './shared'

export interface TokenInputProps {
  selectedToken?: TokenDataFE
  tokenDisabled?: boolean
  quantityDisabled?: boolean
  selectDisabled?: boolean
}

const TokenInput = (props: TokenInputProps) => {
  const snap = useSnapshot(buySharesState)
  const { screen } = useWindowSize()

  const setQuantity = (quantity: string | undefined) => {
    buySharesState.inputToken.quantity = quantity || '0'
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
            <$FineText screen={screen}>loading...</$FineText>
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
          <InputDecimal onChange={setQuantity} disabled={props.quantityDisabled || !snap.inputToken.data} />
          {usdValue ? (
            <$FineText screen={screen}>{`Spend ${new BN(usdValue).decimalPlaces(2).toString()}`} USD</$FineText>
          ) : null}
        </$Vertical>
        <$Vertical flex={1}>
          <Button />
          <$FineText screen={screen} style={{ marginTop: '10px', textAlign: 'right' }}>
            {parseEth(balance)} balance
          </$FineText>
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default TokenInput
