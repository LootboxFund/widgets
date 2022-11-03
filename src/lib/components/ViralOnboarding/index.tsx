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
import { useMutation } from '@apollo/client'
import {
  CompleteClaimResponse,
  CompleteClaimResponseSuccess,
  MutationCompleteClaimArgs,
} from 'lib/api/graphql/generated/types'
import { COMPLETE_CLAIM } from './api.gql'
import useWords from 'lib/hooks/useWords'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'

interface ViralOnboardingProps {}
type ViralOnboardingRoute =
  | 'accept-gift'
  | 'browse-lottery'
  | 'sign-up-anon'
  | 'add-email'
  | 'sign-up'
  | 'success'
  | 'create-referral'
const ViralOnboarding = (props: ViralOnboardingProps) => {
  const { user, signInAnonymously } = useAuth()
  const words = useWords()
  const { ad, referral, claim, chosenLootbox, chosenPartyBasket } = useViralOnboarding()
  const [route, setRoute] = useState<ViralOnboardingRoute>('accept-gift')
  const [notificationClaims, setNotificationClaims] = useLocalStorage<string[]>('notification_claim', [])
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const [completeClaim, { loading: loadingMutation }] = useMutation<
    { completeClaim: CompleteClaimResponse },
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)

  const completeClaimRequest = async () => {
    if (!claim?.id) {
      console.error('no claim')
      throw new Error(words.anErrorOccured)
    }

    if (!chosenLootbox && !chosenPartyBasket) {
      console.error('no party basket')
      throw new Error(words.anErrorOccured)
    }

    const { data } = await completeClaim({
      variables: {
        payload: {
          claimId: claim.id,
          chosenLootboxID: chosenLootbox?.id,
          chosenPartyBasketId: chosenPartyBasket?.id,
        },
      },
    })

    if (!data || data?.completeClaim?.__typename === 'ResponseError') {
      // @ts-ignore
      throw new Error(data?.completeClaim?.error?.message || words.anErrorOccured)
    }

    // Add notification to local storage
    // this notification shows a notif on the user profile page

    try {
      if ((data?.completeClaim as CompleteClaimResponseSuccess)?.claim?.id) {
        setNotificationClaims([...notificationClaims, (data?.completeClaim as CompleteClaimResponseSuccess)?.claim?.id])
      }
    } catch (err) {
      console.error(err)
    }

    return
  }

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
            // return <ChooseLottery onNext={() => setRoute('add-email')} onBack={() => console.log('back')} />
            return <ChooseLottery onNext={() => setRoute('sign-up-anon')} onBack={() => console.log('back')} />
        }
      case 'sign-up-anon':
        return (
          <AddEmail
            onNext={async (email) => {
              setEmailForSignup(email || '')
              if (!user) {
                await signInAnonymously(email)
              }
              await completeClaimRequest()
              setRoute('success')

              return
            }}
            onBack={() => setRoute('browse-lottery')}
          />
        )
      // This one is not used anymore lol
      case 'add-email':
        return (
          <AddEmail
            onNext={async () => {
              setRoute('sign-up')
              return
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
        if (!!ad) {
          return (
            <AdVideoBeta2
              onNext={() => {
                // Send to public profile
                const url = user?.isAnonymous
                  ? `${manifest.microfrontends.webflow.anonSignup}?uid=${user?.id}`
                  : `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
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
                const url = user?.isAnonymous
                  ? `${manifest.microfrontends.webflow.anonSignup}?uid=${user?.id}`
                  : `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
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
