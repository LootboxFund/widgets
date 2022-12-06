import ViralOnboardingProvider, { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { extractURLState_ViralOnboardingPage } from './utils'
import { ClaimID, LootboxID, ReferralSlug } from '@wormgraph/helpers'
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
import { useLazyQuery, useMutation } from '@apollo/client'
import { MutationCompleteClaimArgs, QueryCheckPhoneEnabledArgs } from 'lib/api/graphql/generated/types'
import {
  CompleteClaimResponseSuccessFE,
  COMPLETE_CLAIM,
  CheckPhoneEnabledResponseFE,
  CHECK_PHONE_AUTH,
} from './api.gql'
import useWords from 'lib/hooks/useWords'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { fetchSignInMethodsForEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import WaitForAuth from './components/WaitForAuth'
import { truncateEmail } from 'lib/utils/email'
import OnePager from './components/OnePager'

interface ViralOnboardingProps {}
type ViralOnboardingRoute =
  | 'one-pager'
  | 'accept-gift'
  | 'browse-lottery'
  | 'sign-up-anon'
  | 'add-email'
  | 'wait-for-auth'
  | 'onboard-phone'
  | 'success'
  | 'create-referral'
const ViralOnboarding = (props: ViralOnboardingProps) => {
  const { user, signInAnonymously, sendSignInEmailForViralOnboarding, sendSignInEmailAnon } = useAuth()

  const words = useWords()
  const { ad, referral, claim, chosenLootbox, chosenPartyBasket } = useViralOnboarding()
  const [route, setRoute] = useState<ViralOnboardingRoute>(
    isSignInWithEmailLink(auth, window.location.href) ? 'wait-for-auth' : 'one-pager'
  )
  const [notificationClaims, setNotificationClaims] = useLocalStorage<string[]>('notification_claim', [])
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const [completeClaim, { loading: loadingMutation }] = useMutation<
    CompleteClaimResponseSuccessFE,
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)

  const [checkPhoneAuth] = useLazyQuery<CheckPhoneEnabledResponseFE, QueryCheckPhoneEnabledArgs>(CHECK_PHONE_AUTH)

  const userRef = useRef()
  const chosenLootboxRef = useRef()
  const chosenEmailForSignupRef = useRef()
  // @ts-ignore
  userRef.current = user
  // @ts-ignore
  chosenLootboxRef.current = chosenLootbox
  // @ts-ignore
  chosenEmailForSignupRef.current = emailForSignup

  const completeClaimRequest = async (claimID: ClaimID, lootboxID: LootboxID) => {
    if (!lootboxID) {
      console.error('no lootbox')
      throw new Error(words.anErrorOccured)
    }

    const { data } = await completeClaim({
      variables: {
        payload: {
          claimId: claimID,
          chosenLootboxID: lootboxID,
          // DEPRECATED
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
  const onePagerNext = async (lootboxID: LootboxID, email: string) => {
    // @ts-ignore
    const user = userRef.current
    // @ts-ignore
    const chosenLootbox = chosenLootboxRef.current
    if (user && claim?.id) {
      // user already logged in - complete claim & move on automatically
      await completeClaimRequest(claim.id, lootboxID)

      setRoute('success')
    } else {
      if (!claim?.id) {
        throw new Error(words.anErrorOccured)
      }
      if (!chosenLootbox) {
        throw new Error(words.anErrorOccured)
      }

      // if user is already logged in, complete claim & move on automatically
      if (user) {
        // @ts-ignore
        await completeClaimRequest(claim.id, chosenLootbox.id)
        setRoute('success')
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

      // Fetch sign in methods...
      let emailSignInMethods: string[] = []
      try {
        emailSignInMethods = await fetchSignInMethodsForEmail(auth, email)
      } catch (err) {
        console.log('error fethcing sign in methods', err)
      }

      // See if user exists with given email. If so, send them a validation email to click
      if (emailSignInMethods.length > 0) {
        console.log(`sending sign in email`)
        // Sends a link to the email which will async confirm the claim on click
        await sendSignInEmailForViralOnboarding(
          email,
          claim.id,
          referral.slug,
          // @ts-ignore
          chosenLootbox.id
        )
        setRoute('wait-for-auth')
        return
      }

      // Default is anonymous case
      await signInAnonymously(email)
      await Promise.all([
        sendSignInEmailAnon(
          email,
          // @ts-ignore
          chosenLootbox.stampImage
        ),
        completeClaimRequest(
          claim.id,
          // @ts-ignore
          chosenLootbox.id
        ),
      ])
      setRoute('success')
      return
    }
  }

  const renderRoute = (route: ViralOnboardingRoute): ReactElement => {
    switch (route) {
      case 'one-pager':
        return <OnePager onNext={onePagerNext} onBack={() => console.log('back')} />
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
                onNext={async (lootboxID: LootboxID) => {
                  if (user && claim?.id) {
                    // user already logged in - complete claim & move on automatically

                    await completeClaimRequest(claim.id, lootboxID)
                    setRoute('success')
                  } else {
                    setRoute('sign-up-anon')
                  }
                }}
                onBack={() => console.log('back')}
              />
            )
          // uncomment me for dev without auth
          // return <ChooseLottery onNext={() => setRoute('success')} onBack={() => console.log('back')} />
        }
      case 'sign-up-anon':
        return (
          <AddEmail
            onNext={async (email) => {
              if (!claim?.id) {
                console.error('no claim')
                throw new Error(words.anErrorOccured)
              }
              if (!chosenLootbox) {
                console.error('no lootbox')
                throw new Error(words.anErrorOccured)
              }
              setEmailForSignup(email)

              // if user is already logged in, complete claim & move on automatically
              if (user) {
                await completeClaimRequest(claim.id, chosenLootbox.id)
                setRoute('success')
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

              // Fetch sign in methods...
              let emailSignInMethods: string[] = []
              try {
                emailSignInMethods = await fetchSignInMethodsForEmail(auth, email)
              } catch (err) {
                console.log('error fethcing sign in methods', err)
              }

              // See if user exists with given email. If so, send them a validation email to click
              if (emailSignInMethods.length > 0) {
                // Sends a link to the email which will async confirm the claim on click
                await sendSignInEmailForViralOnboarding(email, claim.id, referral.slug, chosenLootbox.id)
                setRoute('wait-for-auth')
                return
              }

              // Default is anonymous case
              await signInAnonymously(email)
              await Promise.all([
                sendSignInEmailAnon(email, chosenLootbox.stampImage),
                completeClaimRequest(claim.id, chosenLootbox.id),
              ])
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
      case 'wait-for-auth':
        return (
          <WaitForAuth
            onNext={async (claimID: ClaimID, lootboxID: LootboxID) => {
              if (!claimID) {
                console.error('no claim')
                throw new Error(words.anErrorOccured)
              }
              if (!lootboxID) {
                console.error('no lootbox')
                throw new Error(words.anErrorOccured)
              }
              await completeClaimRequest(claimID, lootboxID)
              setRoute('success')
              return
            }}
            onRestart={() => setRoute('accept-gift')}
            onBack={() => setRoute('browse-lottery')}
          />
        )
      case 'success': {
        const emailForSignup = localStorage.getItem('emailForSignup')

        const nextUrl = user?.isAnonymous
          ? `${manifest.microfrontends.webflow.anonSignup}?uid=${user?.id}${
              emailForSignup ? `&e=${truncateEmail(emailForSignup)}` : ''
            }`
          : `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`
        if (!!ad) {
          return (
            <AdVideoBeta2
              onNext={() => {
                // Send to public profile
                // navigate to url
                window.location.href = nextUrl
              }}
              nextUrl={nextUrl}
              onBack={() => console.log('back')}
            />
          )
        } else {
          return (
            <CompleteOnboarding
              onNext={() => {
                // Send to public profile
                // navigate to url
                window.location.href = nextUrl
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
  const referralSlug = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_ViralOnboardingPage()
    return INITIAL_URL_PARAMS.referralSlug
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
