import { ChangeEvent, useEffect, useState } from 'react'
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
import CountrySelect from 'lib/components/CountrySelect'
import { useRecaptcha } from 'lib/hooks/useRecaptcha'

interface SignUpEmailProps {
  onChangeMode: (mode: ModeOptions) => void
  onSignupSuccess?: () => void
  title?: string
}
const LoginPhone = (props: SignUpEmailProps) => {
  const { recaptchaVerifier } = useRecaptcha()
  const [status, setStatus] = useState<'pending' | 'verification_sent' | 'complete'>('pending')
  const { sendPhoneVerification, signInPhoneWithCode } = useAuth()
  const { screen } = useWindowSize()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [phoneCode, setPhoneCode] = useState<string>('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
    | 'session'
    | 'local'
  const [persistenceChecked, setPersistenceChecked] = useState(persistence === 'local')
  const intl = useIntl()
  const words = useWords()
  const parsedPhone = `${phoneCode ? `+${phoneCode}` : ''}${phoneNumber}`

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
    if (loading) {
      return
    }
    if (!recaptchaVerifier) {
      LogRocket.captureException(new Error("No recaptcha verifier, can't send verification"))
      setErrorMessage(words.anErrorOccured)
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      await sendPhoneVerification(`${phoneCode ? `+${phoneCode}` : ''}${phoneNumber}`, recaptchaVerifier)
      setStatus('verification_sent')
    } catch (err) {
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      await signInPhoneWithCode(confirmationCode)
      setStatus('complete')
      props.onSignupSuccess && props.onSignupSuccess()
    } catch (err) {
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
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

  const reset = () => {
    setStatus('pending')
  }

  return (
    <$Vertical spacing={4}>
      {props.title && <$Header>{props.title}</$Header>}
      {status === 'pending' && (
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            <$span>{words.verifyYourPhoneNumber}</$span>
            <$Horizontal>
              <CountrySelect onChange={setPhoneCode} />
              <$InputMedium
                id="sms-verf"
                type="tel"
                name="phone"
                placeholder="123-456-7890"
                // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                // required
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '0px 10px 10px 0px',
                  borderLeft: `${COLORS.surpressedBackground}ae 1px solid`,
                }}
              />
            </$Horizontal>
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
              <LoadingText loading={loading} text={words.sendCode} color={COLORS.white} />
            </$Button>
          </$Vertical>
        </$Vertical>
      )}
      {status === 'verification_sent' && (
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            <$span>
              {words.codeSentToFn(parsedPhone)}{' '}
              <$span
                onClick={reset}
                style={{ display: 'inline', textTransform: 'lowercase', fontStyle: 'italic', cursor: 'pointer' }}
              >
                [{words.edit}]
              </$span>
            </$span>

            <$InputMedium
              id="verification-input"
              placeholder={words.verificationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              type="number"
            />
          </$Vertical>
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
            <LoadingText loading={loading} text={words.confirm} color={COLORS.white} />
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
