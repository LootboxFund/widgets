import { $Button } from 'lib/components/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { ticketCardState, generateStateID } from './state'

export interface RedeemButtonProps {
  ticketID: string | undefined
}

const RedeemButton = (props: RedeemButtonProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(ticketCardState)
  const snapUser = useSnapshot(userState)

  const isWalletConnected = snapUser.accounts.length > 0
  const stateID = props.ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] ? snap.tickets[stateID] : undefined

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
    const stateID = snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress, props.ticketID)
    if (stateID && snap.tickets[stateID]) {
      if (snap.tickets[stateID].route === '/payout') {
        ticketCardState.tickets[stateID].route = '/card'
      } else if (snap.tickets[stateID].route === '/card') {
        ticketCardState.tickets[stateID].route = '/payout'
      }
    }
  }

  if (!props.ticketID) {
    return (
      <$Button
        disabled={true}
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}15`}
        backgroundColorHover={`${COLORS.surpressedBackground}`}
        color={`${COLORS.surpressedFontColor}aa`}
        style={{ minHeight: '60px', height: '100px' }}
      >
        REDEEM
      </$Button>
    )
  } else if (ticket?.route === '/payout') {
    if (!isWalletConnected) {
      return <WalletButton />
    } else {
      return (
        <$Button
          screen={screen}
          // onClick={toggleRoute}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{ minHeight: '60px', height: '100px', filter: 'drop-shadow(0px 4px 30px rgba(0, 178, 255, 0.5))' }}
        >
          REDEEM
        </$Button>
      )
    }
  } else {
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
}

export default RedeemButton
