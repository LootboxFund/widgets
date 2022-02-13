import { $Button } from 'lib/components/Button'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { snapshot, useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
// import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { LoadingText } from 'lib/components/Spinner'
import { ticketCardState } from './state'

export interface ViewPayoutButtonProps {}
const ViewPayoutButton = (props: ViewPayoutButtonProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(ticketCardState)

  //     if (!isWalletConnected) {
  //     return <WalletButton></WalletButton>
  //   } else if (isWalletConnected && (!snapCrowdSaleState.inputToken.data || !snapCrowdSaleState.outputToken.data)) {
  //     return (
  //       <$Button
  //         screen={screen}
  //         backgroundColor={`${COLORS.surpressedBackground}40`}
  //         color={`${COLORS.surpressedFontColor}80`}
  //         style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
  //       >
  //         {validChain ? 'Select a Token' : 'Switch Network'}
  //       </$Button>
  //     )
  //   } else if (isInsufficientFunds) {
  //     return (
  //       <$Button
  //         screen={screen}
  //         backgroundColor={`${COLORS.surpressedBackground}40`}
  //         color={`${COLORS.surpressedFontColor}80`}
  //         style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
  //       >
  //         Insufficient Funds
  //       </$Button>
  //     )
  //   } else if (isInputAmountValid && !isAllowanceCovered) {
  //     return (
  //       <$Button
  //         screen={screen}
  //         onClick={approveStableCoinToken}
  //         backgroundColor={`${COLORS.warningBackground}`}
  //         color={`${COLORS.warningFontColor}`}
  //         style={{ minHeight: '60px', height: '100px' }}
  //         disabled={snapCrowdSaleState.ui.isButtonLoading}
  //       >
  //         <LoadingText
  //           loading={snapCrowdSaleState.ui.isButtonLoading}
  //           text="Approve Transaction"
  //           color={COLORS.warningFontColor}
  //         />
  //       </$Button>
  //     )
  //   } else if (isInputAmountValid) {
  //     return (
  //       <$Button
  //         screen={screen}
  //         onClick={purchaseGuildToken}
  //         backgroundColor={`${COLORS.trustBackground}C0`}
  //         backgroundColorHover={`${COLORS.trustBackground}`}
  //         color={COLORS.trustFontColor}
  //         style={{ minHeight: '60px', height: '100px' }}
  //         disabled={snapCrowdSaleState.ui.isButtonLoading}
  //       >
  //         <LoadingText loading={snapCrowdSaleState.ui.isButtonLoading} text="PURCHASE" color={COLORS.trustFontColor} />
  //       </$Button>
  //     )
  //   }

  const toggleRoute = () => {
    if (snap.route === '/payout') {
      ticketCardState.route = '/card'
    } else if (snap.route === '/card') {
      ticketCardState.route = '/payout'
    }
  }

  return (
    <$Button
      screen={screen}
      onClick={toggleRoute}
      backgroundColor={`${COLORS.trustBackground}C0`}
      backgroundColorHover={`${COLORS.trustBackground}`}
      color={COLORS.trustFontColor}
      style={{ minHeight: '60px', height: '100px', filter: 'drop-shadow(0px 4px 30px rgba(0, 178, 255, 0.5))' }}
    >
      View Payout
    </$Button>
  )
}

export default ViewPayoutButton
