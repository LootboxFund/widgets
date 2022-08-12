import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useAuth } from 'lib/hooks/useAuth'
import { $Button } from '../../Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import LogRocket from 'logrocket'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $InputMedium, $ChangeMode, ModeOptions, $Checkbox } from '../Shared'
import { $Header, $ErrorMessage, $span } from '../../Generics/Typography'
import { parseAuthError } from 'lib/utils/firebase'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'
import { browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'

export interface PhoneCountryCode {}

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
  const [iti, setIti] = useState<intlTelInput.Plugin>()
  const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
    | 'session'
    | 'local'
  const [persistenceChecked, setPersistenceChecked] = useState(persistence === 'local')
  const intl = useIntl()
  const words = useWords()

  useEffect(() => {
    const el = document.getElementById('phone-input')
    if (el) {
      const iti = intlTelInput(el, { separateDialCode: true, initialCountry: 'PH' })
      el.focus()
      setIti(iti)
    }
    return
  }, [])

  useEffect(() => {
    if (status === 'verification_sent') {
      const el = document.getElementById('verification-input')
      if (el) {
        el.focus()
      }
    }
  }, [status])

  const handleVerificationRequest = async () => {
    const dialCode = iti?.getSelectedCountryData()?.dialCode
    setErrorMessage('')
    try {
      const fmtPhone = dialCode ? `+${dialCode}` + phoneNumber : phoneNumber
      console.log('submitting phone', fmtPhone)
      await sendPhoneVerification(fmtPhone)
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

  const handlePhoneChange = async (phoneNumber: string) => {
    setPhoneNumber(phoneNumber)
  }

  const clickRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    const newPersistenceChecked = e.target.checked
    setPersistenceChecked(newPersistenceChecked)
    if (newPersistenceChecked) {
      setPersistence(auth, browserLocalPersistence)
      localStorage.setItem('auth.persistence', 'local')
      return
    } else {
      setPersistence(auth, browserSessionPersistence)
      localStorage.setItem('auth.persistence', 'session')
      return
    }
  }

  return (
    <$Vertical spacing={4}>
      {props.title && <$Header>{props.title}</$Header>}

      {status === 'pending' && (
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            <$span>{words.verifyYourPhoneNumber}</$span>
            {/* <input id="phone-input" /> */}
            <$InputMedium
              id="phone-input"
              type="tel"
              placeholder="123-456-7890"
              onChange={(e) => handlePhoneChange(e.target.value)}
              style={{ width: '100%' }}
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
              {words.sendCode}
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
      <$Horizontal spacing={2} flexWrap justifyContent="space-between">
        <$span textAlign="start" style={{ display: 'flex', alignItems: 'center' }}>
          <$Checkbox type="checkbox" checked={persistenceChecked} onChange={clickRememberMe} />
          <$span style={{ verticalAlign: 'middle', display: 'inline-block' }}> {words.rememberMe}</$span>
        </$span>
      </$Horizontal>

      {errorMessage ? <$ErrorMessage>{parseAuthError(intl, errorMessage)}</$ErrorMessage> : null}
    </$Vertical>
  )
}

export default LoginPhone
