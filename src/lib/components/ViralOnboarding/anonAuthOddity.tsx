import { useLazyQuery, useMutation } from '@apollo/client'
import { ClaimID, LootboxID } from '@wormgraph/helpers'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { MutationCompleteClaimArgs, QueryCheckPhoneEnabledArgs } from 'lib/api/graphql/generated/types'
import { useAuth } from 'lib/hooks/useAuth'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import {
  CheckPhoneEnabledResponseFE,
  CHECK_PHONE_AUTH,
  CompleteClaimResponseSuccessFE,
  COMPLETE_CLAIM,
} from './api.gql'

export const useAnonUserOddity = () => {
  const { user, signInAnonymously, sendSignInEmailForViralOnboarding, sendSignInEmailAnon } = useAuth()
  const { ad, referral, claim, chosenLootbox, chosenPartyBasket } = useViralOnboarding()
  const [checkPhoneAuth] = useLazyQuery<CheckPhoneEnabledResponseFE, QueryCheckPhoneEnabledArgs>(CHECK_PHONE_AUTH)
  const [notificationClaims, setNotificationClaims] = useLocalStorage<string[]>('notification_claim', [])
  const [completeClaim, { loading: loadingMutation }] = useMutation<
    CompleteClaimResponseSuccessFE,
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)

  const completeClaimRequest = async (claimID: ClaimID, lootboxID: LootboxID) => {
    console.log('completing claim')
    if (!lootboxID) {
      console.error('no lootbox')
      throw new Error('No Lootbox Provided')
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

  const handleAnonUser = async (email: string) => {
    if (chosenLootbox && claim) {
      // No email sign in methods. So we check if email is associated to phone
      let isPhoneAuthEnabled = false
      try {
        console.log(`checking if phone auth already`)
        const { data } = await checkPhoneAuth({ variables: { email } })
        console.log(`checkPhoneAuth`, data)
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
      console.log(`phohne auth enabled? = ${isPhoneAuthEnabled}`)

      if (isPhoneAuthEnabled) {
        // Just get them to login via phone
        // setRoute('onboard-phone')
        return
      }

      console.log(`fetchcing sign in methods...`)
      // Fetch sign in methods...
      let emailSignInMethods: string[] = []
      try {
        emailSignInMethods = await fetchSignInMethodsForEmail(auth, email)
        console.log(`emailSignInMethods`, emailSignInMethods)
      } catch (err) {
        console.log('error fethcing sign in methods', err)
      }

      // See if user exists with given email. If so, send them a validation email to click
      if (emailSignInMethods.length > 0) {
        console.log(`sending sign in email`)
        // Sends a link to the email which will async confirm the claim on click
        await sendSignInEmailForViralOnboarding(email, claim.id, referral.slug, chosenLootbox.id)
        // setRoute('wait-for-auth')
        console.log(`check your meail`)
        return
      }

      console.log(`was anon case`)
      // Default is anonymous case
      await signInAnonymously(email)
      console.log(`signed in anon user`, user)
      console.log(`auth.currentUser.uid`, auth.currentUser?.uid)
      // console.log(`email`, email)
      await Promise.all([
        sendSignInEmailAnon(email, chosenLootbox.stampImage),
        completeClaimRequest(claim.id, chosenLootbox.id),
      ])
      console.log(`signed in anon wiht claim completed`)
    }
  }

  return {
    handleAnonUser,
  }
}
