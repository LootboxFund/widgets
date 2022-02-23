import { Url } from '@lootboxfund/helpers'
import { useEffect } from 'react'

// used in storybook
const useHtmlScript = ({
  src,
  integrity,
  referrerpolicy,
  crossorigin,
  async = true,
}: {
  src: string
  integrity?: string
  referrerpolicy?: string
  crossorigin?: string
  async?: boolean
}) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = src
    script.async = async

    if (integrity) {
      script.integrity = integrity
    }
    if (referrerpolicy) {
      script.referrerPolicy = referrerpolicy
    }
    if (crossorigin) {
      script.crossOrigin = crossorigin
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [src])
}

export default useHtmlScript

export const useHtmlFirebaseStorage = () => {
  return useHtmlScript({
    src: 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.6.7/firebase-storage.min.js',
    integrity: 'sha512-gRzMEop/651/AhL7PbJJhjr5hBOKZ99B4FU7demptVlkSVpdJpFgwGpIjeR/HpahEDzbcfdWz4YUnmG072wcxg==',
    crossorigin: 'anonymous',
    referrerpolicy: 'no-referrer',
  })
}
