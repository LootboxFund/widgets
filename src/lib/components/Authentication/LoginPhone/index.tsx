import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import LogRocket from 'logrocket'
import { $Vertical } from 'lib/components/Generics'
import { $InputMedium, $ChangeMode, ModeOptions } from '../Shared'
import { $Header, $ErrorMessage, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'

interface SignUpEmailProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
  title?: string
}
const LoginPhone = (props: SignUpEmailProps) => {
  const [status, setStatus] = useState<'pending' | 'verification_sent' | 'complete'>('pending')
  const { sendPhoneVerification, signInPhoneWithCode } = useAuth()
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const intl = useIntl()
  const words = useWords()

  const enterYourPhoneNumber = intl.formatMessage({
    id: 'auth.phone.enterYourPhoneNumber',
    defaultMessage: 'Enter your phone number',
  })

  useEffect(() => {
    if (status === 'verification_sent') {
      const el = document.getElementById('verification-input')
      if (el) {
        el.focus()
      }
    }
  }, [status])

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
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    }
  }

  const handleCodeSubmit = async () => {
    try {
      await signInPhoneWithCode(confirmationCode)
      setStatus('complete')
      props.onSignupSuccess && props.onSignupSuccess()
    } catch (err) {
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    }
  }

  return (
    <$Vertical spacing={4}>
      {props.title && <$Header>{props.title}</$Header>}

      {status === 'pending' && (
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            <$span>{enterYourPhoneNumber}</$span>
            <$InputMedium
              id="sms-verf"
              type="tel"
              name="phone"
              placeholder="+1 123-456-7890"
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              // required
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </$Vertical>

          <$Vertical spacing={2}>
            <div id="recaptcha-container" />
            <$Button
              screen={screen}
              onClick={handleVerificationRequest}
              backgroundColor={`${COLORS.trustBackground}C0`}
              backgroundColorHover={`${COLORS.trustBackground}`}
              color={COLORS.trustFontColor}
              style={{
                boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
                fontWeight: TYPOGRAPHY.fontWeight.regular,
                fontSize: TYPOGRAPHY.fontSize.large,
                // textTransform: 'uppercase',
              }}
            >
              <FormattedMessage
                id="auth.signupPhone.button.sendText"
                defaultMessage="Send code"
                description="button text to send code to phone number for verification"
              />
            </$Button>
          </$Vertical>
        </$Vertical>
      )}
      {status === 'verification_sent' && (
        <$Vertical spacing={4}>
          <$InputMedium
            id="verification-input"
            placeholder={words.verificationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            type="number"
          />
          <$Button
            screen={screen}
            onClick={handleCodeSubmit}
            backgroundColor={`${COLORS.trustBackground}C0`}
            backgroundColorHover={`${COLORS.trustBackground}`}
            color={COLORS.trustFontColor}
            style={{
              boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
              textTransform: 'uppercase',
            }}
          >
            {words.confirm}
          </$Button>
        </$Vertical>
      )}

      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginPhone
