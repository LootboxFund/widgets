import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
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
import { browserLocalPersistence, setPersistence } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useMutation } from '@apollo/client'
import { COMPLETE_CLAIM } from '../api.gql'
import { CompleteClaimResponse, MutationCompleteClaimArgs } from 'lib/api/graphql/generated/types'

interface Props {
  onNext: () => void
  onBack: () => void
}
type Status = 'error' | 'pending' | 'verification_sent' | 'initializing'
const OnboardingSignUp = (props: Props) => {
  const words = useWords()
  const [status, setStatus] = useState<Status>('initializing')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const { user, sendPhoneVerification, signInPhoneWithCode } = useAuth()
  const { claim, referral, chosenPartyBasket } = useViralOnboarding()
  const captchaRef = createRef<HTMLDivElement>()
  const [completeClaim, { loading: loadingMutation }] = useMutation<
    { completeClaim: CompleteClaimResponse },
    MutationCompleteClaimArgs
  >(COMPLETE_CLAIM)
  const intl = useIntl()
  const youHaveAlreadyAccepted = intl.formatMessage({
    id: 'viralOnboarding.youHaveAlreadyAccepted',
    defaultMessage: 'You have already accepted this referral.',
  })
  const youHaveAlreadyAcceptedInfo = intl.formatMessage({
    id: 'viralOnboarding.youHaveAlreadyAcceptedInfo',
    defaultMessage:
      'You can only accept an initial invite once. If you want more tickets, ask your tournament host for a new referral link.',
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

  const handleCodeSubmit = async () => {
    setLoading(true)
    try {
      setPersistence(auth, browserLocalPersistence)
      await signInPhoneWithCode(confirmationCode)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || words.anErrorOccured)
      LogRocket.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationRequest = async () => {
    setErrorMessage('')
    setLoading(true)
    try {
      await sendPhoneVerification(phoneNumber)
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

    // Add it to localStorage
    try {
      const pastClaimsRaw = localStorage.getItem('recentClaims')
      const pastClaims: LocalClaim[] = pastClaimsRaw ? JSON.parse(pastClaimsRaw) : []
      pastClaims.unshift({
        campaignName: referral?.campaignName,
        tournamentId: claim.tournamentId,
        partyBasketId: claim.chosenPartyBasketId ? claim.chosenPartyBasketId : undefined,
      })
      localStorage.setItem('recentClaims', JSON.stringify(pastClaims))
    } catch (err) {
      localStorage.setItem(
        'recentClaims',
        JSON.stringify([
          {
            campaignName: referral?.campaignName,
            tournamentId: claim.tournamentId,
            partyBasketId: claim.chosenPartyBasketId ? claim.chosenPartyBasketId : undefined,
          },
        ])
      )
    }

    props.onNext()
  }

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

  const reset = () => {
    setStatus('pending')
  }

  const isAlreadyAccepted = errorMessage && errorMessage?.toLowerCase().includes('already accepted')

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        {status === 'initializing' && <Spinner color={`${COLORS.white}`} size="50px" margin="10vh auto" />}
        {status === 'error' && (
          <$Vertical justifyContent="center" style={{ marginTop: '15vh' }}>
            <$Icon>{isAlreadyAccepted ? '😅' : '🤕'}</$Icon>
            <$Heading style={{ textTransform: 'none', fontSize: TYPOGRAPHY.fontSize.xlarge }}>
              {isAlreadyAccepted ? youHaveAlreadyAccepted : errorMessage || words.anErrorOccured}
            </$Heading>
            {isAlreadyAccepted ? (
              <$SubHeading style={{ marginTop: '0px' }}>{youHaveAlreadyAcceptedInfo}</$SubHeading>
            ) : null}
            <$SubHeading onClick={reset} style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}>
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
                <LoadingText loading={loading} text={words.sendCode} color={COLORS.white} />
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
                disabled={loading}
              >
                <LoadingText loading={loading} text={words.confirm} color={COLORS.white} />
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
