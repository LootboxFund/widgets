import { useQuery } from '@apollo/client'
import { ClaimID, COLORS, LootboxID, TYPOGRAPHY } from '@wormgraph/helpers'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { $Heading, $NextButton, $SubHeading, background1, handIconImg } from '../contants'
import { extractURLState_ViralOnboardingPage } from '../utils'
import {
  ClaimByIDResponse,
  CLAIM_BY_ID,
  GetLootboxViralOnboardingResponse,
  GET_LOOTBOX_VIRAL_ONBOARDING,
} from '../api.gql'
import { QueryClaimByIdArgs, QueryGetLootboxByIdArgs } from '../../../api/graphql/generated/types'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useAuth } from 'lib/hooks/useAuth'
import { manifest } from 'manifest'
import $Button from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'

interface WaitForAuthProps {
  onNext: (claimID: ClaimID, lootboxID: LootboxID) => Promise<void>
  onBack: () => void
  onRestart: () => void
}

const WaitForAuth = (props: WaitForAuthProps) => {
  const [loading, setLoading] = useState(false)
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const { setClaim, setChosenLootbox, chosenLootbox } = useViralOnboarding()
  const words = useWords()
  const { user } = useAuth()
  const { claimID, lootboxID, email } = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_ViralOnboardingPage()
    return {
      claimID: INITIAL_URL_PARAMS.claimID,
      lootboxID: INITIAL_URL_PARAMS.lootboxID,
      email: INITIAL_URL_PARAMS.email,
    }
  }, [])

  const status = useMemo(() => {
    if (loading) {
      return 'loading'
    }
    if (errorMessage) {
      return 'error'
    }
    return 'pending'
  }, [loading, errorMessage])

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
    if (isSignInWithEmailLink(auth, window.location.href) && email) {
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
        await signInWithEmailLink(auth, email, window.location.href)

        const {
          INITIAL_URL_PARAMS: { claimID, lootboxID },
        } = extractURLState_ViralOnboardingPage()

        if (!claimID || !lootboxID) {
          console.error('no claim or lootbox in params')
          props.onRestart()
          return
        }

        await props.onNext(claimID as ClaimID, lootboxID as LootboxID)
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

  const GoToProfile = () => {
    if (!user) {
      return null
    }
    return (
      <a href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user.id}`} style={{ textDecoration: 'none' }}>
        <$SubHeading
          style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer', marginBottom: '0px' }}
        >
          Go to Profile
        </$SubHeading>
      </a>
    )
  }

  const SkipToProfileButton = () => {
    if (!user) {
      return null
    }
    return (
      <a
        href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`}
        style={{ textDecoration: 'none', textAlign: 'center' }}
      >
        <$NextButton
          color={COLORS.trustFontColor}
          backgroundColor={COLORS.surpressedBackground}
          style={{ boxShadow: 'none', paddingLeft: '20px', paddingRight: '20px' }}
        >
          Skip to Profile
        </$NextButton>
      </a>
    )
  }

  const stampImg = chosenLootbox?.stampImage

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical height="100%">
          {/* {status === 'no-email' && (
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
        )} */}
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
              <GoToProfile />
              <$SubHeading
                onClick={props.onBack}
                style={{ fontStyle: 'italic', textTransform: 'lowercase', cursor: 'pointer' }}
              >
                {words.retry + '?'}
              </$SubHeading>
              <br />
              <br />
              <SkipToProfileButton />
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
                Check your email
              </$Heading>
              <$SubHeading style={{ marginTop: '0px' }}>
                {email
                  ? `Check your spam folder. A login email was sent to ${email}.`
                  : 'Check your spam folder. A login link was sent to your email'}
              </$SubHeading>
              <br />
              <br />
              <SkipToProfileButton />
            </$Vertical>
          )}
          {stampImg ? <$PartyBasketImage src={stampImg} /> : <$HandImage src={handIconImg} />}
        </$Vertical>
      </$ViralOnboardingSafeArea>
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

const $PartyBasketImage = styled.img`
  margin: auto auto -3.5rem;
  max-width: 220px;
  width: 100%;
  filter: drop-shadow(0px 0px 25px #ffffff);
`
const $HandImage = styled.img`
  margin: auto 0 -3.5rem;
`

export default WaitForAuth
