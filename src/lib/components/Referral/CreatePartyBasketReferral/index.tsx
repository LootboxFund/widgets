import {
  CreateReferralResponse,
  CreateReferralResponseSuccess,
  MutationCreateReferralArgs,
  Referral,
  ReferralType,
} from 'lib/api/graphql/generated/types'
import { PartyBasketID, TournamentID } from 'lib/types'
import { CREATE_REFERRAL } from './api.gql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { $ErrorMessage, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $InputMedium } from 'lib/components/Tournament/common'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import $Button from 'lib/components/Generics/Button'
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
  const [bonucClaimEnabled, setBonusClaimEnabled] = useState(true)
  const [createReferral, { loading }] = useMutation<
    { createReferral: CreateReferralResponse },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL)
  const [createdReferrals, setCreatedReferrals] = useState<Referral[]>([])
  const [campaignName, setCampaignName] = useState('')
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
            type: !!bonucClaimEnabled ? ReferralType.Viral : ReferralType.Genesis,
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
      <input
        placeholder="Campaign Name (Optional)"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        style={{
          margin: '5px 0px',
          height: '20px',
          backgroundColor: `rgba(0,0,0,0.05)`,
          padding: '15px',
          fontSize: '1rem',
          border: '0px solid white',
        }}
      ></input>
      <br />
      <$span>
        <$Checkbox
          type="checkbox"
          checked={bonucClaimEnabled}
          onChange={() => setBonusClaimEnabled(!bonucClaimEnabled)}
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
              <QRCode referral={createdReferrals[createdReferrals?.length - 1]} />
            </div>
          )}
        </$Vertical>
      )}
    </$Vertical>
    // <$AddReferralContainer>
    //   {createdReferrals?.length > 0 && (
    //     <$Vertical spacing={2}>
    //       {createdReferrals.map((ref: Referral) => {
    //         return (
    //           <$ReferralItemContainer key={ref.id}>
    //             <$Horizontal justifyContent="space-between">
    //               <$span>{ref.campaignName}</$span>
    //               <$span>{ref.slug}</$span>
    //             </$Horizontal>
    //           </$ReferralItemContainer>
    //         )
    //       })}
    //     </$Vertical>
    //   )}
    //   <$Vertical spacing={2}>
    //     <$Horizontal flexWrap={screen === 'mobile'} spacing={2}>
    //       <$InputMedium
    //         placeholder={nameYourReferralCampaign}
    //         value={campaignName}
    //         onChange={(e) => setCampaignName(e.target.value)}
    //         style={{
    //           borderRadius: '5px',
    //           background: COLORS.white,
    //           marginTop: '10px',
    //           marginBottom: '10px',
    //           boxSizing: 'border-box',
    //         }}
    //         width={screen === 'mobile' ? '100%' : '65%'}
    //       />

    //       <div style={{ margin: 'auto 0' }}>
    //         <$Button
    //           id="button-add-stream"
    //           screen={screen}
    //           onClick={handleButtonClick}
    //           backgroundColor={`${COLORS.trustBackground}`}
    //           backgroundColorHover={`${COLORS.trustBackground}`}
    //           color={COLORS.trustFontColor}
    //           style={{
    //             boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
    //             fontWeight: TYPOGRAPHY.fontWeight.regular,
    //             fontSize: TYPOGRAPHY.fontSize.large,
    //             whiteSpace: 'nowrap',
    //           }}
    //           disabled={loading}
    //         >
    //           <LoadingText loading={loading} text={createReferralText} color={COLORS.trustFontColor} />
    //         </$Button>
    //       </div>
    //     </$Horizontal>
    //     {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
    //   </$Vertical>
    // </$AddReferralContainer>
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
