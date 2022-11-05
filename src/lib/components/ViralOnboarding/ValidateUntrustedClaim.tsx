import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { $Heading, $NextButton, $SubHeading, $SupressedParagraph, background3, handIconImg } from './contants'
import Spinner from 'lib/components/Generics/Spinner'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { ClaimID, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useAuthWords } from 'lib/components/Authentication/Shared/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import { auth } from 'lib/api/firebase/app'
import { manifest } from 'manifest'
import { COMPLETE_UNTRUSTED_CLAIM, CompleteUntrustedClaimResponseFE } from './api.gql'
import { useMutation } from '@apollo/client'
import { MutationCompleteUntrustedClaimArgs } from '../../api/graphql/generated/types'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'

type FirebaseAuthError = string
// https://firebase.google.com/docs/reference/js/v8/firebase.User#linkwithcredential
const ACCOUNT_ALREADY_EXISTS: FirebaseAuthError[] = [
  'auth/provider-already-linked',
  'auth/credential-already-in-use',
  'auth/email-already-in-use',
]

type Status = 'loading' | 'error' | 'pending' | 'complete'
const ValidateUntrustedClaim = () => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [status, setStatus] = useState<Status>('pending')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const authWords = useAuthWords()
  // No longer needed - stored in backend
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const hasRunInit = useRef(false)
  const { img: stampImage, claimID } = useMemo(() => {
    return extractURLState_ValidateUntrustedClaim()
  }, [])
  const [completeUntrustedClaim] = useMutation<CompleteUntrustedClaimResponseFE, MutationCompleteUntrustedClaimArgs>(
    COMPLETE_UNTRUSTED_CLAIM
  )

  useEffect(() => {
    handleAuthenticate()
  }, [])

  const handleAuthenticate = () => {
    if (!claimID) {
      // throw new Error('No Claim Found')
      setErrorMessage('No Claim Found 🤕')
      setStatus('error')
      return
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let emailToUse = emailForSignup

      if (!emailToUse) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        emailToUse = window.prompt('Please provide your email for confirmation') || ''
      }
      // The client SDK will parse the code from the link for you.
      setStatus('loading')
      signInWithEmailLink(auth, emailToUse, window.location.href)
        .then((result) => {
          // Clear email from storage.
          setEmailForSignup('')
          setStatus('complete')

          return completeUntrustedClaim({
            variables: {
              payload: {
                claimId: claimID,
              },
            },
          })
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .then((result) => {
          console.log('claim completed!', result)
          return result
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          setErrorMessage(error?.message || 'An error occured')
          setStatus('error')
        })
    }
  }

  return (
    <$ViralOnboardingCard background={background3} opacity={['0.7', '0.55']}>
      <$ViralOnboardingSafeArea>
        {status === 'pending' && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Icon>{'📧'}</$Icon>
            <$Heading
              style={{
                textTransform: 'none',
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                lineHeight: TYPOGRAPHY.fontSize.xxlarge,
              }}
            >
              Check your email for a magic link
            </$Heading>
            {emailForSignup && (
              <$SubHeading style={{ marginTop: '0px' }}>
                Sent to {emailForSignup}. <b style={{ fontStyle: 'italic' }}>Check your spam folder.</b>
              </$SubHeading>
            )}
          </$Vertical>
        )}
        {status === 'loading' && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Heading
              style={{
                textTransform: 'none',
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                lineHeight: TYPOGRAPHY.fontSize.xxlarge,
              }}
            >
              Authenticating...
            </$Heading>
            <Spinner color={`${COLORS.white}`} size="50px" margin="5vh auto" />
          </$Vertical>
        )}
        {status === 'error' && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Icon>{'🤕'}</$Icon>
            <$Heading
              style={{
                textTransform: 'none',
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                lineHeight: TYPOGRAPHY.fontSize.xxlarge,
              }}
            >
              {words.anErrorOccured}
            </$Heading>
            {errorMessage ? (
              <$SubHeading style={{ marginTop: '0px' }}>{parseAuthError(errorMessage)}</$SubHeading>
            ) : null}

            <$SubHeading
              onClick={handleAuthenticate}
              style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}
            >
              {words.retry + '?'}
            </$SubHeading>
          </$Vertical>
        )}
        {status === 'complete' && (
          <$Vertical style={{ marginTop: '5vh' }}>
            <$Icon>{'🎉'}</$Icon>
            <$Heading>Success</$Heading>
            <a
              href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id || ''}`}
              style={{ textDecoration: 'none' }}
            >
              <$NextButton
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
                style={{ width: '100%' }}
              >
                Go to Profile
              </$NextButton>
            </a>
          </$Vertical>
        )}
        {!!stampImage ? <$PartyBasketImage src={stampImage} /> : <$HandImage src={handIconImg} />}
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const parseAuthError = (message: string) => {
  // Tries to turn errors from https://firebase.google.com/docs/reference/js/auth#autherrorcodes into something more readable
  // First remove "Firebase: "
  message = message.replace(/^Firebase: /, '')

  if (ACCOUNT_ALREADY_EXISTS.some((code) => message.indexOf(code) > -1)) {
    return 'This account already exists. Please log in or use a different email address / phone number.'
  } else {
    const parsedMessage = message.replace(/auth\//, '')
    // This won't be localized. Displays the error message as-is from firebase.
    return parsedMessage
  }
}

interface URLState {
  img: string | null
  claimID: ClaimID | null
}
const extractURLState_ValidateUntrustedClaim = () => {
  const url = new URL(window.location.href)

  const state: URLState = {
    img: url.searchParams.get('img'),
    claimID: url.searchParams.get('c') as ClaimID | null,
  }

  return state
}

const $InputMedium = styled.input`
  background-color: ${`${COLORS.white}`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

const $HandImage = styled.img`
  margin: auto 0 -3.5rem;
`

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

const $PartyBasketImage = styled.img` 
  margin: auto auto -3.5rem;
  max-width: 220px;
  width: 100%;
}
`

export default ValidateUntrustedClaim
