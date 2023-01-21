import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import styled from 'styled-components'
import { $Heading, $NextButton, $SmallText, $SupressedParagraph, background2 } from '../contants'
import { useEffect } from 'react'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { useMutation } from '@apollo/client'
import { MutationCreateReferralArgs, ReferralType, ResponseError } from 'lib/api/graphql/generated/types'
import { CreateReferralResponseFE, CREATE_REFERRAL } from 'lib/components/Referral/CreateLootboxReferral/api.gql'
import { manifest } from 'manifest'
import $Spinner from 'lib/components/Generics/Spinner'

const HEADER_TEXT_EL_ID = 'header-text'

interface Props {
  onNext: () => void
  onBack: () => void
}
const DoubleUp = (props: Props) => {
  const { referral, chosenLootbox } = useViralOnboarding()

  const [createReferral, { data, error, loading: loadingCreateReferral }] = useMutation<
    { createReferral: CreateReferralResponseFE | ResponseError },
    MutationCreateReferralArgs
  >(CREATE_REFERRAL, {
    variables: {
      payload: {
        tournamentId: referral?.tournamentId || '',
        lootboxID: chosenLootbox?.id || referral?.seedLootboxID,
        type: ReferralType.Viral,
      },
    },
  })

  useEffect(() => {
    createReferral()
  }, [])

  // useEffect(() => {
  //   if (true) {
  //     const element = document.getElementById(HEADER_TEXT_EL_ID)
  //     if (!element) return

  //     setTimeout(() => {
  //       element.style.transition = 'opacity 3s'
  //       element.style.opacity = '0'
  //     }, 1000)

  //     setTimeout(() => {
  //       // element.innerHTML = 'Want to Double your Prize?'
  //       // element.style.opacity = '1'
  //       element.style.display = 'none'
  //     }, 2000)
  //   }
  // }, [])

  const createdReferral =
    data?.createReferral?.__typename === 'CreateReferralResponseSuccess' ? data.createReferral.referral : undefined

  const inviteImage = createdReferral?.inviteGraphic

  const image: string = chosenLootbox?.stampImage
    ? convertFilenameToThumbnail(chosenLootbox?.stampImage, 'sm')
    : TEMPLATE_LOOTBOX_STAMP

  const inviteURL = `${manifest.microfrontends.webflow.referral}?r=${createdReferral?.slug}`

  return (
    <$ViralOnboardingCard background={background2} opacity={'0.75'}>
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
        <$Vertical style={{ overflowY: 'scroll', height: '85%', overflowX: 'hidden' }}>
          <div style={{ paddingTop: '3.5rem' }} />
          <$PaddingWrapper style={{ padding: '0px 1.8rem' }}>
            {/* <$Heading id={HEADER_TEXT_EL_ID} style={{ textTransform: 'uppercase', textAlign: 'start' }}>
              ✅ Success!
            </$Heading> */}
            <$Heading style={{ textTransform: 'uppercase', textAlign: 'start' }}>Want to Double your Prize?</$Heading>
          </$PaddingWrapper>
          <$PaddingWrapper
            style={{
              padding: '0px 1.8rem',
            }}
          >
            <$SmallText
              style={{
                textAlign: 'start',
                marginTop: '0px',
              }}
            >
              You get <b>extra tickets</b> for each friend referred!
            </$SmallText>
          </$PaddingWrapper>

          <$PaddingWrapper
            style={{
              padding: '0px 1.8rem',
            }}
          >
            <$SmallText
              style={{
                textAlign: 'start',
                marginTop: '8px',
              }}
            >
              {loadingCreateReferral && <$Spinner />}
              <br />
              {loadingCreateReferral ? (
                <i>Creating your unique referral link...</i>
              ) : (
                <span>
                  Your unique referral link 👉&nbsp;
                  <b>{inviteURL}</b>
                </span>
              )}
            </$SmallText>
          </$PaddingWrapper>
          <br />
          <br />
          {createdReferral && (
            <$PaddingWrapper style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <$PartyBasketImage
                src={inviteImage || image}
                themeColor={chosenLootbox?.themeColor}
                style={{
                  transform: 'rotate(-25deg) translateX(16px)',
                }}
              />
              <$PartyBasketImage
                src={inviteImage || image}
                themeColor={chosenLootbox?.themeColor}
                style={{
                  transform: 'rotate(25deg) translateX(-16px)',
                }}
              />
            </$PaddingWrapper>
          )}
          {createdReferral && !!chosenLootbox?.nftBountyValue && (
            <$PaddingWrapper>
              <$SupressedParagraph style={{ width: '80%', margin: '0px auto 0px', fontStyle: 'italic' }}>
                {chosenLootbox.nftBountyValue}
              </$SupressedParagraph>
            </$PaddingWrapper>
          )}
          {createdReferral && [<br key="b1" />, <br key="b2" />, <br key="b3" />, <br key="b4" />]}
        </$Vertical>
        <$FloatingContainer>
          <$OpacityGradient />
          <$PaddingWrapper style={{ padding: '0px 1.6rem' }}>
            <$Heading style={{ marginTop: '0px', marginBottom: '8px' }}>
              <$NextButton
                onClick={() => {
                  if (createdReferral) {
                    navigator.clipboard.writeText(inviteURL)
                  }
                }}
                color={COLORS.trustFontColor}
                backgroundColor={loadingCreateReferral ? COLORS.surpressedBackground : COLORS.trustBackground}
                style={{
                  width: '100%',
                }}
                disabled={loadingCreateReferral}
              >
                Copy & Share Invite
              </$NextButton>
            </$Heading>
            {createdReferral?.inviteGraphic && (
              <a style={{ textDecoration: 'none' }} download href={createdReferral.inviteGraphic} target="_blank">
                <$NextButton
                  color={COLORS.trustFontColor}
                  backgroundColor="transparent"
                  style={{
                    width: '100%',
                    boxShadow: 'none',
                    fontSize: TYPOGRAPHY.fontSize.medium,
                  }}
                  disabled={loadingCreateReferral}
                >
                  Download Image
                </$NextButton>
              </a>
            )}
            <$Heading
              style={{
                marginTop: '0px',
                fontSize: TYPOGRAPHY.fontSize.medium,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
              }}
              onClick={props.onNext}
            >
              Skip
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

const $PartyBasketImage = styled.img<{ themeColor?: string }>`
  max-height: 180px;
  background-size: cover;
  object-fit: contain;
  margin: 20px auto;
  filter: drop-shadow(0px 0px 25px ${(props) => props.themeColor || '#ffffff'});
`

const $OpacityGradient = styled.div`
  height: 50px;
  top: -50px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 80%);
  position: absolute;
  width: 100%;
`

export default DoubleUp
