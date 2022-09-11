/**
 * Example from https://videojs.com/guides/react/
 */
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoProps {
  onReady: (player: VideoJsPlayer) => void
  options: VideoJsPlayerOptions
  style: { [key: string]: string }
}
export const Video = (props: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { options, onReady, style } = props

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) return

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log('player is ready')
        onReady && onReady(player)
      }))

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player style={{ ...props.style }}>
      <$Video ref={videoRef} className="video-js vjs-big-play-centered vjs-show-big-play-button-on-pause" />
    </div>
  )
}

const $Video = styled.video``

export default Video
