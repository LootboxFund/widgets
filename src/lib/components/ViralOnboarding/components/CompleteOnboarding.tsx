import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { $Heading, $NextButton, $SmallText, $SubHeading, $SupressedParagraph, background2 } from '../contants'
import { useState } from 'react'
import { ErrorCard } from './GenericCard'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { detectMobileAddressBarSettings } from 'lib/api/helpers'

interface Props {
  onNext: () => void
  onBack: () => void
}
const CompleteOnboarding = (props: Props) => {
  const { referral, chosenLootbox, chosenPartyBasket } = useViralOnboarding()
  const words = useWords()
  const [err, setErr] = useState<string>()

  const completeOnboarding = () => {
    props.onNext()
  }

  const formattedDate: string = referral?.tournament?.tournamentDate
    ? new Date(referral.tournament.tournamentDate).toDateString()
    : words.tournament

  const daysDiff = referral?.tournament?.tournamentDate
    ? Math.round(
        (new Date(referral.tournament.tournamentDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24)
      )
    : undefined

  /** @deprecated */
  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string = chosenLootbox?.stampImage
    ? convertFilenameToThumbnail(chosenLootbox.stampImage, 'sm')
    : _lb?.stampImage
    ? convertFilenameToThumbnail(_lb.stampImage, 'sm')
    : TEMPLATE_LOOTBOX_STAMP

  if (err) {
    return (
      <ErrorCard message={err}>
        <$Vertical>
          <h1>
            <$NextButton color={COLORS.surpressedFontColor} onClick={() => setErr(undefined)} style={{ width: '100%' }}>
              {words.tryAgain}
            </$NextButton>
          </h1>
          <$SubHeading
            onClick={props.onNext}
            style={{
              fontStyle: 'italic',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            <FormattedMessage
              id="viralOnboarding.completeOnboarding.error.subheading"
              defaultMessage="Or, go to your profile"
            />
          </$SubHeading>
        </$Vertical>
      </ErrorCard>
    )
  }

  return (
    <$ViralOnboardingCard background={background2} opacity={'0.65'}>
      <$ViralOnboardingSafeArea
        style={{
          overflow: 'unset',
          height: '100%',
          paddingTop: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingBottom: '8rem',
        }}
      >
        <$Vertical style={{ overflowY: 'scroll', height: '85%' }}>
          <div style={{ paddingTop: '3.5rem' }} />
          <$PaddingWrapper style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <$PartyBasketImage src={image} />
          </$PaddingWrapper>
          {!!chosenLootbox?.nftBountyValue && (
            <$PaddingWrapper>
              <$SupressedParagraph style={{ width: '80%', margin: '0px auto 0px', fontStyle: 'italic' }}>
                {chosenLootbox.nftBountyValue}
              </$SupressedParagraph>
            </$PaddingWrapper>
          )}
          {!!chosenPartyBasket?.nftBountyValue && (
            <$PaddingWrapper>
              <$SupressedParagraph style={{ width: '80%', margin: '0px auto 0px', fontStyle: 'italic' }}>
                {chosenPartyBasket.nftBountyValue}
              </$SupressedParagraph>
            </$PaddingWrapper>
          )}
          <$PaddingWrapper>
            <$Heading style={{ textTransform: 'uppercase', textAlign: 'start' }}>
              {'✅ '}
              {words.success}
            </$Heading>
          </$PaddingWrapper>
          <$PaddingWrapper>
            <$SmallText
              style={{
                textAlign: 'start',
                marginTop: '0px',
                fontWeight: TYPOGRAPHY.fontWeight.bold,
                fontStyle: 'italic',
              }}
            >
              {daysDiff === undefined ? (
                <FormattedMessage
                  id="viralOnboarding.completeOnboarding.winnersAnnouned1"
                  defaultMessage="Winners Announced Shortly"
                />
              ) : daysDiff > 0 ? (
                <FormattedMessage
                  id="viralOnboarding.completeOnboarding.winnersAnnouned2"
                  defaultMessage="Winners Announced in {days} days"
                  values={{ days: daysDiff }}
                />
              ) : daysDiff === 0 ? (
                <FormattedMessage
                  id="viralOnboarding.completeOnboarding.winnersAnnouned3"
                  defaultMessage="Winners Announced Today"
                />
              ) : (
                <FormattedMessage
                  id="viralOnboarding.completeOnboarding.winnersAnnouned4"
                  defaultMessage="Winners Already Announced"
                />
              )}
            </$SmallText>
          </$PaddingWrapper>
          <$PaddingWrapper>
            <$SmallText style={{ textAlign: 'start', marginTop: '0px', fontWeight: TYPOGRAPHY.fontWeight.bold }}>
              {words.event}:
              <$SmallText style={{ textAlign: 'start', marginTop: '0px', display: 'inline' }}>
                {' '}
                {referral?.tournament?.title || words.tournament}
              </$SmallText>
            </$SmallText>
          </$PaddingWrapper>

          <$PaddingWrapper>
            <$SmallText style={{ textAlign: 'start', marginTop: '0px', fontWeight: TYPOGRAPHY.fontWeight.bold }}>
              {words.prize}:
              <$SmallText style={{ textAlign: 'start', marginTop: '0px', display: 'inline' }}>
                {' '}
                {chosenLootbox?.nftBountyValue || chosenPartyBasket?.nftBountyValue || words.freeNFT}
              </$SmallText>
            </$SmallText>
          </$PaddingWrapper>

          <$PaddingWrapper>
            <$SmallText style={{ textAlign: 'start', marginTop: '0px', fontWeight: TYPOGRAPHY.fontWeight.bold }}>
              {words.date}:{' '}
              <$SmallText style={{ textAlign: 'start', marginTop: '0px', display: 'inline' }}>
                {formattedDate}
              </$SmallText>
            </$SmallText>
          </$PaddingWrapper>

          <$PaddingWrapper>
            <$SmallText style={{ textAlign: 'start', marginTop: '0px' }}>
              {referral?.tournament?.description}
            </$SmallText>
          </$PaddingWrapper>
        </$Vertical>
        <$FloatingContainer>
          <$OpacityGradient />
          <$PaddingWrapper style={{ padding: '0px 1.6rem' }}>
            <$Heading style={{ marginTop: '0px' }}>
              <$NextButton
                onClick={completeOnboarding}
                color={COLORS.trustFontColor}
                backgroundColor={COLORS.trustBackground}
                style={{ width: '100%' }}
                // disabled={loading}
              >
                {words.finish}
              </$NextButton>
            </$Heading>
          </$PaddingWrapper>
        </$FloatingContainer>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const $FloatingContainer = styled.div`
  position: relative;
`

const $PaddingWrapper = styled.div`
  padding: 0px 3rem;
`

const $PartyBasketImage = styled.img`
  height: 200px;
  background-size: cover;
  object-fit: contain;
  margin: 20px auto;
  filter: drop-shadow(0px 0px 25px #ffffff);
`

const $OpacityGradient = styled.div`
  height: 50px;
  top: -50px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 80%);
  position: absolute;
  width: 100%;
`

export default CompleteOnboarding
