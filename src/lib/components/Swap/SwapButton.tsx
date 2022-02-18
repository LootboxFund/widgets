import { $Button } from 'lib/components/Button'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { swapState } from './state'

export interface SwapButtonProps {}
const SwapButton = (props: SwapButtonProps) => {
  const snapUserState = useSnapshot(userState)
  const snapSwapState = useSnapshot(swapState)
  const { screen } = useWindowSize()
  const isWalletConnected = snapUserState.accounts.length > 0
  const validChain =
    snapUserState.network.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.network.currentNetworkIdHex)

  if (!isWalletConnected) {
    return <WalletButton></WalletButton>
  } else if (isWalletConnected && (!snapSwapState.inputToken.data || !snapSwapState.outputToken.data)) {
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
  } else if (snapSwapState.inputToken.quantity && parseFloat(snapSwapState.inputToken.quantity) > 0) {
    return (
      <$Button
        screen={screen}
        onClick={() => console.log('Making purchase')}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{ minHeight: '60px', height: '100px' }}
      >
        PURCHASE
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

export default SwapButton
