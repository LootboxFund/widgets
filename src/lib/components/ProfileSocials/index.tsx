import react from 'react'
import styled from 'styled-components'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ProfileImage } from '../PublicProfile'
import { COLORS } from '@wormgraph/helpers'
import { getSocials } from 'lib/hooks/constants'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $SocialGridInputs, $SocialLogo } from '../CreateLootbox/StepSocials'
import useWords from 'lib/hooks/useWords'

export interface ProfileSocialsProps {}
const ProfileSocials = (props: ProfileSocialsProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)
  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <$ProfileSocials screen={screen}>
        <$Horizontal verticalCenter style={{ height: '50px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <FormattedMessage
              id="profile.socials.pageHeader"
              defaultMessage="Social Profiles"
              description="Page Header of Social Profiles Page"
            />
          </span>
          <a href="" style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            {`[${words.back}]`}
          </a>
        </$Horizontal>
        <$Horizontal alignItems="center" style={{ display: 'flex', flexDirection: 'row' }}>
          <$Vertical style={{ alignItems: 'center', marginRight: '20px', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'lighter', marginBottom: '10px' }}>
              <FormattedMessage
                id="profile.socials.changePhoto"
                defaultMessage="Change Photo"
                description="Change Photo of User"
              />
            </span>
            <$ProfileImage src="https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg" />
          </$Vertical>
          <$Vertical style={{ flex: 1 }}>
            <span style={{ margin: '5px 0px' }}>Username</span>
            <$ProfilePageInput style={{ width: '90%', height: '40px', fontSize: '1.2rem', maxWidth: '430px' }} />
          </$Vertical>
        </$Horizontal>
        <br />
        <$Vertical>
          <span style={{ margin: '5px 0px' }}>
            <FormattedMessage
              id="profile.socials.biography"
              defaultMessage="Biography"
              description="Biography of User"
            />
          </span>
          <$ProfilePageTextArea rows={3} />
        </$Vertical>
        <br />
        <$Vertical>
          <$LabelInput>
            <FormattedMessage
              id="profile.socials.mySocials"
              defaultMessage="My Socials"
              description="List of user socials for public view"
            />
          </$LabelInput>
          <$SocialGridInputs screen={screen}>
            {SOCIALS.map((social) => {
              return (
                <$Horizontal
                  key={social.slug}
                  style={screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px' }}
                >
                  <$SocialLogo src={social.icon} />
                  <$ProfilePageInput
                    style={{ width: '100%' }}
                    value={''}
                    onChange={(e) => ''}
                    placeholder={social.placeholder}
                  ></$ProfilePageInput>
                </$Horizontal>
              )
            })}
          </$SocialGridInputs>
        </$Vertical>
      </$ProfileSocials>
      <$StickySaveBar>
        <a
          href=""
          style={{
            fontWeight: 'lighter',
            color: COLORS.white,
            textDecoration: 'none',
            marginRight: '20px',
            fontSize: '1rem',
          }}
        >
          {words.cancel}
        </a>
        <button
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
          }}
        >
          {words.saveChanges}
        </button>
      </$StickySaveBar>
    </div>
  )
}

const $ProfileSocials = styled.div<{ screen: ScreenSize }>`
  font-family: sans-serif;
  padding: ${(props) => (props.screen === 'mobile' ? '5px' : '10px')};
`

const $ProfilePageInput = styled.input`
  border: 0px solid ${COLORS.white};
  background-color: rgba(0, 0, 0, 0.08);
  padding: 5px 10px;
  border-radius: 5px;
  overflow: hidden;
`

const $ProfilePageTextArea = styled.textarea`
  border: 0px solid ${COLORS.white};
  background-color: rgba(0, 0, 0, 0.08);
  max-width: 550px;
`

const $LabelInput = styled.span`
  margin: 10px 0px;
  font-size: 1rem;
  font-weight: bold;
  color: ${COLORS.black};
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
