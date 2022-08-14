import react, { useState } from 'react'
import styled from 'styled-components'
import { $ErrorMessage, $h1, $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ProfileImage } from 'lib/components/PublicProfile'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { getSocials } from 'lib/hooks/constants'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $SocialGridInputs, $SocialLogo } from 'lib/components/CreateLootbox/StepSocials'
import { MutationUpdateUserArgs, ResponseError, UserSocials } from 'lib/api/graphql/generated/types'
import useWords from 'lib/hooks/useWords'
import { Props } from 'react-modal'
import { useMutation } from '@apollo/client'
import { UpdateSocialsResponseFE, UPDATE_USER_SOCIALS } from './api.gql'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { GET_MY_PROFILE } from '../api.gql'
import { $ProfilePageInput } from '../common'

export interface ProfileSocialsProps {
  userSocials: UserSocials
}
const ProfileSocials = (props: ProfileSocialsProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [localSocials, setLocalSocials] = useState<UserSocials>({ ...props.userSocials })
  const [updateUserSocials, { loading }] = useMutation<
    { updateUser: ResponseError | UpdateSocialsResponseFE },
    MutationUpdateUserArgs
  >(UPDATE_USER_SOCIALS, {
    refetchQueries: [GET_MY_PROFILE],
  })

  const setSocial = (key: string, value: string) => {
    setLocalSocials({
      ...localSocials,
      [key]: value,
    })
  }

  const formSubmit = async () => {
    setErrorMessage(undefined)
    const newSocials: UserSocials = {}

    if (localSocials.twitter !== props.userSocials.twitter) {
      newSocials.twitter = localSocials.twitter ?? null
    }

    if (localSocials.twitch !== props.userSocials.twitch) {
      newSocials.twitch = localSocials.twitch ?? null
    }

    if (localSocials.instagram !== props.userSocials.instagram) {
      newSocials.instagram = localSocials.instagram ?? null
    }

    if (localSocials.facebook !== props.userSocials.facebook) {
      newSocials.facebook = localSocials.facebook ?? null
    }

    if (localSocials.discord !== props.userSocials.discord) {
      newSocials.discord = localSocials.discord ?? null
    }

    if (localSocials.snapchat !== props.userSocials.snapchat) {
      newSocials.snapchat = localSocials.snapchat ?? null
    }

    if (localSocials.web !== props.userSocials.web) {
      newSocials.web = localSocials.web ?? null
    }

    if (localSocials.tiktok !== props.userSocials.tiktok) {
      newSocials.tiktok = localSocials.tiktok ?? null
    }

    try {
      if (Object.keys(newSocials).length === 0) {
        throw new Error(words.noChangesMade)
      }
      const { data } = await updateUserSocials({
        variables: {
          payload: {
            socials: newSocials,
          },
        },
      })

      if (!data || data?.updateUser?.__typename === 'ResponseError') {
        console.error((data?.updateUser as ResponseError | undefined)?.error?.message || 'Error updating socials')
        throw new Error(words.anErrorOccured)
      }
    } catch (err) {
      setErrorMessage(err.message || words.anErrorOccured)
    }
  }

  return (
    <$Vertical spacing={4}>
      <$h1>
        <FormattedMessage
          id="profile.socials.mySocials"
          defaultMessage="My Socials"
          description="List of user socials for public view"
        />
      </$h1>

      <$SocialGridInputs screen={screen}>
        {SOCIALS.filter((social) => social.slug in localSocials).map((social) => {
          if (!(social.slug in localSocials)) {
            return
          }
          return (
            <$Horizontal
              key={social.slug}
              style={screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px' }}
            >
              <$SocialLogo src={social.icon} />
              <$ProfilePageInput
                defaultValue={localSocials[social.slug as keyof UserSocials] || ''}
                style={{ width: '100%' }}
                value={localSocials[social.slug as keyof UserSocials] || ''}
                onChange={(e) => setSocial(social.slug, e.target.value)}
                placeholder={social.placeholder}
              ></$ProfilePageInput>
            </$Horizontal>
          )
        })}
      </$SocialGridInputs>
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

export default ProfileSocials
