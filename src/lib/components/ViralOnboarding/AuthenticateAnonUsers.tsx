import useWords from 'lib/hooks/useWords'
import { $Horizontal, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  $Heading,
  $Heading2,
  $NextButton,
  $SubHeading,
  $SupressedParagraph,
  background3,
  handIconImg,
} from './contants'
import Spinner from 'lib/components/Generics/Spinner'
import { createRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import LogRocket from 'logrocket'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { EmailAuthCredential, EmailAuthProvider } from 'firebase/auth'
import CountrySelect from 'lib/components/CountrySelect'
import { useAuthWords } from 'lib/components/Authentication/Shared/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Link } from 'lib/components/Profile/common'
import { TOS_URL } from 'lib/hooks/constants'
import { parseAuthError } from 'lib/utils/firebase'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { checkIfValidEmail } from 'lib/api/helpers'

// type Status = 'error' | 'pending' | 'verification_sent' | 'initializing'
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
  const { user, sendPhoneVerification, signInPhoneWithCode, linkCredentials, signInAnonymously } = useAuth()
  const captchaRef = createRef<HTMLDivElement>()
  const intl = useIntl()
  const authWords = useAuthWords()
  const [email, setEmailLocal] = useState('')
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')

  const parsedPhone = `${phoneCode ? `+${phoneCode}` : ''}${phoneNumber}`

  console.log('user object', user)

  useEffect(() => {
    if (status === 'verification_sent') {
      const el = document.getElementById('verification-input')
      if (el) {
        el.focus()
      }
    }
  }, [status])

  useEffect(() => {
    if (!emailForSignup) {
      console.log('no email to signup')
      return
    }

    console.log('email from loc', emailForSignup)

    let credential: EmailAuthCredential
    try {
      credential = EmailAuthProvider.credentialWithLink(emailForSignup, window.location.href)
      console.log('credential', credential)
      // Link user email credentials
    } catch (err) {
      console.log('error linking credentials', err)
      //   setStatus('error')
      //   setErrorMessage(err?.message || words.anErrorOccured)
      return
    }

    setStatus('loading')
    linkCredentials(credential)
      .then(() => {
        console.log('done linking credential')
        setStatus('confirm_phone')
      })
      .catch((e) => {
        console.log('error linking credentials', e)
        setStatus('error')
        setErrorMessage(e?.message || words.anErrorOccured)
      })
  }, [])

  useEffect(() => {
    const focusEl = document.getElementById('sms-verf')
    if (focusEl) {
      focusEl.focus()
    }
  }, [])

  const handleCodeSubmit = async () => {
    console.log('code submit [NOT IMPLEMENTED]')
    // if (loading) {
    //   return
    // }
    // setLoading(true)
    // setErrorMessage('')
    // try {
    //   setPersistence(auth, browserLocalPersistence)
    //   await signInPhoneWithCode(confirmationCode, email)
    // } catch (err) {
    //   setStatus('error')
    //   setErrorMessage(err?.message || words.anErrorOccured)
    //   LogRocket.captureException(err)
    // } finally {
    //   setLoading(false)
    // }
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
    setStatus('pending')
  }

  const submitEmail = () => {
    const isValid = checkIfValidEmail(email)
    if (!isValid) {
      setStatus('error')
      setErrorMessage(words.invalidEmail)
      return
    }
    if (!email) {
      setStatus('error')
      setErrorMessage(words.enterYourEmail)
      return
    }
    setStatus('loading')
    signInAnonymously(email)
      .then(() => {
        setStatus('pending')
        setEmailForSignup(email)
      })
      .catch((e) => {
        setStatus('error')
        setErrorMessage(e?.message || words.anErrorOccured)
      })
  }

  return (
    <$ViralOnboardingCard background={background3} opacity={['0.7', '0.55']}>
      <$ViralOnboardingSafeArea>
        {status === 'pending' && !emailForSignup && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Heading2 style={{ textAlign: 'start', marginTop: '50px' }}>{words.enterYourEmail}</$Heading2>
            <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>
              You'll receive a one-time validation email
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
                <LoadingText loading={loading} text="Get my Ticket" color={COLORS.white}></LoadingText>
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
        )}
        {status === 'pending' && emailForSignup && (
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
                Sent to {emailForSignup}. <b style={{ fontStyle: 'italic' }}>Check your spam folder.</b> Can't find it?{' '}
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
              <$SubHeading style={{ marginTop: '0px' }}>{parseAuthError(intl, errorMessage)}</$SubHeading>
            ) : null}

            <$SubHeading onClick={reset} style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}>
              {words.retry + '?'}
            </$SubHeading>
          </$Vertical>
        )}

        {status === 'confirm_phone' && (
          <$Vertical height="100%">
            <Spinner size="30px" color={`${COLORS.white}66`} />
            <$Heading2 style={{ textAlign: 'start' }}>
              <FormattedMessage id="viralOnboarding.signup.header" defaultMessage="Almost Finished..." />
            </$Heading2>
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
          <$Vertical>
            <br />
            <br />
            <br />
            <$SubHeading style={{ textAlign: 'start' }}>
              {/* <FormattedMessage
                id="viralOnboarding.verification.sentTo"
                defaultMessage="Sent to {userPhoneNumber}"
                description="Indicating a confirmation code was sent to a number"
                values={{
                  userPhoneNumber: (
                    <$SupressedParagraph style={{ display: 'inline' }}>{parsedPhone}</$SupressedParagraph>
                  ),
                }}
              />{' '} */}
              {words.codeSentToFn(
                parsedPhone
                // <$SupressedParagraph style={{ display: 'inline' }}>{parsedPhone}</$SupressedParagraph>
              )}{' '}
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
        <div id="recaptcha-container" ref={captchaRef} />
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
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
