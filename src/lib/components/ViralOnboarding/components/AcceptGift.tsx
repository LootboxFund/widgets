import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  background1,
  $Heading,
  $GiantHeading,
  $SubHeading,
  $SupressedParagraph,
  $NextButton,
  $TournamentStampPreviewContainer,
  $TournamentStampPreviewImage,
} from '../contants'
import { COLORS, TournamentID } from '@wormgraph/helpers'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useMutation } from '@apollo/client'
import { CreateClaimResponseFE, CREATE_CLAIM } from '../api.gql'
import { MutationCreateClaimArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { ErrorCard } from './GenericCard'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

interface Props {
  onNext: () => void
  onBack: () => void
}
const AcceptGift = (props: Props) => {
  const intl = useIntl()
  const words = useWords()
  const { referral, setClaim } = useViralOnboarding()
  const [errorMessage, setErrorMessage] = useState<string>()
  useEffect(() => {
    startFlight()
  }, [])
  const [createClaim, { loading }] = useMutation<
    { createClaim: CreateClaimResponseFE | ResponseError },
    MutationCreateClaimArgs
  >(CREATE_CLAIM)
  const acceptGiftText = intl.formatMessage({
    id: 'viralOnboarding.acceptGift.next',
    defaultMessage: 'Accept Gift',
    description: 'Button to accept a gift',
  })

  const LootboxSnapshots = () => {
    const seedLootboxID = referral.seedLootboxID

    let showCasedLootboxImages: string[]
    if (referral?.tournament?.lootboxSnapshots && referral?.tournament?.lootboxSnapshots?.length > 0) {
      const showcased = seedLootboxID
        ? referral.tournament.lootboxSnapshots.find((snap) => snap.lootboxID === seedLootboxID)
        : undefined
      const secondary = seedLootboxID
        ? referral.tournament.lootboxSnapshots.find((snap) => snap.lootboxID !== seedLootboxID)
        : undefined
      showCasedLootboxImages = !!showcased?.stampImage
        ? [
            convertFilenameToThumbnail(showcased.stampImage, 'sm'),
            secondary?.stampImage ? convertFilenameToThumbnail(secondary.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP,
          ]
        : [
            ...referral.tournament.lootboxSnapshots.map((snap) =>
              snap.stampImage ? convertFilenameToThumbnail(snap.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP
            ),
          ]
    } else {
      showCasedLootboxImages = [TEMPLATE_LOOTBOX_STAMP, TEMPLATE_LOOTBOX_STAMP]
    }

    return (
      <$TournamentStampPreviewContainer style={{ marginLeft: '30%', padding: '2rem 0px', boxSizing: 'content-box' }}>
        {showCasedLootboxImages.slice(0, 2).map((img, idx) => (
          <$TournamentStampPreviewImage key={`tournament-${idx}`} src={img} cardNumber={idx as 0 | 1} />
        ))}
      </$TournamentStampPreviewContainer>
    )
  }
  const defaultWinText = intl.formatMessage({
    id: 'viralOnboarding.acceptGift.winAFreeNFT',
    defaultMessage: 'Win a Free NFT',
    description: 'Prize message to win a free Lootbox NFT',
  })

  const formattedDate: string = referral?.tournament?.tournamentDate
    ? new Date(referral.tournament.tournamentDate).toDateString()
    : words.tournament

  const startFlight = async () => {
    try {
      if (!referral?.slug) {
        console.error('No referral slug')
        throw new Error(words.anErrorOccured)
      }
      const { data } = await createClaim({
        variables: {
          payload: {
            referralSlug: referral?.slug,
          },
        },
      })

      if (
        !data?.createClaim ||
        data?.createClaim?.__typename === 'ResponseError' ||
        data?.createClaim?.__typename !== 'CreateClaimResponseSuccess'
      ) {
        throw new Error(words.anErrorOccured)
      }

      const claim = (data.createClaim as CreateClaimResponseFE).claim

      setClaim(claim)
    } catch (err) {
      console.error(err)
      setErrorMessage(err?.message || words.anErrorOccured)
    }
  }

  if (errorMessage) {
    return (
      <ErrorCard title={words.anErrorOccured} message={errorMessage} icon="🤕">
        <$SubHeading
          onClick={() => setErrorMessage(undefined)}
          style={{ fontStyle: 'italic', textTransform: 'lowercase' }}
        >
          {words.retry + '?'}
        </$SubHeading>
      </ErrorCard>
    )
  }

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical>
          <LootboxSnapshots />
          <$SupressedParagraph>
            <FormattedMessage
              id="viralOnboarding.acceptGift.invitationMessage"
              defaultMessage="{name}{newline}Gifted you a Lootbox Ticket"
              description="Message to show when a user is gifted a free Lootbox Ticket"
              values={{
                name: referral?.campaignName,
                newline: <br />,
              }}
            />
          </$SupressedParagraph>
          <$GiantHeading>
            {referral.seedLootbox?.nftBountyValue || referral?.seedPartyBasket?.nftBountyValue || defaultWinText}
          </$GiantHeading>
          <$SubHeading>
            Claim this FREE Lootbox Ticket for a chance to win
            {/* <FormattedMessage
              id="viralOnboarding.acceptGift.description"
              defaultMessage="Claim this FREE Lootbox Ticket for a chance to win"
              description="Description of the prize"
              values={{
                tournamentDate: formattedDate,
              }}
            /> */}
          </$SubHeading>
          <$Heading>
            <$NextButton
              onClick={() => props.onNext()}
              color={COLORS.trustFontColor}
              backgroundColor={COLORS.trustBackground}
              style={{ width: '100%' }}
              disabled={loading}
            >
              <LoadingText loading={loading} color={COLORS.white} text={acceptGiftText} />
            </$NextButton>
          </$Heading>
          <$SupressedParagraph style={{ width: '60%', margin: '0 auto' }}>
            <FormattedMessage
              id="viralOnboarding.acceptGift.nConversions"
              defaultMessage="{nPeople} people already accepted this gift"
              description="Counts how many users accepted the gift"
              values={{
                nPeople: referral?.tournament?.runningCompletedClaims || 0,
              }}
            />
          </$SupressedParagraph>
        </$Vertical>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default AcceptGift
