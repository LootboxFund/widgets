import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage } from 'react-intl'
import { $Heading2, $NextButton, $SubHeading, $SupressedParagraph, background1, handIconImg } from '../contants'
import { useState } from 'react'
import styled from 'styled-components'
import { COLORS, TournamentID, TYPOGRAPHY } from '@wormgraph/helpers'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { checkIfValidEmail } from 'lib/api/helpers'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { useAuthWords } from 'lib/components/Authentication/Shared'
import { $Link } from 'lib/components/Profile/common'
import { TOS_URL_DATASHARING } from 'lib/hooks/constants'
import { PRIVACY_URL_DATASHARING } from 'lib/hooks/constants'
import { $Spinner } from 'lib/components/Generics/Spinner'

interface Props {
  onNext: (email: string) => Promise<void>
  onBack: () => void
}
const OnboardingAddEmail = (props: Props) => {
  const words = useWords()
  const [email, setEmailLocal] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setEmail, chosenLootbox, chosenPartyBasket, referral } = useViralOnboarding()
  const [loading, setLoading] = useState(false)

  const authWords = useAuthWords()
  const [consentDataSharing, setConsentDataSharing] = useState(false)

  const submitEmail = async () => {
    if (loading) {
      return
    }

    setConsentDataSharing(true)
    // just ad it to memory
    // it will be added to user object in next page
    const isValid = checkIfValidEmail(email)
    if (!isValid) {
      setErrorMessage(words.invalidEmail)
      return
    }

    setEmail(email)
    setLoading(true)
    try {
      // Sign user in anonymously and send magic link
      await props.onNext(email)
    } catch (err) {
      setErrorMessage(err?.message || words.anErrorOccured)
    } finally {
      setLoading(false)
    }
  }

  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string | null = chosenLootbox?.stampImage
    ? convertFilenameToThumbnail(chosenLootbox.stampImage, 'sm')
    : _lb?.stampImage
    ? convertFilenameToThumbnail(_lb.stampImage, 'sm')
    : null

  const hardcodedTournamentsWithDataSharing: TournamentID[] = [
    '1qKLXgaRXviPP110ZHLe' as TournamentID, // Angkas
    'RV09iGE02V7nOgEbq8hW' as TournamentID, // GCash
    'tX5tCISFjDcWmctvILnk' as TournamentID, // MetaCare
    'fPxO1FXLyu6p39FTf9yq' as TournamentID, // Binance
    'pMkl6CSOuEsyQDvJzvA5' as TournamentID, // Cash Giveaway 1
    'LGT4JtA6sV73KhXVcCEH' as TournamentID, // Cash Giveaway 2
    'G0ESRAL0O4OcgZ7Bw38M' as TournamentID, // Cash Giveaway 3
    'C3msweDHfYCesJ2SWxeC' as TournamentID, // Cash Giveaway 4
    'hKmu2hn9VnSOhDYawEaN' as TournamentID, // Axie Manila Tournament
    'LFqlqg3UcPx8E0pu0mTu' as TournamentID, // Prod Test
  ]
  const needsDataSharingConsent = hardcodedTournamentsWithDataSharing.includes(referral.tournamentId)
  // const needsDataSharingConsent = true

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical height="100%">
          <$Heading2 style={{ textAlign: 'start', marginTop: '50px' }}>
            <FormattedMessage
              id="viralOnboarding.addEmail.header"
              defaultMessage="Where should we send your FREE ticket?"
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
              <span>
                {loading && <$Spinner margin="auto 12px auto 0px" style={{ display: 'inline-block' }} />}
                {needsDataSharingConsent ? (
                  <FormattedMessage
                    id="viralonboarding.getMyTicketWithDataSharingConsent"
                    defaultMessage="Agree & Claim Ticket"
                    description="Ticket referring to NFT with data sharing consent"
                  />
                ) : (
                  <FormattedMessage
                    id="viralonboarding.getMyTicket"
                    defaultMessage="Get my ticket"
                    description="Ticket referring to NFT"
                  />
                )}
              </span>
            </$NextButton>
            {errorMessage ? <$SubHeading style={{ marginTop: '0px' }}>{errorMessage}</$SubHeading> : null}
          </$Vertical>
          <$SupressedParagraph
            style={{
              fontSize: TYPOGRAPHY.fontSize.small,
              lineHeight: TYPOGRAPHY.fontSize.medium,
              marginTop: '20px',
              width: '100%',
              textAlign: 'start',
            }}
          >
            {needsDataSharingConsent ? (
              <div
                onClick={() => setConsentDataSharing(!consentDataSharing)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={consentDataSharing}
                  onClick={(e: any) => setConsentDataSharing(e.target.checked)}
                  style={{
                    fontSize: '1.5rem',
                    backgroundColor: 'gray',
                    marginRight: '10px',
                    cursor: 'pointer',
                    width: '30px !important',
                    height: '30px !important',
                  }}
                />
                {authWords.consentDataSharingLinks(
                  <span>
                    <$Link href={PRIVACY_URL_DATASHARING} target="_blank">
                      {authWords.privacyPolicy}
                    </$Link>
                  </span>,
                  <$Link href={TOS_URL_DATASHARING} target="_blank">
                    {authWords.termsOfService}
                  </$Link>
                )}
              </div>
            ) : (
              <FormattedMessage
                id="viralOnboarding.signup.email.disclaimer"
                defaultMessage="You will NOT receive marketing emails, we only notify if you win"
                description="Disclaimer when collecting email"
              />
            )}
          </$SupressedParagraph>
          {!!image ? <$PartyBasketImage src={image} /> : <$HandImage src={handIconImg} />}
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
`

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

export default OnboardingAddEmail
