import React, { CSSProperties, FunctionComponent, useState } from 'react'

const nAttempts = 3

interface ImageWithReloadProps {
  imageUrl: string
  alt: string
  style: CSSProperties
  fallbackImageUrl?: string
}
const ImageWithReload: FunctionComponent<ImageWithReloadProps> = (props) => {
  const [imageUrl, setImageUrl] = useState(props.imageUrl)
  const [_imageError, setImageError] = useState(false)
  const [attempts, setNAttempts] = useState<number>(0)

  const randomBish = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const handleError = () => {
    if (attempts > nAttempts) {
      if (props.fallbackImageUrl) {
        setImageUrl(props.fallbackImageUrl)
      }
      return
    }
    setNAttempts(attempts + 1)
    console.log('error')
    const timeout = setTimeout(() => {
      const url = new URL(props.imageUrl)
      url.searchParams.append('errnonce', `${randomBish(0, 100000)}`)
      setImageError(true)
      setImageUrl(url.toString()) // Set the src attribute to a new URL to trigger the image to be reloaded
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }

  return <img src={imageUrl} alt={props.alt} onError={handleError} style={props.style} />
}

export default ImageWithReload
