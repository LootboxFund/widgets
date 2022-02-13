import { $Button } from 'lib/components/Button'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { crowdSaleState, purchaseGuildToken, approveStableCoinToken } from './state'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { LoadingText } from 'lib/components/Spinner'

export interface BuyButtonProps {}
const BuyButton = (props: BuyButtonProps) => {
  const web3 = useWeb3()
  const snapUserState = useSnapshot(userState)
  const snapCrowdSaleState = useSnapshot(crowdSaleState)
  const { screen } = useWindowSize()
  const isWalletConnected = snapUserState.accounts.length > 0
  const isInputAmountValid =
    snapCrowdSaleState.inputToken.quantity && parseFloat(snapCrowdSaleState.inputToken.quantity) > 0
  const allowance = new BN(snapCrowdSaleState.inputToken.allowance || '0')
  const ballance = new BN(snapCrowdSaleState.inputToken.balance || '0')
  const quantity = parseWei(
    snapCrowdSaleState.inputToken.quantity || '0',
    snapCrowdSaleState.outputToken.data?.decimals
  )

  const isAllowanceCovered = isInputAmountValid && allowance.gte(quantity)
  const isInsufficientFunds = ballance.lt(quantity)
  const validChain =
    snapUserState.network.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.network.currentNetworkIdHex)

  if (!isWalletConnected) {
    return <WalletButton></WalletButton>
  } else if (isWalletConnected && (!snapCrowdSaleState.inputToken.data || !snapCrowdSaleState.outputToken.data)) {
    return (
      <$Button
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}40`}
        color={`${COLORS.surpressedFontColor}80`}
        style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
      >
        {validChain ? 'Select a Token' : 'Switch Network'}
      </$Button>
    )
  } else if (isInsufficientFunds) {
    return (
      <$Button
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}40`}
        color={`${COLORS.surpressedFontColor}80`}
        style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
      >
        Insufficient Funds
      </$Button>
    )
  } else if (isInputAmountValid && !isAllowanceCovered) {
    return (
      <$Button
        screen={screen}
        onClick={approveStableCoinToken}
        backgroundColor={`${COLORS.warningBackground}`}
        color={`${COLORS.warningFontColor}`}
        style={{ minHeight: '60px', height: '100px' }}
        disabled={snapCrowdSaleState.ui.isButtonLoading}
      >
        <LoadingText
          loading={snapCrowdSaleState.ui.isButtonLoading}
          text="Approve Transaction"
          color={COLORS.warningFontColor}
        />
      </$Button>
    )
  } else if (isInputAmountValid) {
    return (
      <$Button
        screen={screen}
        onClick={purchaseGuildToken}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{ minHeight: '60px', height: '100px' }}
        disabled={snapCrowdSaleState.ui.isButtonLoading}
      >
        <LoadingText loading={snapCrowdSaleState.ui.isButtonLoading} text="PURCHASE" color={COLORS.trustFontColor} />
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
