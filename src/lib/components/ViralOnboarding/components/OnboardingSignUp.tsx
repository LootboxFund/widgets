import useWords from 'lib/hooks/useWords'
import { $Horizontal, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  $Heading,
  $Heading2,
  $NextButton,
  $SubHeading,
  $SupressedParagraph,
  background1,
  handIconImg,
  LocalClaim,
} from '../contants'
import Spinner from 'lib/components/Generics/Spinner'
import { createRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import LogRocket from 'logrocket'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useMutation } from '@apollo/client'
import { COMPLETE_CLAIM } from '../api.gql'
import {
  CompleteClaimResponse,
  CompleteClaimResponseSuccess,
  MutationCompleteClaimArgs,
} from 'lib/api/graphql/generated/types'
import CountrySelect from 'lib/components/CountrySelect'
import { useAuthWords } from 'lib/components/Authentication/Shared/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Link } from 'lib/components/Profile/common'
import { TOS_URL } from 'lib/hooks/constants'
import { parseAuthError } from 'lib/utils/firebase'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

interface Props {
  onNext: () => void
  onBack: () => void
  goToReferralCreation: () => void
}
type Status = 'error' | 'pending' | 'verification_sent' | 'initializing'
const OnboardingSignUp = (props: Props) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [status, setStatus] = useState<Status>('initializing')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneCode, setPhoneCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const { user, sendPhoneVerification, signInPhoneWithCode } = useAuth()
  const { claim, referral, chosenPartyBasket, email } = useViralOnboarding()
  const [notificationClaims, setNotificationClaims] = useLocalStorage<string[]>('notification_claim', [])
  const captchaRef = createRef<HTMLDivElement>()
  const [completeClaim, { loading: loadingMutation }] = useMutation<
    { completeClaim: CompleteClaimResponse },
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)
  const intl = useIntl()
  const authWords = useAuthWords()
  const youHaveAlreadyAccepted = intl.formatMessage({
    id: 'viralOnboarding.youHaveAlreadyAccepted',
    defaultMessage: 'You have already accepted this referral.',
  })
  const screenshotAndShare = intl.formatMessage({
    id: 'viralOnboarding.screenshotAndShare',
    defaultMessage:
      'If you want more tickets, generate a QR code below, screenshot it, and share it with your friends 👇',
  })

  const youHaveAlreadyAcceptedInfo = intl.formatMessage(
    {
      id: 'viralOnboarding.youHaveAlreadyAcceptedInfo',
      defaultMessage: 'You can only accept an initial invite once. {boldText}',
    },
    { boldText: <b>{screenshotAndShare}</b> }
  )

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

  useEffect(() => {
    if (user) {
      completeClaimRequest()
        .then(() => {
          console.log('completed')
          props.onNext()
        })
        .catch((err) => {
          console.error(err)
          setErrorMessage(err.message)
          setStatus('error')
        })
    } else if (user === null) {
      setStatus('pending')
    }
  }, [user])

  const handleCodeSubmit = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    setErrorMessage('')
    try {
      setPersistence(auth, browserLocalPersistence)
      await signInPhoneWithCode(confirmationCode, email)
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

  const completeClaimRequest = async () => {
    setErrorMessage('')
    if (!claim?.id) {
      console.error('no claim')
      throw new Error(words.anErrorOccured)
    } else if (!chosenPartyBasket?.id) {
      console.error('no party basket')
      throw new Error(words.anErrorOccured)
    }
    const { data } = await completeClaim({
      variables: {
        payload: {
          claimId: claim.id,
          chosenPartyBasketId: chosenPartyBasket.id,
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
      if ((data?.completeClaim as CompleteClaimResponseSuccess)?.claim?.id) {
        setNotificationClaims([...notificationClaims, (data?.completeClaim as CompleteClaimResponseSuccess)?.claim?.id])
      }
    } catch (err) {
      console.error(err)
    }

    props.onNext()
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
    if (errorMessage?.toLowerCase()?.indexOf('sold out')) {
      props.onBack()
    }
  }

  const isAlreadyAccepted = errorMessage && errorMessage?.toLowerCase().includes('already accepted')

  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string | undefined = _lb?.stampImage ? convertFilenameToThumbnail(_lb.stampImage, 'sm') : undefined

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        {status === 'initializing' && <Spinner color={`${COLORS.white}`} size="50px" margin="10vh auto" />}
        {status === 'error' && !isAlreadyAccepted && (
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
        {status === 'error' && isAlreadyAccepted && (
          <$Vertical justifyContent="center" style={{ marginTop: '5vh' }}>
            <$Icon>{'😅'}</$Icon>
            <$Heading style={{ textTransform: 'none', fontSize: TYPOGRAPHY.fontSize.xlarge }}>
              {errorMessage ? parseAuthError(intl, errorMessage) : words.anErrorOccured}
            </$Heading>
            <$SubHeading style={{ marginTop: '0px' }}>{youHaveAlreadyAcceptedInfo}</$SubHeading>
            <$NextButton
              onClick={() => props.goToReferralCreation()}
              color={COLORS.trustFontColor}
              backgroundColor={COLORS.trustBackground}
              style={{ textTransform: 'capitalize', fontWeight: TYPOGRAPHY.fontWeight.regular }}
            >
              {words.generateInviteLinkText}
            </$NextButton>
            <$SubHeading
              onClick={() => props.onBack()}
              style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer', margin: '30px 0px' }}
            >
              {words.back}
            </$SubHeading>
          </$Vertical>
        )}

        {status === 'pending' && (
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

            {!!chosenPartyBasket && !!image ? <$PartyBasketImage src={image} /> : <$HandImage src={handIconImg} />}
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

export default OnboardingSignUp
