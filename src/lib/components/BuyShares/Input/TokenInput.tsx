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
import { $TokenInput, $FineText, $CoinIcon, $BalanceText } from './shared'

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
                ...(props.selectDisabled && { cursor: 'not-allowed' }),
              }}
            >
              <$CoinIcon screen={screen} src={props.selectedToken.logoURI}></$CoinIcon>
              {props.selectedToken.symbol}
            </$Button>
          ) : (
            renderSelectTokenButton()
          )}
          <$BalanceText screen={screen} style={{ flex: 1 }}>
            {parseEth(balance)} balance
          </$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default TokenInput
