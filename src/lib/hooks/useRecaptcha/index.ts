import { RecaptchaVerifier } from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import { useEffect, useState } from 'react'

export const useRecaptcha = () => {
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)

  useEffect(() => {
    const el = document.getElementById('recaptcha-container')
    if (!!el) {
      const recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
        auth
      )
      setRecaptchaVerifier(recaptchaVerifier)
    }
  }, [])

  return {
    recaptchaVerifier,
  }
}
