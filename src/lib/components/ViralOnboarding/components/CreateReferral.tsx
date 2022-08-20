import { useMutation } from '@apollo/client'
import {
  CreateReferralResponse,
  CreateReferralResponseSuccess,
  MutationCreateReferralArgs,
} from 'lib/api/graphql/generated/types'
import AuthGuard from 'lib/components/AuthGuard'
import { CREATE_REFERRAL } from 'lib/components/Referral/CreatePartyBasketReferral/api.gql'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWords from 'lib/hooks/useWords'
import { useEffect } from 'react'
import { ErrorCard, LoadingCard } from './GenericCard'
import QRCode from './QRCode'
import { $SubHeading } from '../contants'
import { COLORS } from '@wormgraph/helpers'

interface CreateReferralProps {
  goBack: () => void
}
const CreateReferral = (props: CreateReferralProps) => {
  const words = useWords()
  const { referral, chosenPartyBasket } = useViralOnboarding()
  const [createReferral, { data, error, loading: loadingCreateReferral }] = useMutation<
    { createReferral: CreateReferralResponse },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL, {
    variables: {
      payload: {
        tournamentId: referral?.tournamentId || '',
        partyBasketId: chosenPartyBasket?.id || referral?.seedPartyBasketId
      },
    },
  })

  useEffect(() => {
    createReferral()
  }, [])

  if (loadingCreateReferral) {
    return <LoadingCard />
  } else if (error || !data || data?.createReferral?.__typename === 'ResponseError') {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const createdReferral = (data?.createReferral as CreateReferralResponseSuccess)?.referral

  return (
    <div>
      <$SubHeading
        style={{ padding: '0px 20px', position: 'absolute', color: `${COLORS.white}4f` }}
        onClick={() => props.goBack()}
      >
        👈 {words.back}
      </$SubHeading>
      <QRCode referral={createdReferral} />
    </div>
  )
}

const CreateReferralPage = (props: CreateReferralProps) => {
  return (
    <AuthGuard>
      <CreateReferral {...props} />
    </AuthGuard>
  )
}

export default CreateReferralPage
