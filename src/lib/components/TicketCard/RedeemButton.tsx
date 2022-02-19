import react, { useState } from 'react'
import { $Button } from 'lib/components/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { ticketCardState, generateStateID, redeemTicket } from './state'
import { LoadingText } from 'lib/components/Spinner'

export interface RedeemButtonProps {
  ticketID: string | undefined
}

const RedeemButton = (props: RedeemButtonProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(ticketCardState)
  const snapUser = useSnapshot(userState)
  const [loading, setLoading] = useState(false)

  const isWalletConnected = snapUser.accounts.length > 0
  const stateID = props.ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] ? snap.tickets[stateID] : undefined

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

  const redeem = async () => {
    if (!props.ticketID) {
      return
    }
    setLoading(true)
    try {
      await redeemTicket(props.ticketID)
    } catch (err) {
    } finally {
      setLoading(false)
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
          onClick={redeem}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{ minHeight: '60px', height: '100px', filter: 'drop-shadow(0px 4px 30px rgba(0, 178, 255, 0.5))' }}
          disabled={loading}
        >
          <LoadingText loading={loading} text="REDEEM" color={COLORS.trustFontColor} />
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
