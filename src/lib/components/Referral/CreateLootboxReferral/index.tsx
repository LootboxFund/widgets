import {
  CreateReferralResponse,
  CreateReferralResponseSuccess,
  MutationCreateReferralArgs,
  Referral,
  ReferralType,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { LootboxID, TournamentID } from '@wormgraph/helpers'
import { CREATE_REFERRAL, CreateReferralFE, CreateReferralResponseFE } from './api.gql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { $ErrorMessage, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import $Button from 'lib/components/Generics/Button'
import Spinner, { LoadingText } from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { manifest } from 'manifest'
import QRCode from 'lib/components/ViralOnboarding/components/QRCode'

interface Props {
  lootboxID: LootboxID
  tournamentId: TournamentID
  qrcodeMargin?: string
}

const CreateLootboxReferral = (props: Props) => {
  const { screen } = useWindowSize()
  const [createReferral, { loading }] = useMutation<
    { createReferral: CreateReferralResponseFE | ResponseError },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL)
  const [createdReferrals, setCreatedReferrals] = useState<CreateReferralFE[]>([])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [referrerId, setReferrerId] = useState('')
  const [referralType, setReferralType] = useState<ReferralType>(ReferralType.Viral)
  const [errorMessage, setErrorMessage] = useState('')
  const intl = useIntl()
  const words = useWords()
  const [wasCopied, setWasCopied] = useState(false)

  const lootboxRequiredText = intl.formatMessage({
    id: `referral.create.form.lootboxRequired`,
    defaultMessage: 'Lootbox is required',
  })

  const handleButtonClick = async () => {
    setErrorMessage('')
    try {
      if (!props.lootboxID) {
        throw new Error(lootboxRequiredText)
      } else if (!props.tournamentId) {
        throw new Error('Tournament is required')
      }

      const { data } = await createReferral({
        variables: {
          payload: {
            campaignName,
            lootboxID: props.lootboxID,
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

      const referral = (data.createReferral as CreateReferralResponseFE).referral

      console.log('created referral', referral)

      if (referral) {
        setCreatedReferrals([...createdReferrals, referral])
      }
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
          id="inviteLink.modal.header.postCosmic"
          description="Title of this modal for inviting friends"
          defaultMessage="Invite Friends"
        />
      </b>
      <span style={{ fontWeight: 'lighter', margin: '10px 0px 15px 0px', color: COLORS.black }}>
        <FormattedMessage
          id="inviteLink.modal.description.postCosmic"
          description="Description of the invite link modal contents"
          defaultMessage="You’ll BOTH get extra free Lootbox Tickets for each person invited"
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
          id="inviteLink.modal.enableBonusClaim.postCosmic"
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
              id="inviteLink.modal.onetime.text.postCosmic"
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
            👇 <FormattedMessage id="inviteLink.modal.success.header.postCosmic" defaultMessage="Your Referral Link" />{' '}
            👇
          </b>
          <br />
          <span style={{ fontWeight: 'lighter', margin: '0px 15px', color: COLORS.black, textAlign: 'center' }}>
            <FormattedMessage
              id="inviteLink.modal.success.description.postCosmic"
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
              id="inviteLink.modal.success.screenshotHeader.postCosmic"
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

const $InputMedium = styled.input<{ width?: string }>`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;

  color: ${COLORS.surpressedFontColor}ae;

  ${(props) => props.width && `width: ${props.width}`};

  &:focus {
    color: ${COLORS.black}ca;
  }
`

export default CreateLootboxReferral
