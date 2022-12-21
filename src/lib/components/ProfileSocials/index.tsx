import react from 'react'
import styled from 'styled-components'
import { $h1, $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ProfileImage } from '../PublicProfile'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { getSocials } from 'lib/hooks/constants'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
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
                disabled
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
  padding: 5px 10px;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${`${COLORS.surpressedBackground}1A`};
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
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

export const $SocialGridInputs = styled.div<{ screen: ScreenSize }>`
  ${({ screen }) => {
    if (screen === 'mobile') {
      return `
        display: flex;
        flex-direction: column;
      `
    } else {
      return `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        column-gap: 10px;
        row-gap: 15px;
      `
    }
  }}
`

export const $SocialLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export default ProfileSocials
