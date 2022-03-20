import { Url } from '@wormgraph/helpers'
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

export const useHtmlEthers = () => {
  return useHtmlScript({
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.5.4/ethers.umd.min.js',
    integrity: 'sha512-xmbPx0riylir51GhTZCFd20yS7NYZNpfDTbEWBjDRzs+UaGb2RyjtASTVtF2ydQWp3xkso9j4sJj39PdSH8/EA==',
    crossorigin: 'anonymous',
    referrerpolicy: 'no-referrer',
  })
}

export const useHtmlWeb3 = () => {
  return useHtmlScript({
    src: 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.0/web3.min.js',
    integrity: 'sha512-C63V0mFzwl8KV2fRz0QJNKX0d9877urOLSUq5WUq8nUOhDl69hKdGr9mAvl57k47GNjqEMAtiufsvDnk7xs8+w==',
    crossorigin: 'anonymous',
    referrerpolicy: 'no-referrer',
  })
}

export const useHtmlFirebaseStorage = () => {
  return useHtmlScript({
    src: 'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.6.7/firebase-storage.min.js',
    integrity: 'sha512-gRzMEop/651/AhL7PbJJhjr5hBOKZ99B4FU7demptVlkSVpdJpFgwGpIjeR/HpahEDzbcfdWz4YUnmG072wcxg==',
    crossorigin: 'anonymous',
    referrerpolicy: 'no-referrer',
  })
}
