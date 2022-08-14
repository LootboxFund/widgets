import react from 'react'
import styled from 'styled-components'
import { $h1, $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ProfileImage } from '../PublicProfile'
import { COLORS } from '@wormgraph/helpers'
import { getSocials } from 'lib/hooks/constants'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $SocialGridInputs, $SocialLogo } from '../CreateLootbox/StepSocials'
import useWords from 'lib/hooks/useWords'
import { UserSocials } from 'lib/api/graphql/generated/types'

export interface ProfileSocialsProps {
  userSocials: UserSocials
  onClose: () => void
}
const ProfileSocials = (props: ProfileSocialsProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)
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
        {SOCIALS.filter((social) => social.slug in props.userSocials).map((social) => {
          if (!(social.slug in props.userSocials)) {
            return
          }
          return (
            <$Horizontal
              key={social.slug}
              style={screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px' }}
            >
              <$SocialLogo src={social.icon} />
              <$ProfilePageInput
                defaultValue={props.userSocials[social.slug as keyof UserSocials] || ''}
                style={{ width: '100%' }}
                value={props.userSocials[social.slug as keyof UserSocials] || ''}
                placeholder={social.placeholder}
              ></$ProfilePageInput>
            </$Horizontal>
          )
        })}
      </$SocialGridInputs>
      <$StickySaveBar>
        {/* <a
          onClick={props.onClose}
          style={{
            fontWeight: 'lighter',
            color: COLORS.white,
            textDecoration: 'none',
            marginRight: '20px',
            fontSize: '1rem',
          }}
        >
          {words.cancel}
        </a> */}
        <button
          onClick={props.onClose}
          style={{
            fontWeight: 'bold',
            fontSize: '1rem',
            color: COLORS.trustBackground,
            backgroundColor: COLORS.white,
            border: '0px solid #ccc',
            padding: '10px',
            width: '100%',
            maxWidth: '150px',
            borderRadius: '5px',
            marginRight: '30px',
            cursor: 'pointer',
          }}
        >
          {words.back}
        </button>
      </$StickySaveBar>
    </$Vertical>
  )
}

const $ProfilePageInput = styled.input`
  border: 0px solid ${COLORS.white};
  background-color: rgba(0, 0, 0, 0.08);
  padding: 5px 10px;
  border-radius: 5px;
  overflow: hidden;
`

const $StickySaveBar = styled.div`
  position: sticky;
  bottom: 0px;
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  font-family: sans-serif;
`

export default ProfileSocials
