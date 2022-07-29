import { COLORS } from '@wormgraph/helpers'
import { Stream, StreamType } from 'lib/api/graphql/generated/types'
import React from 'react'
import styled from 'styled-components'
// import { $p, $Vertical } from '../Generics'
// import Spinner from '../Generics/Spinner'

interface Props {
  stream: Stream
}
const LiveStreamVideo = (props: Props) => {
  let embededSrc: string
  const encodedVideoUrl = encodeURIComponent(props.stream.url)
  if (props.stream.type === StreamType.Facebook) {
    embededSrc = `https://www.facebook.com/plugins/video.php?href=${encodedVideoUrl}&show_text=false&appId`
  } else if (props.stream.type === StreamType.Youtube) {
    embededSrc = `https://www.youtube.com/embed/${encodedVideoUrl}`
  } else {
    // twitch
    embededSrc = `https://player.twitch.tv/?channel=${encodedVideoUrl}&parent=lootbox.fund`
  }
  return (
    <FrameWrapper>
      <$Frame
        src={embededSrc}
        width="100%"
        height="100%"
        style={{
          border: 'none',
          overflow: 'hidden',
        }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen={true}
      ></$Frame>
    </FrameWrapper>
  )
}

const FrameWrapper = ({ children }: { children: React.ReactElement }) => {
  return (
    <$FrameWrapper>
      {/* <$Vertical
        spacing={2}
        style={{
          position: 'absolute',
          top: '150px',
          left: '45%',
          zIndex: -1,
        }}
      >
        <Spinner color={`${COLORS.white}`} size="50px" margin="0 auto" />
        <$p
          style={{
            color: COLORS.white,
          }}
        >
          Loading stream...
        </$p>
      </$Vertical> */}

      {children}
    </$FrameWrapper>
  )
}

const $FrameWrapper = styled.div`
  background: ${COLORS.surpressedBackground};
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
  background: #16222a; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #3a6073, #16222a); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #3a6073,
    #16222a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`

const $Frame = styled.iframe`
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
`

export default LiveStreamVideo
