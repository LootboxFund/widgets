import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import styled from 'styled-components'
import { $Heading, $NextButton, $SmallText, $SupressedParagraph, background2 } from '../contants'
import { useEffect, useState } from 'react'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { useMutation } from '@apollo/client'
import { MutationCreateReferralArgs, ReferralType, ResponseError } from 'lib/api/graphql/generated/types'
import { CreateReferralResponseFE, CREATE_REFERRAL } from 'lib/components/Referral/CreateLootboxReferral/api.gql'
import { manifest } from 'manifest'
import $Spinner from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import ImageWithReload from 'lib/components/ImageWithReload'

interface Props {
  onNext: () => void
  onBack: () => void
}
const DoubleUp = (props: Props) => {
  const { referral, chosenLootbox } = useViralOnboarding()
  const { screen } = useWindowSize()
  const [isCopied, setIsCopied] = useState(false)
  const [isLoadingImage, setIsLoadingImage] = useState(true)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied, setIsCopied])

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
    onCompleted: (data) => {
      if (data?.createReferral?.__typename === 'CreateReferralResponseSuccess') {
        console.log('Created referral', data.createReferral)
        setTimeout(() => {
          // Super awkward, we need to async wait for the image resizer to run
          setIsLoadingImage(false)
        }, 4000)
      } else {
        console.log('Error creating referral', data.createReferral)
      }
    },
  })

  useEffect(() => {
    createReferral()
  }, [])

  const createdReferral =
    data?.createReferral?.__typename === 'CreateReferralResponseSuccess' ? data.createReferral.referral : undefined

  // const inviteImage = createdReferral?.inviteGraphic
  //   ? convertFilenameToThumbnail(createdReferral.inviteGraphic, 'md')
  //   : undefined
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
          paddingBottom: '5rem',
        }}
      >
        <$Vertical style={{ overflowY: 'scroll', height: '85%', overflowX: 'hidden' }}>
          <div style={{ paddingTop: '2rem' }} />
          <$PaddingWrapper style={{ padding: '0px 1.8rem' }}>
            {/* <$Heading id={HEADER_TEXT_EL_ID} style={{ textTransform: 'uppercase', textAlign: 'start' }}>
              ✅ Success!
            </$Heading> */}
            {screen === 'mobile' ? (
              <$Heading style={{ textTransform: 'uppercase', textAlign: 'start' }}>Double your Prize?</$Heading>
            ) : (
              <$Heading style={{ textTransform: 'uppercase', textAlign: 'start' }}>Want to Double your Prize?</$Heading>
            )}
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
              {loadingCreateReferral && <br />}
              {loadingCreateReferral && <$Spinner />}
              <br />
              {loadingCreateReferral ? (
                <i>Creating your unique referral link... Please wait.</i>
              ) : (
                <div>
                  <span>
                    Your unique referral link 👉&nbsp;
                    <b>{inviteURL}</b>
                    &nbsp;
                  </span>
                  <span>
                    <CopyIcon text={inviteURL} smallWidth={18} />
                  </span>
                </div>
              )}
            </$SmallText>
          </$PaddingWrapper>
          <br />
          <br />
          {createdReferral && (
            <div>
              {isLoadingImage ? (
                <$PaddingWrapper
                  style={{
                    padding: '0px 1.8rem',
                  }}
                >
                  <$Spinner />
                  <br />
                  <$SmallText
                    style={{
                      textAlign: 'start',
                      marginTop: '8px',
                    }}
                  >
                    Creating your Invite Graphic. Please wait a moment...
                  </$SmallText>
                </$PaddingWrapper>
              ) : (
                // Super awkward... our stamps are HUGE, so we need to wait ASYNC for the image resizer to happen
                <$PaddingWrapper style={{ display: 'flex', flexDirection: 'column' }}>
                  <ImageWithReload
                    imageUrl={inviteImage ? convertFilenameToThumbnail(inviteImage, 'md') : image}
                    fallbackImageUrl={inviteImage}
                    alt={'Your Invite Graphic... Please wait while it loads.'}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      backgroundSize: 'cover',
                      objectFit: 'contain',
                      margin: '20px auto',
                      filter: 'drop-shadow(0px 0px 25px #ffffff)',
                      color: '#ffffff',
                      fontFamily: TYPOGRAPHY.fontFamily.regular,
                    }}
                  />
                  {!!chosenLootbox?.nftBountyValue && (
                    <$PaddingWrapper>
                      <$SupressedParagraph style={{ width: '80%', margin: '0px auto 0px', fontStyle: 'italic' }}>
                        {chosenLootbox.nftBountyValue}
                      </$SupressedParagraph>
                    </$PaddingWrapper>
                  )}
                  <br />
                  <$SmallText
                    style={{
                      textAlign: 'start',
                      marginTop: '8px',
                    }}
                  >
                    Your friends can <b>scan the QR code</b> above to claim their ticket 🚀
                  </$SmallText>
                  <br />
                </$PaddingWrapper>
              )}
            </div>
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
                    try {
                      const txtToCopy = `Come join my event & collect our LOOTBOX tickets so that you can win FREE stuff! \n${inviteURL}`
                      navigator.clipboard.writeText(txtToCopy)
                      setIsCopied(true)
                    } catch (err) {
                      console.error(err)
                    }
                  }
                }}
                color={COLORS.trustFontColor}
                backgroundColor={loadingCreateReferral ? COLORS.surpressedBackground : COLORS.trustBackground}
                style={{
                  width: '100%',
                }}
                disabled={loadingCreateReferral}
              >
                {isCopied ? '✅ Copied' : 'Copy & Share Invite'}
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
                marginTop: createdReferral ? '0px' : '24px',
                fontSize: TYPOGRAPHY.fontSize.medium,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                cursor: 'pointer',
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
  width: 100%;
  max-width: 300px;
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
