import { sendEmailVerification } from 'firebase/auth'
import { $h1, $Vertical } from 'lib/components/Generics'
import { useAuth } from 'lib/hooks/useAuth'
import { auth } from 'lib/api/firebase/app'
import LogRocket from 'logrocket'
import { useState } from 'react'
import { $Link, Oopsies } from '../common'
import { COLORS } from '@wormgraph/helpers'

const Onboarding = () => {
  const { user } = useAuth()
  const isOnboardYoutube = localStorage.getItem('user.onboard.youtube')
  const isEmailVerified = user?.isEmailVerified
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [errorSendingEmail, setErrorSendingEmail] = useState(false)

  if (isEmailVerified && isOnboardYoutube) {
    return null
  }

  const handleSendVerificationEmail = () => {
    const user = auth.currentUser
    if (user && !isEmailSent) {
      sendEmailVerification(user)
        .then(() => {
          // Prevent spam, only allow one email to be sent
          setIsEmailSent(true)
          setErrorSendingEmail(false)
        })
        .catch((err) => {
          setErrorSendingEmail(true)
          LogRocket.captureException(err)
        })
    }
  }

  const handleYoutubeClick = () => {
    localStorage.setItem('user.onboard.youtube', 'true')
  }

  return (
    <$Vertical spacing={4}>
      <$h1>You're almost set up...</$h1>
      {!isEmailVerified ? (
        <Oopsies
          icon="📧"
          title="Verify your email"
          message={
            <span>
              You should have received an email from us. Check your spam folder. Can't find it?{' '}
              <$Link target="_blank" onClick={handleSendVerificationEmail} style={{ textDecoration: 'underline' }}>
                Resend verification email.
              </$Link>
              {isEmailSent && ' ✅'}
              {errorSendingEmail && (
                <span style={{ fontStyle: 'italic', color: `${COLORS.surpressedFontColor}77` }}>
                  {' '}
                  There was an error sending the email. Please try again later.
                </span>
              )}
            </span>
          }
        />
      ) : null}

      {!isOnboardYoutube ? (
        <Oopsies
          icon="👨‍🎓"
          title="Learn about Lootbox"
          message={
            <span>
              Start off by checking out our youtube channel. Find us here 👉{' '}
              <$Link
                target="_blank"
                onClick={handleYoutubeClick}
                href="https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC"
              >
                Getting started with Lootbox.
              </$Link>
            </span>
          }
        />
      ) : null}
    </$Vertical>
  )
}

export default Onboarding
