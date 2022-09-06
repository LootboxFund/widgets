import {
  QueryReferralArgs,
  Referral,
  ReferralResponse,
  ReferralResponseSuccess,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import ViralOnboardingProvider from 'lib/hooks/useViralOnboarding'
import { useQuery, useMutation } from '@apollo/client'
import { ReactElement, useEffect, useState } from 'react'
import { extractURLState_ViralOnboardingPage } from './utils'
import { ReferralSlug } from 'lib/types'
import { GET_REFERRAL, ReferralFE, ReferralResponseFE } from './api.gql'
import useWords from 'lib/hooks/useWords'
import AcceptGift from './components/AcceptGift'
import ChooseLottery from './components/ChooseLottery'
import SelectLottery from './components/SelectLottery'
import OnboardingSignUp from './components/OnboardingSignUp'
import CompleteOnboarding from './components/CompleteOnboarding'
import GenericCard, { LoadingCard, ErrorCard } from './components/GenericCard'
import { initLogging } from 'lib/api/logrocket'
import { manifest } from 'manifest'
import { useAuth } from 'lib/hooks/useAuth'
import CreateReferral from './components/CreateReferral'
import AddEmail from './components/AddEmail'

interface ViralOnboardingProps {
  referralSlug: ReferralSlug
}
type ViralOnboardingRoute = 'accept-gift' | 'browse-lottery' | 'add-email' | 'sign-up' | 'success' | 'create-referral'
const ViralOnboarding = (props: ViralOnboardingProps) => {
  const { user } = useAuth()
  const [route, setRoute] = useState<ViralOnboardingRoute>('accept-gift')
  const { data, loading, error } = useQuery<{ referral: ReferralResponseFE | ResponseError }, QueryReferralArgs>(
    GET_REFERRAL,
    {
      variables: {
        slug: props.referralSlug,
      },
    }
  )
  const words = useWords()

  if (loading) {
    return <LoadingCard />
  } else if (error || !data) {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.referral?.__typename === 'ResponseError') {
    return <ErrorCard message={data?.referral?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const referral: ReferralFE = (data.referral as ReferralResponseFE).referral

  const renderRoute = (route: ViralOnboardingRoute): ReactElement => {
    switch (route) {
      case 'browse-lottery':
        return <ChooseLottery onNext={() => setRoute('add-email')} onBack={() => console.log('back')} />
      // case 'select-lottery':
      //   return <SelectLottery onNext={() => setRoute('sign-up')} onBack={() => console.log('back')} />
      case 'add-email':
        return <AddEmail onNext={() => setRoute('sign-up')} onBack={() => setRoute('browse-lottery')} />
      case 'sign-up':
        return (
          <OnboardingSignUp
            onNext={() => setRoute('success')}
            onBack={() => setRoute('accept-gift')}
            goToReferralCreation={() => setRoute('create-referral')}
          />
        )
      case 'create-referral':
        return <CreateReferral goBack={() => setRoute('accept-gift')} />
      case 'success':
        return (
          <CompleteOnboarding
            onNext={() => {
              // Send to public profile
              const url = `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
              // navigate to url
              window.location.href = url
            }}
            onBack={() => console.log('back')}
          />
        )
      case 'accept-gift':
      default:
        return <AcceptGift onNext={() => setRoute('browse-lottery')} onBack={() => console.log('back')} />
    }
  }

  return <ViralOnboardingProvider referral={referral}>{renderRoute(route)}</ViralOnboardingProvider>
}

const ViralOnboardingPage = () => {
  const [referralSlug, setReferralSlug] = useState<string | null>(null)

  useEffect(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_ViralOnboardingPage()
    setReferralSlug(INITIAL_URL_PARAMS.referralSlug)
  }, [])

  useEffect(() => {
    const load = async () => {
      initLogging()
    }
    load()
  }, [])

  if (!referralSlug) {
    return <LoadingCard />
  }

  return <ViralOnboarding referralSlug={referralSlug as ReferralSlug}></ViralOnboarding>
}

export default ViralOnboardingPage
