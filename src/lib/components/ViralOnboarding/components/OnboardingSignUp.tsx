import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage } from 'react-intl'
import {
  $Heading,
  $Heading2,
  $NextButton,
  $SubHeading,
  $SupressedParagraph,
  background1,
  handIconImg,
} from '../contants'
import Spinner from 'lib/components/Generics/Spinner'
import { createRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import LogRocket from 'logrocket'
import { ErrorCard } from './GenericCard'

interface Props {
  onNext: () => void
  onBack: () => void
}
type Status = 'error' | 'pending' | 'verification_sent' | 'complete'
const OnboardingSignUp = (props: Props) => {
  const words = useWords()
  const [status, setStatus] = useState<Status>('pending')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const { sendPhoneVerification, signInPhoneWithCode } = useAuth()
  const captchaRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (status === 'verification_sent') {
      const el = document.getElementById('verification-input')
      if (el) {
        el.focus()
      }
    }
  }, [status])

  const handleCodeSubmit = async () => {
    try {
      await signInPhoneWithCode(confirmationCode)
      setStatus('complete')
      props.onNext()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    }
  }

  useEffect(() => {
    const focusEl = document.getElementById('sms-verf')
    if (focusEl) {
      focusEl.focus()
    }
  }, [])

  const handleVerificationRequest = async () => {
    setErrorMessage('')
    try {
      await sendPhoneVerification(phoneNumber)
      setStatus('verification_sent')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    }
  }

  const reset = () => {
    setStatus('pending')
  }

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        {status === 'error' && (
          <$Vertical justifyContent="center" style={{ marginTop: '15vh' }}>
            <$Icon>{'🤕'}</$Icon>
            <$Heading>{words.anErrorOccured}</$Heading>
            {errorMessage ? <$SubHeading style={{ marginTop: '0px' }}>{errorMessage}</$SubHeading> : null}
            <$SubHeading onClick={reset} style={{ fontStyle: 'italic', textTransform: 'lowercase' }}>
              {words.retry + '?'}
            </$SubHeading>
          </$Vertical>
        )}
        {status === 'pending' && (
          <$Vertical height="100%">
            <Spinner size="30px" />
            <$Heading2 style={{ textAlign: 'start' }}>
              <FormattedMessage id="viralOnboarding.signup.header" defaultMessage="Almost Finished..." />
            </$Heading2>
            <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>{words.verifyYourPhoneNumber}</$SubHeading>
            <$Vertical spacing={3}>
              <$InputMedium
                id="sms-verf"
                type="tel"
                name="phone"
                placeholder="+1 123-456-7890"
                value={phoneNumber}
                // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                // required
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyUp={(event) => {
                  if (event.key == 'Enter') {
                    handleVerificationRequest()
                  }
                }}
              />
              <$NextButton
                onClick={handleVerificationRequest}
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
                style={{ width: '100%' }}
              >
                {words.sendCode}
              </$NextButton>
            </$Vertical>

            <$HandImage src={handIconImg} />
          </$Vertical>
        )}
        {status === 'verification_sent' && (
          <$Vertical>
            <br />
            <br />
            <br />
            <$SubHeading style={{ textAlign: 'start' }}>
              <FormattedMessage
                id="viralOnboarding.verification.sentTo"
                defaultMessage="Sent to {userPhoneNumber}"
                description="Indicating a confirmation code was sent to a number"
                values={{
                  userPhoneNumber: (
                    <$SupressedParagraph style={{ display: 'inline' }}>{phoneNumber}</$SupressedParagraph>
                  ),
                }}
              />{' '}
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
              >
                {words.confirm}
              </$NextButton>
            </$Vertical>
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

export default OnboardingSignUp
