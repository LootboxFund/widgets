import { $span, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { TEMPLATE_LOOTBOX_STAMP, DEFAULT_NOOB_CUP_INFOGRAPHIC } from 'lib/hooks/constants'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'
import { $Heading, $NextButton, $SlideInFooter, $SubHeading } from '../contants'
import { useEffect, useRef, useState } from 'react'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import Video from './Video'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { ClaimID, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { loadAdTrackingPixel } from 'lib/utils/pixel'
import { AdEventAction } from 'lib/api/graphql/generated/types'
import { useAuth } from 'lib/hooks/useAuth'
import { manifest } from 'manifest'

const DEFAULT_THEME_COLOR = COLORS.trustBackground
const startingTime = 30 // seconds

interface Props {
  onNext: () => void
  onBack: () => void
}
const AdTemplate1 = (props: Props) => {
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { referral, chosenPartyBasket, ad, sessionId, claim } = useViralOnboarding()
  const words = useWords()
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isFinalScreen, setIsFinalScreen] = useState(false)

  useEffect(() => {
    if (isFinalScreen) {
      setTimeLeft(startingTime)
    }
  }, [isFinalScreen])

  useEffect(() => {
    if (timeLeft === null) {
      return
    }
    if (timeLeft === 0) {
      // Write that the timer ran out in the database
      // TODO
      console.log('timer ran out')
    }
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
    return
  }, [timeLeft])

  const themeColor = ad?.creative?.themeColor || DEFAULT_THEME_COLOR

  const _lb = !!chosenPartyBasket?.lootboxAddress
    ? referral?.tournament?.lootboxSnapshots?.find((snap) => snap.address === chosenPartyBasket.lootboxAddress)
    : undefined

  const image: string = _lb?.stampImage ? convertFilenameToThumbnail(_lb.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP

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

  const toggleFinalScreen = () => {
    setIsFinalScreen(!isFinalScreen)
  }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player

    player.on('ready', () => {
      if (ad) {
        loadAdTrackingPixel({
          adId: ad.id,
          sessionId,
          eventAction: AdEventAction.View,
          claimId: claim?.id || ('' as ClaimID),
        })
      }
      player.play()
    })

    player.on('ended', () => {
      console.log('DONE!')
      setIsFinalScreen(true)
    })
  }

  const onCallToActionClick = () => {
    if (!ad) {
      return
    }

    loadAdTrackingPixel({
      adId: ad.id,
      sessionId,
      eventAction: AdEventAction.Click,
      claimId: claim?.id || ('' as ClaimID),
    })

    if (ad?.creative.url) {
      window.open(ad.creative.url, '_blank')
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

  if (isFinalScreen) {
    return (
      <$ViralOnboardingCard style={{ position: 'relative' }} backgroundColor="#ffffff">
        <$ViralOnboardingSafeArea style={{ paddingTop: '0rem', overflowY: 'hidden' }}>
          <$Vertical>
            <$Vertical>
              <$Heading style={{ color: themeColor, marginBottom: '0px' }}>
                {`0:${String(timeLeft).length > 1 ? String(timeLeft) : '0' + String(timeLeft)}`}
              </$Heading>
              <$SubHeading
                style={{
                  color: themeColor,
                  textTransform: 'uppercase',
                  fontWeight: TYPOGRAPHY.fontWeight.light,
                  margin: '0.6rem auto',
                }}
              >
                OFFER ENDS
              </$SubHeading>
            </$Vertical>
            <$Infographic
              src={ad?.creative?.infographicLink || DEFAULT_NOOB_CUP_INFOGRAPHIC}
              alt="Earn REAL MONEY in the Beginner's Cup"
            />
          </$Vertical>
        </$ViralOnboardingSafeArea>
        <$SlideInFooter themeColor={themeColor} preventDefault delay="0s">
          <$Vertical spacing={2}>
            <$NextButton
              onClick={onCallToActionClick}
              color={COLORS.trustBackground}
              backgroundColor={COLORS.white}
              style={{ marginTop: '30px', marginLeft: '15px', marginRight: '15px' }}
              disabled={false}
            >
              <LoadingText
                loading={false}
                color={COLORS.white}
                text={ad?.creative.callToActionText || 'Download Game'}
              />
            </$NextButton>
            <a
              href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`}
              style={{ textAlign: 'center' }}
            >
              <$span
                style={{
                  color: COLORS.white,
                  textDecoration: 'underline',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontWeight: TYPOGRAPHY.fontWeight.light,
                  cursor: 'pointer',
                }}
              >
                skip
              </$span>
            </a>
          </$Vertical>
        </$SlideInFooter>
      </$ViralOnboardingCard>
    )
  }

  return (
    <$ViralOnboardingCard style={{ position: 'relative' }}>
      {ad?.creative?.creativeType === 'video' && (
        <Video
          options={videoJsOptions}
          onReady={handlePlayerReady}
          videoPosition="top"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '600px',
            position: 'absolute',
          }}
        />
      )}

      <$FloatingCover>
        <$ViralOnboardingSafeArea style={{ overflowY: 'hidden' }}>
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
            color={COLORS.trustBackground}
            backgroundColor={COLORS.white}
            style={{ marginTop: '60px', marginLeft: '15px', marginRight: '15px' }}
            disabled={false}
          >
            <LoadingText loading={false} color={COLORS.white} text={ad?.creative.callToActionText || 'Download Game'} />
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
            onClick={toggleFinalScreen}
          >
            skip
          </$span>
        </$Vertical>
      </$SlideInFooter>
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
}
`

const $Video = styled.video`
  width: 100%;
  height: 100%;
  max-width: 600px;
  position: absolute;
  object-fit: cover;
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

const $Emblem = styled.img`
  max-width: 240px;
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

const $Infographic = styled.img`
  width: 100%;
  margin-bottom: 150px;
`

export default AdTemplate1
