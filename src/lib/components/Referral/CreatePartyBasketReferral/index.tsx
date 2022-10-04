import {
  CreateReferralResponse,
  CreateReferralResponseSuccess,
  MutationCreateReferralArgs,
  Referral,
  ReferralType,
} from 'lib/api/graphql/generated/types'
import { CREATE_REFERRAL } from './api.gql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { $ErrorMessage, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $InputMedium } from 'lib/components/Tournament/common'
import { COLORS, TYPOGRAPHY, PartyBasketID, TournamentID } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import Spinner, { LoadingText } from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { manifest } from 'manifest'
import QRCode from 'lib/components/ViralOnboarding/components/QRCode'

interface Props {
  partyBasketId: PartyBasketID
  tournamentId: TournamentID
  qrcodeMargin?: string
}

const CreatePartyBasketReferral = (props: Props) => {
  const { screen } = useWindowSize()
  const [createReferral, { loading }] = useMutation<
    { createReferral: CreateReferralResponse },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL)
  const [createdReferrals, setCreatedReferrals] = useState<Referral[]>([])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [referrerId, setReferrerId] = useState('')
  const [referralType, setReferralType] = useState<ReferralType>(ReferralType.Viral)
  const [errorMessage, setErrorMessage] = useState('')
  const intl = useIntl()
  const words = useWords()
  const [wasCopied, setWasCopied] = useState(false)

  const partyBasketRequiredText = intl.formatMessage({
    id: `referral.create.form.partyBasketRequired`,
    defaultMessage: 'Party Basket is required',
  })
  const tournamentRequiredText = intl.formatMessage({
    id: `referral.create.form.tournamentRequired`,
    defaultMessage: 'Tournament is required',
  })

  const handleButtonClick = async () => {
    setErrorMessage('')
    try {
      if (!props.partyBasketId) {
        throw new Error(partyBasketRequiredText)
      } else if (!props.tournamentId) {
        throw new Error(tournamentRequiredText)
      }

      const { data } = await createReferral({
        variables: {
          payload: {
            campaignName,
            partyBasketId: props.partyBasketId,
            tournamentId: props.tournamentId,
            type: referralType,
            referrerId: !!referrerId ? referrerId : undefined,
          },
        },
      })

      if (!data) {
        throw new Error(`${words.anErrorOccured}!`)
      } else if (data?.createReferral?.__typename === 'ResponseError') {
        throw new Error(data?.createReferral.error?.message || words.anErrorOccured)
      }

      const referral = (data.createReferral as CreateReferralResponseSuccess).referral as Referral

      console.log('created referral', referral)

      setCreatedReferrals([...createdReferrals, referral])

      setCampaignName('')
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message || words.anErrorOccured)
    }
  }

  const lastReferral = createdReferrals.length > 0 ? createdReferrals[createdReferrals.length - 1] : undefined
  const lastReferralLink = lastReferral
    ? `${manifest.microfrontends.webflow.referral}?r=${lastReferral.slug}`
    : undefined

  return (
    <$Vertical width="100%" justifyContent="center" style={{ padding: '30px', boxSizing: 'border-box' }}>
      <b style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        <FormattedMessage
          id="inviteLink.modal.header"
          description="Title of this modal for inviting friends"
          defaultMessage="Invite Friends"
        />
      </b>
      <span style={{ fontWeight: 'lighter', margin: '10px 0px 15px 0px', color: COLORS.black }}>
        <FormattedMessage
          id="inviteLink.modal.description"
          description="Description of the invite link modal contents"
          defaultMessage="You’ll BOTH get extra free lottery tickets for each person invited"
        />
      </span>
      <$InputMedium
        placeholder="Campaign Name (Optional)"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
      ></$InputMedium>
      <br />
      <$span>
        <$Checkbox
          type="checkbox"
          checked={referralType === ReferralType.Viral}
          onChange={() =>
            setReferralType(referralType === ReferralType.Viral ? ReferralType.Genesis : ReferralType.Viral)
          }
        />
        <FormattedMessage
          id="inviteLink.modal.enableBonusClaim"
          defaultMessage="Get Bonus Rewards for Referrals"
          description="Checkbox label, when clicked, the user will get a reward if a referral signs up from them"
        />
      </$span>
      <br />
      <button
        onClick={handleButtonClick}
        style={{
          flex: 1,
          color: COLORS.trustFontColor,
          backgroundColor: lastReferralLink ? `${COLORS.trustBackground}70` : COLORS.trustBackground,
          border: '0px solid white',
          padding: '15px',
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        <LoadingText loading={loading} text={words.generateInviteLinkText} color={COLORS.white} />
      </button>
      <br />
      <br />
      <$span
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        style={{
          textTransform: 'lowercase',
          color: `${COLORS.surpressedFontColor}26`,
          fontStyle: 'italic',
          textAlign: 'end',
          cursor: 'pointer',
        }}
      >
        {words.advanced}
      </$span>
      {isAdvancedOpen && (
        <$Vertical>
          <br />
          <$InputMedium
            placeholder="Referrer User ID"
            value={referrerId}
            onChange={(e) => setReferrerId(e.target.value)}
          ></$InputMedium>
          <br />
          <$span style={{ textTransform: 'capitalize' }}>
            <$Checkbox
              type="checkbox"
              checked={referralType === ReferralType.OneTime}
              onChange={() =>
                setReferralType(referralType === ReferralType.OneTime ? ReferralType.Viral : ReferralType.OneTime)
              }
            />
            <FormattedMessage
              id="inviteLink.modal.onetime.text"
              defaultMessage="Participation Reward"
              description="Checkbox label, referral can be claimed only once."
            />
          </$span>
        </$Vertical>
      )}

      {errorMessage ? <$ErrorMessage style={{ paddingTop: '15px' }}>{errorMessage}</$ErrorMessage> : null}
      {lastReferralLink && (
        <$Vertical>
          <br />
          <b
            style={{
              fontWeight: 'bold',
              fontSize: screen === 'mobile' ? '1.2rem' : '1.5rem',
              textAlign: 'center',
              padding: '15px',
            }}
          >
            👇 <FormattedMessage id="inviteLink.modal.success.header" defaultMessage="Your Referral Link" /> 👇
          </b>
          <br />
          <span style={{ fontWeight: 'lighter', margin: '0px 15px', color: COLORS.black, textAlign: 'center' }}>
            <FormattedMessage
              id="inviteLink.modal.success.description"
              defaultMessage="Copy the link and share it with your friends."
            />
          </span>
          <$Horizontal width="100%" justifyContent="center" style={{ paddingTop: '15px' }}>
            <input
              value={lastReferralLink}
              style={{
                flex: 5,
                height: '20px',
                backgroundColor: `rgba(0,0,0,0.05)`,
                padding: '15px',
                fontSize: '1rem',
                border: '0px solid white',
                cursor: 'not-allowed',
              }}
            ></input>
            <button
              style={{
                flex: 1,
                color: COLORS.trustFontColor,
                backgroundColor: lastReferralLink ? `${COLORS.trustBackground}` : `${COLORS.trustBackground}20`,
                border: '0px solid white',
                padding: '10px',
                borderRadius: '5px',
                marginLeft: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
              onClick={() => {
                if (lastReferralLink) {
                  navigator.clipboard.writeText(lastReferralLink)
                  setWasCopied(true)
                  setTimeout(() => {
                    setWasCopied(false)
                  }, 2000)
                } else {
                  setErrorMessage(words.anErrorOccured)
                }
              }}
            >
              {wasCopied ? '✅ ' : ''}
              {words.copy}
            </button>
          </$Horizontal>
          <br />
          <br />
          <b
            style={{
              fontWeight: 'bold',
              fontSize: screen === 'mobile' ? '1.2rem' : '1.5rem',
              textAlign: 'center',
              padding: '15px',
            }}
          >
            👇{' '}
            <FormattedMessage
              id="inviteLink.modal.success.screenshotHeader"
              defaultMessage="Screenshot the QRCode and Share with Friends"
            />{' '}
            👇
          </b>
          <br />
          <br />
          {loading ? (
            <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
          ) : (
            <div style={props.qrcodeMargin ? { margin: props.qrcodeMargin } : {}}>
              {/* @ts-ignore this is deprecated */}
              <QRCode referral={createdReferrals[createdReferrals?.length - 1]} inline={true} />
            </div>
          )}
        </$Vertical>
      )}
    </$Vertical>
  )
}

const $ReferralItemContainer = styled.div`
  background: #f2f2f2;
  border-radius: 20px;
  width: 100%;
  padding: 0px 15px;
  box-sizing: border-box;
`

const $AddReferralContainer = styled.div`
  background: #f2f2f2;
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;
`

const $Checkbox = styled.input`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 10px;
  cursor: pointer;
`

export default CreatePartyBasketReferral
