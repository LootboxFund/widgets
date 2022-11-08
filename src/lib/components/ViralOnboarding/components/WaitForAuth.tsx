import { useQuery } from '@apollo/client'
import { ClaimID, COLORS, LootboxID, TYPOGRAPHY } from '@wormgraph/helpers'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import Spinner, { LoadingText } from 'lib/components/Generics/Spinner'
import { useLocalStorage } from 'lib/hooks/useLocalStorage'
import useWords from 'lib/hooks/useWords'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { $Heading, $Heading2, $NextButton, $SubHeading, $SupressedParagraph, background1 } from '../contants'
import { extractURLState_ViralOnboardingPage } from '../utils'
import {
  ClaimByIDResponse,
  CLAIM_BY_ID,
  GetLootboxViralOnboardingResponse,
  GET_LOOTBOX_VIRAL_ONBOARDING,
} from '../api.gql'
import { QueryClaimByIdArgs, QueryGetLootboxByIdArgs } from '../../../api/graphql/generated/types'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWindowSize from 'lib/hooks/useScreenSize'

interface WaitForAuthProps {
  onNext: (claimID: ClaimID, lootboxID: LootboxID) => Promise<void>
  onBack: () => void
  onRestart: () => void
}

const WaitForAuth = (props: WaitForAuthProps) => {
  const { screen } = useWindowSize()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [emailForSignup, setEmailForSignup] = useLocalStorage<string>('emailForSignup', '')
  const { setClaim, setChosenLootbox } = useViralOnboarding()
  const words = useWords()
  const [localEmail, setLocalEmail] = useState(emailForSignup || '')
  const status = useMemo(() => {
    if (loading) {
      return 'loading'
    }
    if (errorMessage) {
      return 'error'
    }
    if (!emailForSignup) {
      return 'no-email'
    }
    return 'pending'
  }, [loading, errorMessage, emailForSignup])

  const { claimID, lootboxID } = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_ViralOnboardingPage()
    return {
      claimID: INITIAL_URL_PARAMS.claimID,
      lootboxID: INITIAL_URL_PARAMS.lootboxID,
    }
  }, [])

  useQuery<GetLootboxViralOnboardingResponse, QueryGetLootboxByIdArgs>(GET_LOOTBOX_VIRAL_ONBOARDING, {
    skip: !lootboxID,
    variables: {
      id: lootboxID || '',
    },
    onCompleted: (data) => {
      if (data?.getLootboxByID?.__typename === 'LootboxResponseSuccess') {
        console.log('fetched lootbox data')
        setChosenLootbox(data.getLootboxByID.lootbox)
      }
    },
  })
  useQuery<ClaimByIDResponse, QueryClaimByIdArgs>(CLAIM_BY_ID, {
    skip: !claimID,
    variables: {
      claimID: claimID || '',
    },
    onCompleted: (data) => {
      if (data?.claimByID?.__typename === 'ClaimByIDResponseSuccess') {
        console.log('fetched claim data')
        setClaim(data.claimByID.claim)
      }
    },
  })

  useEffect(() => {
    handleAuthenticateDynamicLink()
  }, [])

  const handleAuthenticateDynamicLink = async () => {
    let emailToUse = emailForSignup || localEmail

    if (isSignInWithEmailLink(auth, window.location.href) && emailToUse) {
      setLoading(true)
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.

      //   if (!emailToUse) {
      //     // User opened the link on a different device. To prevent session fixation
      //     // attacks, ask the user to provide the associated email again. For example:
      //     emailToUse = window.prompt('Please provide your email for confirmation') || ''
      //   }
      try {
        // The client SDK will parse the code from the link for you.
        // setStatus('loading')
        await signInWithEmailLink(auth, emailToUse, window.location.href)

        const {
          INITIAL_URL_PARAMS: { claimID, lootboxID },
        } = extractURLState_ViralOnboardingPage()

        if (!claimID || !lootboxID) {
          console.error('no claim or lootbox in params')
          props.onRestart()
          return
        }

        await props.onNext(claimID as ClaimID, lootboxID as LootboxID)
        setEmailForSignup('')
        return
      } catch (err) {
        console.error(err)
        setErrorMessage(err?.message || words.anErrorOccured)
        return
      } finally {
        setLoading(false)
      }
    }
  }

  const submitEmail = () => {
    setEmailForSignup(localEmail)
    handleAuthenticateDynamicLink()
  }

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        {status === 'no-email' && (
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
                value={localEmail}
                // onChange={(e) => setEmailForSignup(e.target.value)}
                onChange={(e) => setLocalEmail(e.target.value)}
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
            </$Vertical>
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
            {errorMessage ? <$SubHeading style={{ marginTop: '0px' }}>{errorMessage}</$SubHeading> : null}

            <$SubHeading
              onClick={props.onBack}
              style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}
            >
              {words.retry + '?'}
            </$SubHeading>
          </$Vertical>
        )}
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
              Check you Email
            </$Heading>
            <$SubHeading style={{ marginTop: '0px' }}>
              {emailForSignup
                ? `Check your spam folder. A login email was sent to ${emailForSignup}.`
                : 'Check your spam folder. A login link was sent to your email'}
            </$SubHeading>
          </$Vertical>
        )}
      </$ViralOnboardingSafeArea>

      <$ViralOnboardingSafeArea>WAIT BITCH</$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

const $InputMedium = styled.input`
  background-color: ${`${COLORS.white}`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

export default WaitForAuth
