import react, { useState } from 'react'
import { $Button } from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { ticketCardState, generateStateID, redeemTicket } from './state'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { ContractAddress } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import { getWords } from 'lib/api/words'

export interface RedeemButtonProps {
  ticketID: string | undefined
  isRedeemable: boolean
}

const RedeemButton = (props: RedeemButtonProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(ticketCardState)
  const snapUser = useSnapshot(userState)
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const words = getWords(intl)

  const isWalletConnected = snapUser.accounts.length > 0
  const stateID =
    props.ticketID && snap.lootboxAddress && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] ? snap.tickets[stateID] : undefined

  const toggleRoute = () => {
    const stateID =
      snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
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

  const redeemText = intl.formatMessage({
    id: 'ticketCard.redeemButton.text',
    defaultMessage: 'Redeem',
    description: 'Button prompt for a user to redeem their Lootbox NFT - which means, get money from it.',
  })

  if (!props.ticketID) {
    return (
      <$Button
        disabled={true}
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}15`}
        backgroundColorHover={`${COLORS.surpressedBackground}`}
        color={`${COLORS.surpressedFontColor}aa`}
        style={{ minHeight: '60px', height: '60px', maxHeight: '60px', textTransform: 'uppercase' }}
      >
        {redeemText}
      </$Button>
    )
  } else if (ticket?.route === '/payout') {
    if (!isWalletConnected) {
      return <WalletButton />
    } else if (!props.isRedeemable) {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${COLORS.surpressedBackground}15`}
          backgroundColorHover={`${COLORS.surpressedBackground}`}
          color={`${COLORS.surpressedFontColor}aa`}
          style={{ minHeight: '60px', height: '100px', textTransform: 'uppercase' }}
          onClick={toggleRoute}
        >
          {words.back}
        </$Button>
      )
    } else {
      return (
        <$Button
          screen={screen}
          onClick={redeem}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{
            minHeight: '60px',
            height: '100px',
            filter: 'drop-shadow(0px 4px 30px rgba(0, 178, 255, 0.5))',
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            textTransform: 'uppercase',
          }}
          disabled={loading}
        >
          <LoadingText loading={loading} text={redeemText} color={COLORS.trustFontColor} />
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
        style={{
          minHeight: '60px',
          height: '100px',
          filter: 'drop-shadow(0px 4px 30px rgba(0, 178, 255, 0.5))',
          boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
        }}
      >
        <FormattedMessage
          id="ticketCard.redeemButton.maintext"
          defaultMessage="View Payout"
          description="Button prompt for a user to view how much money they can redeem from their Lootbox NFT"
        />
      </$Button>
    )
  }
}

export default RedeemButton
