import ViralOnboardingProvider, { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { ReactElement, useEffect, useState } from 'react'
import { extractURLState_ViralOnboardingPage } from './utils'
import { ReferralSlug } from 'lib/types'
import AcceptGift from './components/AcceptGift'
import ChooseLottery from './components/ChooseLottery'
// import SelectLottery from './components/SelectLottery'
import OnboardingSignUp from './components/OnboardingSignUp'
import CompleteOnboarding from './components/CompleteOnboarding'
import { LoadingCard, ErrorCard } from './components/GenericCard'
import { initLogging } from 'lib/api/logrocket'
import { manifest } from 'manifest'
import { useAuth } from 'lib/hooks/useAuth'
import CreateReferral from './components/CreateReferral'
import AddEmail from './components/AddEmail'
import AdTemplate1 from './components/AdTemplate1'

interface ViralOnboardingProps {}
type ViralOnboardingRoute = 'accept-gift' | 'browse-lottery' | 'add-email' | 'sign-up' | 'success' | 'create-referral'
const ViralOnboarding = (props: ViralOnboardingProps) => {
  const { user } = useAuth()
  const { ad } = useViralOnboarding()
  const [route, setRoute] = useState<ViralOnboardingRoute>('accept-gift')
  const renderRoute = (route: ViralOnboardingRoute): ReactElement => {
    switch (route) {
      case 'browse-lottery':
        return <ChooseLottery onNext={() => setRoute('success')} onBack={() => console.log('back')} />
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
      case 'success': {
        if (!!ad) {
          switch (ad.adType) {
            case 'template_1':
            default: {
              return (
                <AdTemplate1
                  onNext={() => {
                    // // Send to public profile
                    // const url = `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
                    // // navigate to url
                    // window.location.href = url
                  }}
                  onBack={() => console.log('back')}
                />
              )
            }
          }
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
    return <LoadingCard />
  }

  return (
    <ViralOnboardingProvider referralSlug={referralSlug as ReferralSlug}>
      <ViralOnboarding />
    </ViralOnboardingProvider>
  )
}

export default ViralOnboardingPage
