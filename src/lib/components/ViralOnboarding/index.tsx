import ViralOnboardingProvider, { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { ReactElement, useEffect, useState } from 'react'
import { extractURLState_ViralOnboardingPage } from './utils'
import { ReferralSlug } from '@wormgraph/helpers'
import AcceptGift from './components/AcceptGift'
import ChooseLotteryPartyBasket from './components/ChooseLotteryPartyBasket'
import ChooseLottery from './components/ChooseLottery'
import OnboardingSignUp from './components/OnboardingSignUp'
import CompleteOnboarding from './components/CompleteOnboarding'
import { EnterCodeCard } from './components/GenericCard'
import { initLogging } from 'lib/api/logrocket'
import { manifest } from 'manifest'
import { useAuth } from 'lib/hooks/useAuth'
import CreateReferral from './components/CreateReferral'
import AddEmail from './components/AddEmail'
import AdVideoBeta2 from './components/AdVideoBeta2'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  MutationCompleteClaimArgs,
  MutationPendingClaimToUntrustedArgs,
  QueryCheckPhoneEnabledArgs,
} from 'lib/api/graphql/generated/types'
import {
  CompleteClaimResponseSuccessFE,
  COMPLETE_CLAIM,
  PendingToUntrustedClaimResponseFE,
  PENDING_TO_UNTRUSTED_CLAIM,
  CheckPhoneEnabledResponseFE,
  CHECK_PHONE_AUTH,
} from './api.gql'
import useWords from 'lib/hooks/useWords'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'

interface ViralOnboardingProps {}
type ViralOnboardingRoute =
  | 'accept-gift'
  | 'browse-lottery'
  | 'sign-up-anon'
  | 'add-email'
  | 'onboard-phone'
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
    CompleteClaimResponseSuccessFE,
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)

  const [pendingToUntrustedClaim, { loading: loadingPendingToUntrusted }] = useMutation<
    PendingToUntrustedClaimResponseFE,
    MutationPendingClaimToUntrustedArgs
  >(PENDING_TO_UNTRUSTED_CLAIM)

  const [checkPhoneAuth] = useLazyQuery<CheckPhoneEnabledResponseFE, QueryCheckPhoneEnabledArgs>(CHECK_PHONE_AUTH)

  const handleTransitionClaimToUntrusted = async (email: string) => {
    if (!claim?.id) {
      console.error('no claim')
      throw new Error(words.anErrorOccured)
    }

    if (!chosenLootbox) {
      console.error('no lootbox')
      throw new Error(words.anErrorOccured)
    }

    const { data } = await pendingToUntrustedClaim({
      variables: {
        payload: {
          chosenLootboxID: chosenLootbox.id,
          claimId: claim.id,
          targetUserEmail: email,
        },
      },
    })

    if (!data || data?.pendingClaimToUntrusted?.__typename === 'ResponseError') {
      // @ts-ignore
      throw new Error(data?.pendingClaimToUntrusted?.error?.message || words.anErrorOccured)
    }

    return
  }

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
      if (data?.completeClaim?.claim?.id) {
        setNotificationClaims([...notificationClaims, data.completeClaim.claim.id])
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
            return (
              <ChooseLottery
                onNext={async () => {
                  if (user) {
                    // user already logged in - complete claim & move on automatically
                    console.log('user already logged in... completing claim...')
                    await completeClaimRequest()
                    setRoute('success')
                  } else {
                    setRoute('sign-up-anon')
                  }
                }}
                onBack={() => console.log('back')}
              />
            )
        }
      case 'sign-up-anon':
        return (
          <AddEmail
            onNext={async (email) => {
              // if user is already logged in, complete claim & move on automatically
              if (user) {
                console.log('user already logged in... completing claim...')
                await completeClaimRequest()
                setRoute('success')
                return
              }

              setEmailForSignup(email)

              // Fetch sign in methods...
              let emailSignInMethods: string[] = []
              try {
                emailSignInMethods = await fetchSignInMethodsForEmail(auth, email)
              } catch (err) {
                console.log('error fethcing sign in methods', err)
              }

              // See if user exists with given email. If so, create an "untrusted" claim and move on
              if (emailSignInMethods.length > 0) {
                // Sends a link to the email which will async confirm the claim on click
                // this creates an 'untrusted' claim
                await handleTransitionClaimToUntrusted(email)
                // TODO: SEND SIGN IN EMAIL
                throw new Error('TODO: SEND SIGN IN EMAIL')

                return
              }

              // No email sign in methods. So we check if email is associated to phone
              let isPhoneAuthEnabled = false
              try {
                const { data } = await checkPhoneAuth({ variables: { email } })
                if (!data || data.checkPhoneEnabled.__typename === 'ResponseError') {
                  throw new Error('error checking phone auth')
                }
                isPhoneAuthEnabled =
                  data?.checkPhoneEnabled?.__typename === 'CheckPhoneEnabledResponseSuccess'
                    ? data.checkPhoneEnabled.isEnabled
                    : false
              } catch (err) {
                console.error(err)
                isPhoneAuthEnabled = false
              }

              if (isPhoneAuthEnabled) {
                // Just get them to login via phone
                setRoute('onboard-phone')
                return
              }

              // Default is anonymous case
              await signInAnonymously(email)
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
              setRoute('onboard-phone')
              return
            }}
            onBack={() => setRoute('browse-lottery')}
          />
        )
      case 'onboard-phone':
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
