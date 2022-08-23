import react, { useEffect } from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { ticketCardState, generateStateID } from './state'
import { $TicketRedeemContainer } from './TicketCard'
import { parseEth } from 'lib/utils/bnConversion'
import { $Horizontal } from 'lib/components/Generics'
import { loadDividends } from './state'
import { ContractAddress, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { IDividend } from 'lib/types'
import { FormattedMessage, useIntl } from 'react-intl'

export interface ViewPayoutProps {
  ticketID: string | undefined
  staticHeight?: string
}

const ViewPayout = (props: ViewPayoutProps) => {
  const snap = useSnapshot(ticketCardState)
  const intl = useIntl()
  const stateID =
    snap.lootboxAddress && props.ticketID && generateStateID(snap.lootboxAddress as ContractAddress, props.ticketID)
  const ticket = stateID && snap.tickets[stateID] && snap.tickets[stateID]
  const dividends = ticket && (ticket.dividends as IDividend[])
  const activeDividends = dividends && dividends.filter((dividend) => !dividend.isRedeemed)
  const collectDividendsText = intl.formatMessage({
    id: 'ticketCard.viewPayout.collectDividendsText',
    defaultMessage: 'Collect New Dividends',
    description:
      'Header indicating that a user can collect dividends from a Lootbox. This means, they can get money from it.',
  })
  const noDividendsText = intl.formatMessage({
    id: 'ticketCard.viewPayout.noDividendsText',
    defaultMessage: 'No New Dividends',
    description: 'Header indicating that a user has no dividends to collect from a Lootbox.',
  })

  const title = activeDividends?.length ? collectDividendsText : noDividendsText

  useEffect(() => {
    if (props.ticketID) {
      loadDividends(props.ticketID).catch((err) => console.error('Error loading ticket dividends', err))
    }
  }, [props.ticketID])

  const sendToCardView = () => {
    if (stateID && snap.tickets[stateID]) {
      ticketCardState.tickets[stateID].route = '/card'
    }
  }

  const sortDividends = (a: IDividend, b: IDividend) => {
    if (a.isRedeemed && b.isRedeemed) {
      return 0
    } else {
      return a.isRedeemed ? 1 : -1
    }
  }

  const NoDividendsYet = () => {
    return (
      <$NoDividendContainer>
        <$NoDividendIcon>🧐</$NoDividendIcon>
        <br />
        <$NoDividendText>
          <FormattedMessage
            id="ticketCard.viewPayout.subHeader.noDividends"
            defaultMessage="The gamer has not deposited any earnings yet. Come back later to claim your rewards."
            description="Text displayed when the Lootbox owner has not deposited any earnings yet and so, the investor cannot redeem anything from their profit share NFTs."
          />
        </$NoDividendText>
      </$NoDividendContainer>
    )
  }

  return (
    <$TicketRedeemContainer staticHeight={props.staticHeight}>
      <$Horizontal justifyContent="space-between">
        <$MinorHeading>{title}</$MinorHeading>
        <$XIcon onClick={() => sendToCardView()}>X</$XIcon>
      </$Horizontal>

      {dividends && dividends?.length > 0 ? (
        [...dividends].sort(sortDividends).map((dividend, idx) => {
          return (
            <$DividendRow key={`${snap.lootboxAddress}-${props.ticketID}-${idx}`} isActive={!dividend.isRedeemed}>
              <$DividendOwed>{parseEth(dividend.tokenAmount, Number(dividend.decimal))}</$DividendOwed>
              <$DividendTokenSymbol>{dividend.tokenSymbol}</$DividendTokenSymbol>
            </$DividendRow>
          )
        })
      ) : (
        <NoDividendsYet />
      )}
    </$TicketRedeemContainer>
  )
}

export const $DividendRow = styled.section<{ isActive: boolean }>`
  height: 56px;
  background: ${(props) => (props.isActive ? `${COLORS.trustBackground}35` : `${COLORS.surpressedBackground}35`)};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
`

export const $DividendOwed = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 27px;
  color: #000000;
  margin: auto 0px;
`

export const $DividendTokenSymbol = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 22px;

  display: flex;
  align-items: center;
  text-align: right;

  color: #000000;
`

export const $MinorHeading = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.8rem;
  line-height: 11px;
  /* identical to box height */

  display: flex;
  align-items: center;

  color: #000000;
  padding: 0px 0px 0px 20px;

  text-transform: uppercase;
`

const $XIcon = styled.span`
  font-family: sans-serif;
  padding: 0px 5px 0px 0px;
  cursor: pointer;
`

const $NoDividendIcon = styled.section`
  width: 100%;
  font-size: 3rem;
  text-align: center;
`

const $NoDividendText = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  color: ${COLORS.surpressedFontColor}da;
`

const $NoDividendContainer = styled.section`
  flex: 1;
  margin: 0 auto;
  flex-direction: column;
  margin-top: 20px;
`

export default ViewPayout
