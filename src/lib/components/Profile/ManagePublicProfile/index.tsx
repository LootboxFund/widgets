import { useMutation } from '@apollo/client'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { MutationUpdateUserArgs, ResponseError, UpdateUserPayload } from 'lib/api/graphql/generated/types'
import { $ErrorMessage, $h1, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { useAuth } from 'lib/hooks/useAuth'
import useWindowSize from 'lib/hooks/useScreenSize'
import useWords from 'lib/hooks/useWords'
import { manifest } from 'manifest'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { GET_MY_PROFILE } from '../api.gql'
import { $ProfilePageInput, $ProfilePageTextArea } from '../common'
import { UpdateUserResponseFE, UPDATE_USER } from './api.gql'

const ManagePublicProfile = () => {
  const words = useWords()
  const intl = useIntl()
  const { screen } = useWindowSize()
  const { user } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [localUsername, setLocalUsername] = useState<string>(user?.username || '')
  const [localUserBiography, setLocalUserBiography] = useState<string>(
    'Follow tournament organizers on social media to be updated on when you can redeem your lottery tickets if you win.'
  )
  const [localAvatar, setLocalAvatar] = useState<string>(
    user?.avatar ||
      'https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg'
  )
  const [updateUser, { loading }] = useMutation<
    { updateUser: ResponseError | UpdateUserResponseFE },
    MutationUpdateUserArgs
  >(UPDATE_USER, {
    // onCompleted: refetchUser,
  })

  useEffect(() => {
    if (user?.username) {
      setLocalUsername(user.username)
    }
  }, [user?.username])

  const usernameRequired = intl.formatMessage({
    id: 'profile.usernameRequired',
    defaultMessage: 'Username is required',
  })

  const addUsername = intl.formatMessage({
    id: 'profile.addUsername',
    defaultMessage: 'Add username',
  })

  const formSubmit = async () => {
    setErrorMessage(undefined)
    if (!user) {
      setErrorMessage(words.youAreNotLoggedIn)
      return
    }

    if (!localUsername) {
      setErrorMessage(usernameRequired)
      return
    }

    const newUser: UpdateUserPayload = {}

    if (localUsername !== user.username) {
      newUser.username = localUsername
    }

    try {
      if (Object.keys(newUser).length === 0) {
        throw new Error(words.noChangesMade)
      }
      const { data } = await updateUser({
        variables: {
          payload: {
            ...newUser,
          },
        },
      })

      if (!data || data?.updateUser?.__typename === 'ResponseError') {
        console.error((data?.updateUser as ResponseError | undefined)?.error?.message || words.anErrorOccured)
        throw new Error((data?.updateUser as ResponseError | undefined)?.error?.message || words.anErrorOccured)
      }
    } catch (err) {
      setErrorMessage(err.message || words.anErrorOccured)
    }
  }

  const renderAvatarSection = () => {
    return (
      <$Horizontal flexWrap={screen !== 'mobile'} justifyContent="flex-start" spacing={4}>
        <$Horizontal width={screen !== 'mobile' ? '100%' : 'auto'}>
          <$Vertical spacing={2}>
            <$span style={{ textTransform: 'capitalize', fontWeight: TYPOGRAPHY.fontWeight.light }}>
              <FormattedMessage id="profile.avatar.editProfilePic" defaultMessage="Edit profile pic" />
            </$span>
            <$ProfileImage src={localAvatar} />
          </$Vertical>
        </$Horizontal>

        <$Horizontal width={screen !== 'mobile' ? '100%' : 'auto'}>
          <$Vertical spacing={2}>
            <$span style={{ textTransform: 'capitalize', fontWeight: TYPOGRAPHY.fontWeight.light }}>
              <FormattedMessage
                id="profile.avatar.editHeadshot"
                defaultMessage="Edit headshot"
                description="Referring to a picture of our user's head / upper torso"
              />
            </$span>
            <$ProfileImage src={localAvatar} />
          </$Vertical>
        </$Horizontal>
      </$Horizontal>
    )
  }

  if (!user) {
    return null
  }
  return (
    <$Vertical spacing={4}>
      <$h1>
        {words.publicProfile}
        {'   '}
        <a
          href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user.id}`}
          target="_blank"
          style={{ textDecoration: 'none' }}
        >
          <$span>🔗</$span>
          <$span
            style={{
              textTransform: 'lowercase',
              textDecoration: 'underline',
              fontStyle: 'italic',
              color: `${COLORS.surpressedBackground}be`,
            }}
          >
            Share link
          </$span>
        </a>
      </$h1>
      <$span style={{ fontWeight: TYPOGRAPHY.fontWeight.light, fontStyle: 'italic' }}>
        <$span
          style={{
            textTransform: 'uppercase',
            color: `${COLORS.surpressedBackground}be`,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontStyle: 'normal',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
          }}
        >
          {words.userId}
        </$span>{' '}
        {user.id}
      </$span>
      <br />
      {screen === 'mobile' && renderAvatarSection()}

      <$Horizontal spacing={4}>
        <$Vertical spacing={4} width={screen === 'mobile' ? '100%' : '50%'}>
          <$Vertical spacing={2}>
            <$span style={{ fontWeight: TYPOGRAPHY.fontWeight.light }}>{words.username}</$span>
            <$ProfilePageInput
              placeholder={addUsername}
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
            />
          </$Vertical>
          <$Vertical spacing={2}>
            <$span style={{ fontWeight: TYPOGRAPHY.fontWeight.light }}>{words.biography}</$span>
            <$ProfilePageTextArea
              value={localUserBiography}
              disabled
              style={{ cursor: 'not-allowed' }}
              rows={4}
              // onChange={(e) => setLocalUserName(e.target.value)}
            />
          </$Vertical>
        </$Vertical>
        {screen !== 'mobile' && renderAvatarSection()}
      </$Horizontal>
      <div>
        <$Button
          screen={screen}
          onClick={formSubmit}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
            boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
          }}
        >
          <LoadingText loading={loading} text={words.saveChanges} color={COLORS.trustFontColor} />
        </$Button>
      </div>
      {errorMessage && <$ErrorMessage>{errorMessage}</$ErrorMessage>}
    </$Vertical>
  )
}

export const $ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 70px;
  min-width: 70px;
  min-height: 70px;
  border-radius: 50%;
  margin: 0 auto;
  object-fit: cover;
  cursor: not-allowed;
`

export default ManagePublicProfile
