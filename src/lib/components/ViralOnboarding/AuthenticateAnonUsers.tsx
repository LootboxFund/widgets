import useWords from 'lib/hooks/useWords'
import { $Horizontal, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage, useIntl } from 'react-intl'
import { $Heading, $NextButton, $SubHeading, $SupressedParagraph, background3, handIconImg } from './contants'
import Spinner from 'lib/components/Generics/Spinner'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import LogRocket from 'logrocket'
import { LoadingText } from 'lib/components/Generics/Spinner'
import {
  browserLocalPersistence,
  EmailAuthCredential,
  EmailAuthProvider,
  isSignInWithEmailLink,
  setPersistence,
  signInWithCustomToken,
} from 'firebase/auth'
import CountrySelect from 'lib/components/CountrySelect'
import { useAuthWords } from 'lib/components/Authentication/Shared/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Link } from 'lib/components/Profile/common'
import { TOS_URL } from 'lib/hooks/constants'
import { auth } from 'lib/api/firebase/app'
import { manifest } from 'manifest'
import {
  GetAnonTokenResponseSuccessFE,
  GET_ANON_TOKEN,
  SyncProviderUserResponseFE,
  SYNC_PROVIDER_USER,
} from './api.gql'
import { useMutation, useQuery } from '@apollo/client'
import { QueryGetAnonTokenArgs, ResponseError } from '../../api/graphql/generated/types'

type FirebaseAuthError = string
// https://firebase.google.com/docs/reference/js/v8/firebase.User#linkwithcredential
const ACCOUNT_ALREADY_EXISTS: FirebaseAuthError[] = [
  'auth/provider-already-linked',
  'auth/credential-already-in-use',
  'auth/email-already-in-use',
]

