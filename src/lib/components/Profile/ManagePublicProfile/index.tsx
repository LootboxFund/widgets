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
import { GET_MY_PROFILE, MyProfileFE } from '../api.gql'
import { $ProfilePageInput, $ProfilePageTextArea } from '../common'
import { UpdateUserResponseFE, UPDATE_USER } from './api.gql'

const DEFAULT_PROFILE_PICTURE =
  'https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg'

interface Props {
  username?: string
  avatar?: string
  biography?: string
  headshot?: string
}
const ManagePublicProfile = (props: Props) => {
  const words = useWords()
  const intl = useIntl()
  const { screen } = useWindowSize()
  const { user: userIDP } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [localUsername, setLocalUsername] = useState<string>('')
  const [localUserBiography, setLocalUserBiography] = useState<string>('')
  const [localAvatar, setLocalAvatar] = useState<string>('')
  const [localHeadshot, setLocalHeadshot] = useState<string>('')
  const [updateUser, { loading }] = useMutation<
    { updateUser: ResponseError | UpdateUserResponseFE },
    MutationUpdateUserArgs
  >(UPDATE_USER, {
    refetchQueries: [{ query: GET_MY_PROFILE }],
  })

  useEffect(() => {
    if (props?.username) {
      setLocalUsername(props.username)
    }
    if (props?.biography) {
      setLocalUserBiography(props.biography)
    }
    if (props.avatar) {
      setLocalAvatar(props.avatar)
    }
    if (props.headshot) {
      setLocalHeadshot(props.headshot)
    }
  }, [props.username, props.avatar, props.biography, props.headshot])

  const usernameRequired = intl.formatMessage({
    id: 'profile.usernameRequired',
    defaultMessage: 'Username is required',
  })

  const addUsername = intl.formatMessage({
    id: 'profile.addUsername',
    defaultMessage: 'Add username',
  })

  const enterBiography = intl.formatMessage({
    id: 'profile.enterBiography',
    defaultMessage: 'Enter your biography',
  })

  const formSubmit = async () => {
    setErrorMessage(undefined)
    if (!userIDP) {
      setErrorMessage(words.youAreNotLoggedIn)
      return
    }

    if (!localUsername) {
      setErrorMessage(usernameRequired)
      return
    }

    const newUser: UpdateUserPayload = {}

    if (localUsername !== userIDP.username) {
      newUser.username = localUsername
    }

    if (localUserBiography !== props.biography) {
      newUser.biography = localUserBiography
    }

    if (localAvatar !== props.avatar) {
      newUser.avatar = localAvatar
    }

    if (localAvatar !== props.headshot) {
      newUser.headshot = localHeadshot
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
            <$ProfileImage src={localAvatar || DEFAULT_PROFILE_PICTURE} />
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
            <$ProfileImage src={localHeadshot || DEFAULT_PROFILE_PICTURE} />
          </$Vertical>
        </$Horizontal>
      </$Horizontal>
    )
  }

  if (!userIDP) {
    return null
  }
  return (
    <$Vertical spacing={4}>
      <$h1>
        {words.publicProfile}
        {'   '}
        <a
          href={`${manifest.microfrontends.webflow.publicProfile}?uid=${userIDP.id}`}
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
        {userIDP.id}
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
              placeholder={enterBiography}
              value={localUserBiography}
              rows={4}
              onChange={(e) => setLocalUserBiography(e.target.value)}
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
