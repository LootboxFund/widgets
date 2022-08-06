import {
  CreateReferralResponse,
  CreateReferralResponseSuccess,
  MutationCreateReferralArgs,
  Referral,
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
import { useIntl } from 'react-intl'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'

interface Props {
  partyBasketId: PartyBasketID
  tournamentId: TournamentID
}

const CreatePartyBasketReferral = (props: Props) => {
  const { screen } = useWindowSize()
  const [createReferral, { loading }] = useMutation<
    { createReferral: CreateReferralResponse },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL)
  const [createdReferrals, setCreatedReferrals] = useState<Referral[]>([])
  const [campaignName, setCampaignName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const intl = useIntl()
  const words = useWords()

  const nameYourReferralCampaign = intl.formatMessage({
    id: 'referral.create.form.nameYourReferralCampaign',
    defaultMessage: 'Name your Referral Campaign',
    description: 'Placeholder label for Referral Campaign name input',
  })
  const createReferralText = intl.formatMessage({
    id: 'referral.create.form.createReferral',
    defaultMessage: 'Create Referral',
    description: 'Placeholder label for generating Referral link',
  })
  const campaignNameRequiredText = intl.formatMessage({
    id: 'referral.create.form.campaignNameRequired',
    defaultMessage: 'Campaign name is required',
  })
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
      if (!campaignName) {
        throw new Error(campaignNameRequiredText)
      } else if (!props.partyBasketId) {
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
          },
        },
      })

      console.log('res', data)

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

  return (
    <$AddReferralContainer>
      {createdReferrals?.length > 0 && (
        <$Vertical spacing={2}>
          {createdReferrals.map((ref: Referral) => {
            return (
              <$ReferralItemContainer key={ref.id}>
                <$Horizontal justifyContent="space-between">
                  <$span>{ref.campaignName}</$span>
                  <$span>{ref.slug}</$span>
                </$Horizontal>
              </$ReferralItemContainer>
            )
          })}
        </$Vertical>
      )}
      <$Vertical spacing={2}>
        <$Horizontal flexWrap={screen === 'mobile'} spacing={2}>
          <$InputMedium
            placeholder={nameYourReferralCampaign}
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            style={{
              borderRadius: '5px',
              background: COLORS.white,
              marginTop: '10px',
              marginBottom: '10px',
              boxSizing: 'border-box',
            }}
            width={screen === 'mobile' ? '100%' : '65%'}
          />

          <div style={{ margin: 'auto 0' }}>
            <$Button
              id="button-add-stream"
              screen={screen}
              onClick={handleButtonClick}
              backgroundColor={`${COLORS.trustBackground}`}
              backgroundColorHover={`${COLORS.trustBackground}`}
              color={COLORS.trustFontColor}
              style={{
                boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
                fontWeight: TYPOGRAPHY.fontWeight.regular,
                fontSize: TYPOGRAPHY.fontSize.large,
                whiteSpace: 'nowrap',
              }}
              disabled={loading}
            >
              <LoadingText loading={loading} text={createReferralText} color={COLORS.trustFontColor} />
            </$Button>
          </div>
        </$Horizontal>
        {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
      </$Vertical>
    </$AddReferralContainer>
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

export default CreatePartyBasketReferral
