import {
  MutationBulkCreateReferralArgs,
  ReferralType,
  ResponseError,
  BulkCreateReferralResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { BULK_CREATE_REFERRAL, BulkCreateReferralResponseFE } from './api.gql'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { $ErrorMessage, $span, $Vertical } from 'lib/components/Generics'
import useWindowSize from 'lib/hooks/useScreenSize'
import { COLORS, TYPOGRAPHY, PartyBasketID, TournamentID } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { $Link } from 'lib/components/Profile/common'

interface Props {
  partyBasketId?: PartyBasketID
  tournamentId: TournamentID
  qrcodeMargin?: string
}

const BulkCreatePartyBasketReferral = (props: Props) => {
  const { screen } = useWindowSize()
  const [bulkCreateReferral, { loading }] = useMutation<
    { bulkCreateReferral: BulkCreateReferralResponseFE | ResponseError },
    MutationBulkCreateReferralArgs
  >(BULK_CREATE_REFERRAL, {
    onCompleted: (data) => {
      if (data.bulkCreateReferral.__typename === 'BulkCreateReferralResponseSuccess') {
        setFiles([...files, data.bulkCreateReferral.csv])
      }
    },
  })
  const [files, setFiles] = useState<string[]>([])
  const [numReferrals, setNumReferrals] = useState<number>(0)
  const [campaignName, setCampaignName] = useState('')
  const [referrerId, setReferrerId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const intl = useIntl()
  const words = useWords()

  const tournamentRequiredText = intl.formatMessage({
    id: `referral.create.form.tournamentRequired`,
    defaultMessage: 'Tournament is required',
  })

  const handleButtonClick = async () => {
    setErrorMessage('')
    try {
      if (!props.tournamentId) {
        throw new Error(tournamentRequiredText)
      } else if (numReferrals === 0) {
        throw new Error('Must bulk mint more than 0')
      }

      const { data } = await bulkCreateReferral({
        variables: {
          payload: {
            campaignName,
            partyBasketId: props.partyBasketId,
            tournamentId: props.tournamentId,
            type: ReferralType.OneTime,
            numReferrals: numReferrals,
          },
        },
      })

      if (!data) {
        throw new Error(`${words.anErrorOccured}!`)
      } else if (data?.bulkCreateReferral?.__typename === 'ResponseError') {
        throw new Error(data?.bulkCreateReferral.error?.message || words.anErrorOccured)
      }

      const csv = (data.bulkCreateReferral as BulkCreateReferralResponseSuccess).csv

      setFiles([csv, ...files])
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message || words.anErrorOccured)
    }
  }

  return (
    <$Vertical spacing={4}>
      {files.length > 0 && (
        <$Vertical>
          {files.map((file, idx) => (
            <$span>
              👉{' '}
              <$Link href={file} key={`download-${idx}`} download style={{ fontStyle: 'italic' }}>
                {words.downloadCSVFile}
              </$Link>
            </$span>
          ))}
        </$Vertical>
      )}
      <$Vertical>
        <$span style={{ fontWeight: 'bold' }}>
          <FormattedMessage id="bulkReferral.campaignName.title" defaultMessage="Campaign Name" />
        </$span>
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
      </$Vertical>

      <$Vertical>
        <$span style={{ fontWeight: 'bold' }}>
          <FormattedMessage id="bulkReferral.referrer.title" defaultMessage="Referrer ID" />
        </$span>
        <input
          placeholder="User ID to attribute the referral to"
          value={referrerId}
          onChange={(e) => setReferrerId(e.target.value)}
          style={{
            margin: '5px 0px',
            height: '20px',
            backgroundColor: `rgba(0,0,0,0.05)`,
            padding: '15px',
            fontSize: '1rem',
            border: '0px solid white',
          }}
        ></input>
      </$Vertical>

      <$Vertical>
        <$span style={{ fontWeight: 'bold' }}>
          <FormattedMessage id="bulkReferral.numReferrals.title" defaultMessage="Number of Links to Generate" />
        </$span>
        <input
          placeholder="How many referral links do you want to generate?"
          value={numReferrals}
          type="number"
          onChange={(e) => setNumReferrals(e.target.valueAsNumber)}
          style={{
            margin: '5px 0px',
            height: '20px',
            backgroundColor: `rgba(0,0,0,0.05)`,
            padding: '15px',
            fontSize: '1rem',
            border: '0px solid white',
          }}
        ></input>
      </$Vertical>

      <div>
        <$Button
          screen={screen}
          color={COLORS.trustFontColor}
          backgroundColor={`${COLORS.trustBackground}`}
          onClick={handleButtonClick}
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
          }}
        >
          <LoadingText loading={loading} text={words.generateInviteLinkText} color={COLORS.white} />
        </$Button>
      </div>
      {errorMessage ? <$ErrorMessage style={{ paddingTop: '15px' }}>{errorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default BulkCreatePartyBasketReferral
