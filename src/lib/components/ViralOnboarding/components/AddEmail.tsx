import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage } from 'react-intl'
import { $Heading2, $NextButton, $SubHeading, $SupressedParagraph, background1, handIconImg } from '../contants'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWindowSize from 'lib/hooks/useScreenSize'
import { checkIfValidEmail } from 'lib/api/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'

interface Props {
  onNext: () => void
  onBack: () => void
}
const OnboardingAddEmail = (props: Props) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [email, setEmailLocal] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setEmail, chosenPartyBasket, referral } = useViralOnboarding()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log('already done - skip')
      props.onNext()
    }
  }, [user])

  const submitEmail = () => {
    // just ad it to memory
    // it will be added to user object in next page
    const isValid = checkIfValidEmail(email)
    if (!isValid) {
      setErrorMessage(words.invalidEmail)
      return
    }

    setEmail(email)
    props.onNext()
  }

  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string | undefined = _lb?.stampImage ? convertFilenameToThumbnail(_lb.stampImage, 'sm') : undefined

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical height="100%">
          <$Heading2 style={{ textAlign: 'start', marginTop: '50px' }}>
            <FormattedMessage
              id="viralOnboarding.addEmail.header"
              defaultMessage="Where should we send your ticket?"
              description="Prompt / header in the section for user to add email"
            />
          </$Heading2>
          <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>{words.enterYourEmail}</$SubHeading>
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

            <$NextButton onClick={submitEmail} color={COLORS.trustFontColor} backgroundColor={COLORS.trustBackground}>
              <FormattedMessage
                id="viralonboarding.getMyTicket"
                defaultMessage="Get my ticket"
                description="Ticket referring to NFT"
              />
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
          {!!chosenPartyBasket && !!image ? <$PartyBasketImage src={image} /> : <$HandImage src={handIconImg} />}
        </$Vertical>
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

const $PartyBasketImage = styled.img` 
  margin: auto auto -3.5rem;
  max-width: 220px;
  width: 100%;
}
`

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

export default OnboardingAddEmail
