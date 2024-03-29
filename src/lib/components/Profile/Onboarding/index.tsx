import { sendEmailVerification } from 'firebase/auth'
import { $h1, $Vertical } from 'lib/components/Generics'
import { useAuth } from 'lib/hooks/useAuth'
import { auth } from 'lib/api/firebase/app'
import LogRocket from 'logrocket'
import { useState } from 'react'
import { $Link, $ProfileSectionContainer, Oopsies } from '../common'
import { COLORS } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import useWindowSize from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'

const Onboarding = () => {
  const { user } = useAuth()
  console.log(`onboarding user <Profile/Onboarding>`, user)
  const { screen } = useWindowSize()
  // const isOnboardYoutube = localStorage.getItem('user.onboard.youtube')
  console.log('user', user)
  const showEmailVerification = !!user?.email && !user?.isEmailVerified
  const showPhone = !user?.phone
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [errorSendingEmail, setErrorSendingEmail] = useState(false)
  const intl = useIntl()
  const words = useWords()

  const verifyEmailHeader = intl.formatMessage({
    id: 'profile.onboarding.verifyEmailHeader',
    defaultMessage: 'Verify your email',
    description: 'Header for onboarding step. Part of onboarding is a user needs to verify their email address.',
  })

  // const learnHeader = intl.formatMessage({
  //   id: 'profile.onboarding.learnHeader',
  //   defaultMessage: 'Learn about Lootbox',
  //   description: 'Header for onboarding step. Part of onboarding is a user needs to learn how to use Lootbox.',
  // })

  if (!showEmailVerification && !showPhone) {
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

  // const handleYoutubeClick = () => {
  //   localStorage.setItem('user.onboard.youtube', 'true')
  // }

  return (
    <$ProfileSectionContainer screen={screen}>
      <$Vertical spacing={4}>
        <$h1 style={{ fontStyle: 'italic' }}>{words.yourAlmostSetup}</$h1>
        {user?.isAnonymous ? (
          <Oopsies
            icon="🥷"
            title="Your account is not verified"
            message={
              <span>
                You should have received a login email. Please check your email for a link to verify your account. This
                email expires after 4 hours. Check your spam folder.
              </span>
            }
          />
        ) : null}
        {showEmailVerification ? (
          <Oopsies
            icon="📧"
            title={verifyEmailHeader}
            message={
              <span>
                <FormattedMessage
                  id="profile.onboarding.verifyEmailText"
                  defaultMessage="You should have received an email from us. {checkSpamFolderText}{newlineCharacter}Can't find it? {resendVerificationEmail}"
                  description="This is the message that tells the user to verify their email address."
                  values={{
                    checkSpamFolderText: (
                      <mark>
                        <FormattedMessage
                          id="profile.onboarding.checkSpamFolderText"
                          defaultMessage="Check your spam folder."
                          description="This is the text that tells the user to check their spam folder."
                        />
                      </mark>
                    ),
                    newlineCharacter: <br />,
                    resendVerificationEmail: (
                      <$Link
                        target="_blank"
                        onClick={handleSendVerificationEmail}
                        style={{ textDecoration: 'underline' }}
                      >
                        <FormattedMessage
                          id="profile.onboarding.resendVerificationEmailLink"
                          defaultMessage="Resend verification email."
                          description="This is the link that will send the user a verification email."
                        />
                      </$Link>
                    ),
                  }}
                />
                {isEmailSent && ' ✅'}
                {errorSendingEmail && (
                  <span style={{ fontStyle: 'italic', color: `${COLORS.surpressedFontColor}77` }}>
                    {' '}
                    {words.anErrorOccured}. {words.pleaseTryAgainLater}.
                  </span>
                )}
              </span>
            }
          />
        ) : null}

        {showPhone ? (
          <Oopsies
            icon="📲"
            title="Add Phone Number"
            message={
              <span>
                <b>You cannot claim your rewards</b> until you add a phone number to your account.
                <$Link href={manifest.microfrontends.webflow.anonSignup} style={{ textDecoration: 'underline' }}>
                  Click here to add your Phone Number.
                </$Link>
              </span>
            }
          />
        ) : null}

        {/* {!isOnboardYoutube ? (
          <Oopsies
            icon="👨‍🎓"
            title={learnHeader}
            message={
              <FormattedMessage
                id="profile.onboarding.learnText"
                defaultMessage="Start off by checking out our youtube channel. Find us here 👉 {lootboxYoutubeLink}"
                description="This is the message that tells the user to learn about Lootbox via our Youtube channel."
                values={{
                  lootboxYoutubeLink: (
                    <$Link
                      target="_blank"
                      onClick={handleYoutubeClick}
                      href="https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC"
                    >
                      <FormattedMessage
                        id="profile.onboarding.lootboxYoutubeLink"
                        defaultMessage="Getting started with Lootbox."
                        description="This is the link that will take the user to the Youtube channel."
                      />
                    </$Link>
                  ),
                }}
              />
            }
          />
        ) : null} */}
      </$Vertical>
    </$ProfileSectionContainer>
  )
}

export default Onboarding
