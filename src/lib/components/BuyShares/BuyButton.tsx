import { $Button } from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useEthers } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { buySharesState, purchaseLootboxShare } from './state'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { BLOCKCHAINS } from '@wormgraph/helpers'

export interface BuyButtonProps {}
const BuyButton = (props: BuyButtonProps) => {
  const ethers = useEthers()
  const snapUserState = useSnapshot(userState)
  const snapBuySharesState = useSnapshot(buySharesState)
  const { screen } = useWindowSize()
  const isWalletConnected = snapUserState.accounts.length > 0
  const isInputAmountValid =
    snapBuySharesState.inputToken.quantity && parseFloat(snapBuySharesState.inputToken.quantity) > 0
  const ballance = new BN(snapBuySharesState.inputToken.balance || '0')
  const quantity = parseWei(
    snapBuySharesState.inputToken.quantity || '0',
    snapBuySharesState.inputToken.data?.decimals || 18
  )
  const lootQuantity = parseWei(
    snapBuySharesState.lootbox.quantity || '0',
    snapBuySharesState.lootbox.data?.shareDecimals || 18
  )
  const withinMaxShares = new BN(lootQuantity)
    .plus(snapBuySharesState.lootbox.data?.sharesSoldCount || '0')
    .lte(snapBuySharesState.lootbox.data?.sharesSoldMax || '')

  const sharesRemaining = new BN(snapBuySharesState.lootbox.data?.sharesSoldMax || '0').minus(snapBuySharesState.lootbox.data?.sharesSoldCount || '0').div(new BN(10).pow(snapBuySharesState.lootbox.data?.shareDecimals || '0'))
  const sharesRemainingFmt = sharesRemaining.toFixed(2).length > 8? sharesRemaining.toExponential(2): sharesRemaining.toFixed(2)

  const isInsufficientFunds = ballance.lt(quantity)
  const validChain =
    snapUserState.network.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.network.currentNetworkIdHex)

  const SuppressedButton = ({ txt }: { txt: string }) => {
    return (
      <$Button
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}40`}
        color={`${COLORS.surpressedFontColor}80`}
        style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
      >
        {txt}
      </$Button>
    )
  }
  if (!isWalletConnected) {
    return <WalletButton></WalletButton>
  } else if (isWalletConnected && (!snapBuySharesState.inputToken.data || !snapBuySharesState.lootbox.data)) {
    return (
      <$Button
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}40`}
        color={`${COLORS.surpressedFontColor}80`}
        style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
      >
        {validChain ? 'Select a Token' : 'Switch network'}
      </$Button>
    )
  } else if (isInsufficientFunds) {
    return <SuppressedButton txt={'Insufficient funds'}></SuppressedButton>
  } else if (isInputAmountValid && !withinMaxShares) {
    return <SuppressedButton txt={`Max ${sharesRemainingFmt} shares left`}></SuppressedButton>
  } else if (isInputAmountValid) {
    return (
      <$Button
        screen={screen}
        onClick={purchaseLootboxShare}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{ minHeight: '60px', height: '100px' }}
        disabled={snapBuySharesState.ui.isButtonLoading}
      >
        <LoadingText loading={snapBuySharesState.ui.isButtonLoading} text="BUY LOOTBOX" color={COLORS.trustFontColor} />
      </$Button>
    )
  }
  return (
    <$Button
      screen={screen}
      backgroundColor={`${COLORS.surpressedBackground}40`}
      color={`${COLORS.surpressedFontColor}80`}
      style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
    >
      Enter an amount
    </$Button>
  )
}

export default BuyButton