type Status = 'loading' | 'error' | 'pending' | 'confirm_phone' | 'verification_sent' | 'complete'
const AuthenticateAnonUsers = () => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [status, setStatus] = useState<Status>('pending')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneCode, setPhoneCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const { user, sendPhoneVerification, linkCredentials, getPhoneAuthCredentialFromCode } = useAuth()
  const captchaRef = createRef<HTMLDivElement>()
  const targetRoute = useRef<Status>('pending')
  const authWords = useAuthWords()
  // No longer needed - stored in backend
  // const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const hasRunInit = useRef(false)
  const { idToken } = useMemo(() => {
    return extractURLState_AuthenticateAnonUsers()
  }, [])
  const runonce = useRef(false)
  const [syncUserMutation] = useMutation<SyncProviderUserResponseFE>(SYNC_PROVIDER_USER)

  useEffect(() => {
    if (user && user.isEmailVerified && !isSignInWithEmailLink(auth, window.location.href) && !runonce.current) {
      setStatus('confirm_phone')
      runonce.current = true
    }
  }, [user, status])

  const { data } = useQuery<GetAnonTokenResponseSuccessFE | { getAnonToken: ResponseError }, QueryGetAnonTokenArgs>(
    GET_ANON_TOKEN,
    {
      variables: { idToken: idToken || '' },
      skip: !idToken || hasRunInit.current || !isSignInWithEmailLink(auth, window.location.href),
      onCompleted: async (data) => {
        console.log('data', data)
        if (data.getAnonToken.__typename === 'GetAnonTokenResponseSuccess') {
          hasRunInit.current = true // make sure dosent run twice

          const { token, email } = data.getAnonToken
          // Make sure the credentials are valid from the email link
          let credential: EmailAuthCredential
          try {
            console.log('generating credentials')
            credential = EmailAuthProvider.credentialWithLink(email, window.location.href)
          } catch (err) {
            console.log('error generating credentials', err)
            return
          }
          console.log('siginin with custom token')
          try {
            await auth.signOut()
            console.log('signing in to anon account....')
            await signInWithCustomToken(auth, token)
            console.log('successfully signed into anon account')
          } catch (err) {
            console.error('error signing in', err)
            return
          }

          try {
            // link user credentials...
            console.log('linking credentials')
            await linkCredentials(credential)
            await syncUserMutation()
            console.log('done linking')
            setStatus('confirm_phone')
          } catch (err) {
            console.log('error linking credentials', err)
            console.log(err?.code, err?.message)
            if (ACCOUNT_ALREADY_EXISTS.includes(err?.code)) {
              // show error if user with email exists
              setStatus('error')
              setErrorMessage(err?.message || words.anErrorOccured)
            } else {
              setStatus('pending')
            }
          }
        }
      },
    }
  )

  const email = data?.getAnonToken?.__typename === 'GetAnonTokenResponseSuccess' ? data.getAnonToken.email : null
  const parsedPhone = `${phoneCode ? `+${phoneCode}` : ''}${phoneNumber}`

  useEffect(() => {
    if (status === 'confirm_phone' || status === 'verification_sent') {
      targetRoute.current = 'confirm_phone'
    }

    let el: HTMLElement | null = null
    if (status === 'verification_sent') {
      el = document.getElementById('verification-input')
    } else if (status === 'confirm_phone') {
      el = document.getElementById('sms-verf')
    }
    if (el) {
      el.focus()
    }
  }, [status])

  const handleCodeSubmit = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      setPersistence(auth, browserLocalPersistence)
      console.log('fetching phone credentials...')
      const credential = getPhoneAuthCredentialFromCode(confirmationCode)
      console.log('linking credentials...')
      const userObject = await linkCredentials(credential)
      await syncUserMutation()
      // Good work... send them on their merry way
      console.log('done onboarding!!!')
      setStatus('complete')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationRequest = async () => {
    if (loading) {
      return
    }
    setErrorMessage('')
    setLoading(true)
    try {
      await sendPhoneVerification(parsedPhone)
      setStatus('verification_sent')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const renderTOS = () => {
    return (
      <$SupressedParagraph
        style={{
          fontSize: TYPOGRAPHY.fontSize.small,
          marginTop: '40px',
          lineHeight: TYPOGRAPHY.fontSize.medium,
          width: screen === 'mobile' ? '100%' : '80%',
          textAlign: 'start',
        }}
      >
        *
        {authWords.signupWithPhoneTerms(
          <$Link href={TOS_URL} target="_blank">
            {authWords.termsOfService}
          </$Link>
        )}
      </$SupressedParagraph>
    )
  }

  const reset = () => {
    if (targetRoute) {
      setStatus(targetRoute.current)
    } else {
      setStatus('pending')
    }
  }

  return (
    <$ViralOnboardingCard background={background3} opacity={['0.7', '0.55']}>
      <$ViralOnboardingSafeArea>
        {/* {status === 'pending' && !emailForSignup && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Heading2 style={{ textAlign: 'start', marginTop: '50px' }}>{words.enterYourEmail}</$Heading2>
            <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>
              This should be the same email as before
            </$SubHeading>
            <$Vertical spacing={3}>
              <$InputMedium
                type="email"
                name="email"
                placeholder={words.email}
                value={email}
                onChange={(e) => setEmailLocal(e.target.value)}
                onKeyUp={(event) => {
                  if (event.key == 'Enter') {
                    submitEmail()
                  }
                }}
              />

              <$NextButton
                disabled={loading}
                onClick={submitEmail}
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
              >
                <LoadingText loading={loading} text="Submit" color={COLORS.white}></LoadingText>
              </$NextButton>
              {errorMessage ? <$SubHeading style={{ marginTop: '0px' }}>{errorMessage}</$SubHeading> : null}
            </$Vertical>
            <$SupressedParagraph
              style={{
                fontSize: TYPOGRAPHY.fontSize.small,
                lineHeight: TYPOGRAPHY.fontSize.medium,
                marginTop: '40px',
                width: screen === 'mobile' ? '100%' : '80%',
                textAlign: 'start',
              }}
            >
              <FormattedMessage
                id="viralOnboarding.signup.email.disclaimer"
                defaultMessage="You will NOT receiving marketing emails, we only notify if you win"
                description="Disclaimer when collecting email"
              />
            </$SupressedParagraph>
            <$HandImage src={handIconImg} />
          </$Vertical>
        )} */}
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
            {email && (
              <$SubHeading style={{ marginTop: '0px' }}>
                Sent to {email}. <b style={{ fontStyle: 'italic' }}>Check your spam folder.</b> Can't find it?{' '}
                <$Link href={'#'} target="_blank">
                  resend
                </$Link>
              </$SubHeading>
            )}
            {/* <$SubHeading style={{ marginTop: '0px' }}>
              Check your spam folder. Can't find it?{' '}
              <$Link href={TOS_URL} target="_blank">
                resend
              </$Link>
            </$SubHeading> */}
          </$Vertical>
        )}
        {status === 'loading' && <Spinner color={`${COLORS.white}`} size="50px" margin="10vh auto" />}
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

            <$SubHeading onClick={reset} style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}>
              {words.retry + '?'}
            </$SubHeading>
          </$Vertical>
        )}

        {status === 'confirm_phone' && (
          <$Vertical height="100%" style={{ marginTop: '5vh' }}>
            <$Icon>{'🚀'}</$Icon>
            <$Heading style={{ textAlign: 'start' }}>
              <FormattedMessage id="viralOnboarding.signup.header" defaultMessage="Almost Finished..." />
            </$Heading>
            <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>{words.verifyYourPhoneNumber}*</$SubHeading>
            <$Vertical spacing={3}>
              <$Horizontal>
                <CountrySelect onChange={setPhoneCode} backgroundColor="#ffffff" />
                <$InputMedium
                  id="sms-verf"
                  type="tel"
                  name="phone"
                  placeholder="123-456-7890"
                  value={phoneNumber}
                  // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  // required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    borderRadius: '0px 10px 10px 0px',
                    borderLeft: `${COLORS.surpressedBackground}ae 1px solid`,
                    width: '100%',
                  }}
                  onKeyUp={(event) => {
                    if (event.key == 'Enter') {
                      handleVerificationRequest()
                    }
                  }}
                />
              </$Horizontal>
              <$NextButton
                onClick={handleVerificationRequest}
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
                style={{ width: '100%' }}
              >
                <LoadingText loading={loading} text={words.sendCode} color={COLORS.white} />
              </$NextButton>
            </$Vertical>
            {renderTOS()}
            <$HandImage src={handIconImg} />
          </$Vertical>
        )}
        {status === 'verification_sent' && (
          <$Vertical style={{ marginTop: '5vh' }}>
            <$SubHeading style={{ textAlign: 'start' }}>
              {words.codeSentToFn(parsedPhone)}{' '}
              <$SubHeading
                onClick={reset}
                style={{ display: 'inline', textTransform: 'lowercase', fontStyle: 'italic', cursor: 'pointer' }}
              >
                [{words.edit}]
              </$SubHeading>
            </$SubHeading>
            <$Vertical spacing={3}>
              <$InputMedium
                id="verification-input"
                placeholder={words.verificationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                type="number"
                onKeyUp={(event) => {
                  if (event.key == 'Enter') {
                    handleCodeSubmit()
                  }
                }}
              />
              <$NextButton
                onClick={handleCodeSubmit}
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
                style={{ width: '100%' }}
                disabled={loading}
              >
                <LoadingText loading={loading} text={words.confirm} color={COLORS.white} />
              </$NextButton>
            </$Vertical>
            {renderTOS()}
          </$Vertical>
        )}
        {status === 'complete' && (
          <$Vertical style={{ marginTop: '5vh' }}>
            <$Icon>{'🎉'}</$Icon>
            <$Heading>Your account is ready</$Heading>
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
        <div id="recaptcha-container" ref={captchaRef} />
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
  idToken: string | null
  // uid: string | null
}
const extractURLState_AuthenticateAnonUsers = () => {
  const url = new URL(window.location.href)

  const state: URLState = {
    idToken: url.searchParams.get('t'),
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

export default AuthenticateAnonUsers
