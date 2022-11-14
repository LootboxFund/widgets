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
  const [phone, setPhoneLocal] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setEmail, chosenLootbox, chosenPartyBasket, referral, sessionId } = useViralOnboarding()
  const [loading, setLoading] = useState(false)

  const authWords = useAuthWords()
  const [consentDataSharing, setConsentDataSharing] = useState(false)

  const logToGoogleSheets = async () => {
    const url = 'https://eo7vkun3q05rf2q.m.pipedream.net'
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        tournamentId: referral.tournamentId,
        email: email,
        phone: phone,
        sessionID: sessionId,
        userID: 'anon',
        campaignName: referral.campaignName,
        referrerId: referral.campaignName,
        promoterId: referral.promoterId,
        tournament: referral.tournament.title,
      }), // body data type must match "Content-Type" header
    })
    return response
  }

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
    if (needsPhoneNumber) {
      logToGoogleSheets()
    }
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

  const needsPhoneNumberArray: string[] = [
    '1qKLXgaRXviPP110ZHLe' as TournamentID, // Angkas
    'RV09iGE02V7nOgEbq8hW' as TournamentID, // GCash
    'pMkl6CSOuEsyQDvJzvA5' as TournamentID, // Cash Giveaway 1
    'LGT4JtA6sV73KhXVcCEH' as TournamentID, // Cash Giveaway 2
    'G0ESRAL0O4OcgZ7Bw38M' as TournamentID, // Cash Giveaway 3
    'C3msweDHfYCesJ2SWxeC' as TournamentID, // Cash Giveaway 4
  ]
  const needsPhoneNumber = needsPhoneNumberArray.includes(referral.tournamentId)
  // const needsPhoneNumber = true

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
                if (event.key == 'Enter' && !needsPhoneNumber) {
                  submitEmail()
                }
              }}
            />
            {needsPhoneNumber && (
              <$InputMedium
                type="phone"
                name="phone"
                placeholder={referral.tournamentId === 'RV09iGE02V7nOgEbq8hW' ? 'GCash Number' : 'Phone'}
                value={phone}
                onChange={(e) => setPhoneLocal(e.target.value)}
                onKeyUp={(event) => {
                  if (event.key == 'Enter') {
                    submitEmail()
                  }
                }}
              />
            )}
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

const $InputMedium = styled.input.attrs((props) => ({
  type: props.type,
}))`
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
