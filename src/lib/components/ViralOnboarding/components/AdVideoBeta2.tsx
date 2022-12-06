import { $span, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'
import { $Heading, $NextButton, $SlideInFooter } from '../contants'
import { useRef } from 'react'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import Video from './Video'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { AdID, AdSetID, AffiliateID, COLORS, FlightID, OfferID, TYPOGRAPHY } from '@wormgraph/helpers'
import { loadAdTrackingPixel } from 'lib/utils/pixel'
import { AdEventAction } from 'lib/api/graphql/generated/types'
import { useAuth } from 'lib/hooks/useAuth'

const DEFAULT_THEME_COLOR = COLORS.trustBackground

interface Props {
  nextUrl: string
  onNext: () => void
  onBack: () => void
}
const AdVideoBeta2 = (props: Props) => {
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { referral, chosenPartyBasket, chosenLootbox, ad, sessionId, claim } = useViralOnboarding()
  const words = useWords()
  const { user } = useAuth()

  const themeColor = ad?.creative?.themeColor || DEFAULT_THEME_COLOR

  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string = chosenLootbox?.stampImage
    ? convertFilenameToThumbnail(chosenLootbox.stampImage, 'sm')
    : _lb?.stampImage
    ? convertFilenameToThumbnail(_lb.stampImage, 'sm')
    : TEMPLATE_LOOTBOX_STAMP

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: true,
    controls: false,
    muted: true,
    responsive: true,
    loop: false,
    // bigPlayButton: true,
    retryOnError: true,
    // fluid: true,
    poster: ad?.creative?.thumbnail,
    // fill: true,
    // aspectRatio: ad?.creative?.creativeAspectRatio || '9:16',
    sources: ad?.creative?.creativeLinks
      ? ad.creative.creativeLinks.map((link: string) => {
          return {
            src: link,
            type: `video/${
              link.toLowerCase().endsWith('webm') ? 'webm' : link.toLowerCase().endsWith('ogv') ? 'ogv' : 'mp4'
            }`,
          }
        })
      : [],
  }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player

    player.on('ready', () => {
      if (ad) {
        loadAdTrackingPixel({
          adID: ad.adID as AdID,
          sessionID: sessionId,
          eventAction: AdEventAction.View,
          claimID: claim?.id,
          userID: user?.id,
          adSetID: ad.adSetID as AdSetID,
          offerID: ad.offerID as OfferID,
          campaignID: undefined,
          tournamentID: referral?.tournamentId,
          promoterID: referral.promoterId as AffiliateID,
          flightID: ad.flightID as FlightID,
          nonce: undefined,
          timeElapsed: undefined,
        })
      }
      player.play()
      setTimeout(() => {
        player.muted(false)
      }, 5000)
    })

    player.on('ended', () => {
      console.log('DONE!')
      props.onNext()
    })
  }

  const onCallToActionClick = () => {
    if (!ad) {
      return
    }

    loadAdTrackingPixel({
      adID: ad.adID as AdID,
      sessionID: sessionId,
      eventAction: AdEventAction.Click,
      claimID: claim?.id,
      userID: user?.id,
      adSetID: ad.adSetID as AdSetID,
      offerID: ad.offerID as OfferID,
      campaignID: undefined,
      tournamentID: referral?.tournamentId,
      organizerID: undefined,
      promoterID: referral.promoterId as AffiliateID,
      flightID: ad.flightID as FlightID,
      nonce: undefined,
      timeElapsed: undefined,
    })

    if (ad?.clickDestination) {
      window.open(ad.clickDestination, '_blank')
    }
  }

  const handleVideoClick = () => {
    if (!playerRef?.current) {
      return
    }
    if (playerRef.current?.paused()) {
      console.log('video not playing... playing')
      playerRef.current.play()
    } else if (!playerRef.current?.paused() && !!playerRef?.current) {
      console.log('video playing... pausing')
      playerRef.current.pause()
    }
  }

  // if (isFinalScreen) {
  //   return (
  //     <$ViralOnboardingCard style={{ position: 'relative' }} backgroundColor="#ffffff">
  //       <$ViralOnboardingSafeArea style={{ paddingTop: '0rem', overflowY: 'hidden' }}>
  //         <$Vertical>
  //           <$Vertical>
  //             <$Heading style={{ color: themeColor, marginBottom: '0px' }}>
  //               {`0:${String(timeLeft).length > 1 ? String(timeLeft) : '0' + String(timeLeft)}`}
  //             </$Heading>
  //             <$SubHeading
  //               style={{
  //                 color: themeColor,
  //                 textTransform: 'uppercase',
  //                 fontWeight: TYPOGRAPHY.fontWeight.light,
  //                 margin: '0.6rem auto',
  //               }}
  //             >
  //               OFFER ENDS
  //             </$SubHeading>
  //           </$Vertical>
  //           <$Infographic
  //             src={ad?.creative?.infographicLink || DEFAULT_NOOB_CUP_INFOGRAPHIC}
  //             alt="Earn REAL MONEY in the Beginner's Cup"
  //           />
  //         </$Vertical>
  //       </$ViralOnboardingSafeArea>
  //       <$SlideInFooter themeColor={themeColor} preventDefault delay="0s">
  //         <$Vertical spacing={2}>
  //           <$NextButton
  //             onClick={onCallToActionClick}
  //             color={ad?.creative.themeColor || COLORS.trustBackground}
  //             backgroundColor={COLORS.white}
  //             style={{ marginTop: '30px', marginLeft: '15px', marginRight: '15px' }}
  //             disabled={false}
  //           >
  //             <LoadingText
  //               loading={false}
  //               color={ad?.creative.themeColor || COLORS.white}
  //               text={ad?.creative.callToAction || 'Download Game'}
  //             />
  //           </$NextButton>
  //           <a
  //             href={props.nextUrl || `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`}
  //             style={{ textAlign: 'center' }}
  //           >
  //             <$span
  //               style={{
  //                 color: COLORS.white,
  //                 textDecoration: 'underline',
  //                 fontStyle: 'italic',
  //                 textAlign: 'center',
  //                 fontWeight: TYPOGRAPHY.fontWeight.light,
  //                 cursor: 'pointer',
  //               }}
  //             >
  //               skip
  //             </$span>
  //           </a>
  //         </$Vertical>
  //       </$SlideInFooter>
  //     </$ViralOnboardingCard>
  //   )
  // }

  return (
    <$ViralOnboardingCard style={{ position: 'relative' }}>
      {ad?.creative?.creativeType === 'video' && (
        <Video
          options={videoJsOptions}
          onReady={handlePlayerReady}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '600px',
            position: 'absolute',
          }}
        />
      )}
      {ad?.creative.creativeType === 'image' && (
        <div>
          <img src={ad?.creative?.creativeLinks[0]} style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      <$FloatingCover>
        <$ViralOnboardingSafeArea style={{ overflowY: 'hidden', height: '100%' }}>
          <$Vertical style={{ height: '100%', justifyContent: 'center' }} onClick={handleVideoClick}>
            <$ContainerSlide slideOff delay={['2.5s']}>
              <$CenteredContent>
                <$PaddingWrapper style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <$PartyBasketImage src={image} />
                </$PaddingWrapper>
                <$PaddingWrapper>
                  <$Heading style={{ textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {'✅ '}
                    {words.success}
                  </$Heading>
                </$PaddingWrapper>
              </$CenteredContent>
            </$ContainerSlide>
          </$Vertical>
        </$ViralOnboardingSafeArea>
      </$FloatingCover>
      <$SlideInFooter themeColor={themeColor} delay="3s">
        <$Vertical spacing={2}>
          <$NextButton
            onClick={onCallToActionClick}
            color={ad?.creative.themeColor || COLORS.trustBackground}
            backgroundColor={COLORS.white}
            style={{ marginTop: '60px', marginLeft: '15px', marginRight: '15px' }}
            disabled={false}
          >
            <LoadingText
              loading={false}
              color={ad?.creative.themeColor || COLORS.white}
              text={ad?.creative.callToAction || 'Get Offer'}
            />
          </$NextButton>
          <$span
            style={{
              color: COLORS.white,
              textDecoration: 'underline',
              fontStyle: 'italic',
              textAlign: 'center',
              fontWeight: TYPOGRAPHY.fontWeight.light,
              cursor: 'pointer',
            }}
            onClick={props.onNext}
          >
            skip
          </$span>
        </$Vertical>
      </$SlideInFooter>
    </$ViralOnboardingCard>
  )
}

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

const $FloatingCover = styled.div`
  width: 100%;
  height: 100%;
  max-width: 600px;
  position: absolute;

  @-webkit-keyframes fadeIn {
    from {
      background-color: rgba(0, 0, 0, 1);
    }
    to {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  @keyframes fadeIn {
    from {
      background-color: rgba(0, 0, 0, 1);
    }
    to {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  -webkit-animation: fadeIn 5s forwards;
  animation: fadeIn 5s forwards;

  z-index: 2;
`

const $CenteredContent = styled.div`
  position: relative;
  left: -50%;
`

const $ContainerSlide = styled.div<{ slideOn?: boolean; slideOff?: boolean; delay?: string[] }>`
  position: absolute;
  left: ${(props) => (props.slideOn ? '150%' : '50%')};

  ${(props) => {
    const res = []
    if (props.slideOn) {
      res.push('slideOnscreen 1s forwards')
    }
    if (props.slideOff) {
      res.push('slideOffscreen 1s forwards')
    }

    if (res.length === 0) {
      return ''
    }

    return `-webkit-animation: ${res.join(',')}; animation: ${res.join(',')};`
  }}

  ${(props) =>
    props.delay ? `-webkit-animation-delay: ${props.delay.join(',')};animation-delay: ${props.delay.join(',')};` : ''}

  @-webkit-keyframes slideOffscreen {
    100% {
      left: -100%;
    }
  }

  @keyframes slideOffscreen {
    100% {
      left: -100%;
    }
  }

  @-webkit-keyframes slideOnscreen {
    100% {
      left: 50%;
    }
  }

  @keyframes slideOnscreen {
    100% {
      left: 50%;
    }
  } ;
`

export default AdVideoBeta2
