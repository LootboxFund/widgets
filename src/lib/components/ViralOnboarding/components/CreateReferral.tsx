import { useMutation } from '@apollo/client'
import { MutationCreateReferralArgs, ReferralType, ResponseError } from 'lib/api/graphql/generated/types'
import AuthGuard from 'lib/components/AuthGuard'
import { CREATE_REFERRAL, CreateReferralResponseFE } from 'lib/components/Referral/CreateLootboxReferral/api.gql'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWords from 'lib/hooks/useWords'
import { useEffect, useMemo } from 'react'
import { ErrorCard, LoadingCard } from './GenericCard'
import QRCode, { QRCodeReferral } from './QRCode'
import { $SubHeading } from '../contants'
import { COLORS } from '@wormgraph/helpers'

interface CreateReferralProps {
  goBack: () => void
}
const CreateReferral = (props: CreateReferralProps) => {
  const words = useWords()
  const { referral, chosenLootbox } = useViralOnboarding()
  const [createReferral, { data, error, loading: loadingCreateReferral }] = useMutation<
    { createReferral: CreateReferralResponseFE | ResponseError },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL, {
    variables: {
      payload: {
        tournamentId: referral?.tournamentId || '',
        lootboxID: chosenLootbox?.id || referral?.seedLootboxID,
        type: ReferralType.Viral,
      },
    },
  })

  useEffect(() => {
    createReferral()
  }, [])

  const createdReferral = useMemo(() => {
    return (data?.createReferral as CreateReferralResponseFE)?.referral
  }, [data?.createReferral])

  if (loadingCreateReferral) {
    return <LoadingCard />
  } else if (error || !data || data?.createReferral?.__typename === 'ResponseError') {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  return (
    <div>
      <$SubHeading
        style={{ padding: '0px 20px', position: 'absolute', color: `${COLORS.white}4f` }}
        onClick={() => props.goBack()}
      >
        👈 {words.back}
      </$SubHeading>
      <QRCode referral={createdReferral as unknown as QRCodeReferral} inline={false} />
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
