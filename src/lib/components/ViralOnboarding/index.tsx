import ViralOnboardingProvider, { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { ReactElement, useEffect, useState } from 'react'
import { extractURLState_ViralOnboardingPage } from './utils'
import { ReferralSlug } from '@wormgraph/helpers'
import AcceptGift from './components/AcceptGift'
import ChooseLotteryPartyBasket from './components/ChooseLotteryPartyBasket'
import ChooseLottery from './components/ChooseLottery'
import OnboardingSignUp from './components/OnboardingSignUp'
import CompleteOnboarding from './components/CompleteOnboarding'
import { LoadingCard, ErrorCard, EnterCodeCard } from './components/GenericCard'
import { initLogging } from 'lib/api/logrocket'
import { manifest } from 'manifest'
import { useAuth } from 'lib/hooks/useAuth'
import CreateReferral from './components/CreateReferral'
import AddEmail from './components/AddEmail'
import AdVideoBeta2 from './components/AdVideoBeta2'

interface ViralOnboardingProps {}
type ViralOnboardingRoute = 'accept-gift' | 'browse-lottery' | 'add-email' | 'sign-up' | 'success' | 'create-referral'
const ViralOnboarding = (props: ViralOnboardingProps) => {
  const { user } = useAuth()
  const { ad, referral } = useViralOnboarding()
  const [route, setRoute] = useState<ViralOnboardingRoute>('accept-gift')
  const renderRoute = (route: ViralOnboardingRoute): ReactElement => {
    switch (route) {
      case 'browse-lottery':
        switch (referral.tournament.isPostCosmic) {
          case false:
          case undefined:
          case null:
            // DEPRECATED party baskets
            return <ChooseLotteryPartyBasket onNext={() => setRoute('add-email')} onBack={() => console.log('back')} />
          case true:
          default:
            return <ChooseLottery onNext={() => setRoute('success')} onBack={() => console.log('back')} />
          // return <ChooseLottery onNext={() => setRoute('add-email')} onBack={() => console.log('back')} />
        }
      // case 'select-lottery':
      //   return <SelectLottery onNext={() => setRoute('sign-up')} onBack={() => console.log('back')} />
      case 'add-email':
        return (
          <AddEmail
            onNext={() => {
              setRoute('sign-up')
            }}
            onBack={() => setRoute('browse-lottery')}
          />
        )
      case 'sign-up':
        return (
          <OnboardingSignUp
            onNext={() => setRoute('success')}
            onBack={() => setRoute('browse-lottery')}
            goToReferralCreation={() => setRoute('create-referral')}
          />
        )
      case 'create-referral':
        return <CreateReferral goBack={() => setRoute('accept-gift')} />
      case 'success': {
        console.log(`----> ad`)
        console.log(ad)
        if (!!ad) {
          return (
            <AdVideoBeta2
              onNext={() => {
                // Send to public profile
                const url = `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
                // navigate to url
                window.location.href = url
              }}
              onBack={() => console.log('back')}
            />
          )
        } else {
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
        }
      }

      case 'accept-gift':
      default:
        return <AcceptGift onNext={() => setRoute('browse-lottery')} onBack={() => console.log('back')} />
    }
  }

  return renderRoute(route)
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
    return <EnterCodeCard />
  }

  return (
    <ViralOnboardingProvider referralSlug={referralSlug as ReferralSlug}>
      <ViralOnboarding />
    </ViralOnboardingProvider>
  )
}

export default ViralOnboardingPage
