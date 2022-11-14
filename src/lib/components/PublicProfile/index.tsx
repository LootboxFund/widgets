import { useQuery } from '@apollo/client'
import { COLORS, TYPOGRAPHY, UserID } from '@wormgraph/helpers'
import { ResponseError } from 'lib/api/graphql/generated/types'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Spinner from '../Generics/Spinner'
import { Oopsies } from '../Profile/common'
import { PublicUserFE, PublicUserGQLArgs, PUBLIC_USER, PublicUserFEClaims } from './api.gql'
import { extractURLState_PublicProfilePage } from './utils'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { FormattedMessage, useIntl } from 'react-intl'
import Modal from 'react-modal'
import ProfileSocials from 'lib/components/ProfileSocials'
import UserLotteryTickets from 'lib/components/PublicProfile/UserTickets'
import { manifest } from 'manifest'
import { NEXT_STEPS_INFOGRAPHIC } from 'lib/hooks/constants'

const DEFAULT_PROFILE_PICTURE =
  'https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg'

interface PublicProfileProps {
  userId: UserID
}
const PublicProfile = (props: PublicProfileProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [isSocialsOpen, setIsSocialsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNextStepsOpen, setIsNextStepsOpen] = useState(false)
  const intl = useIntl()
  const {
    data: userData,
    loading: loadingData,
    error: errorData,
  } = useQuery<{ publicUser: ResponseError | PublicUserFE }, PublicUserGQLArgs>(PUBLIC_USER, {
    variables: { publicUserId: props.userId },
  })

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      inset: screen === 'mobile' ? '10px' : '60px',
      maxWidth: '500px',
      margin: 'auto',
      maxHeight: '800px',
      fontFamily: 'sans-serif',
    },
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 10000,
    },
  }

  if (loadingData) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (errorData || !userData) {
    return <Oopsies title={words.anErrorOccured} message={errorData?.message || ''} icon="🤕" />
  } else if (userData?.publicUser?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={userData?.publicUser?.error?.message || ''} icon="🤕" />
  }

  // Here we kinda coalesce the response into a predictable type
  const { username, socials, biography, avatar } = (userData?.publicUser as PublicUserFE)?.user || {}

  return (
    <$PageContainer>
      <$Banner screen={screen}>Giveaways can take a day to process. Check your email for updates.</$Banner>
      <br />
      <$PublicProfilePageContainer screen={screen}>
        <$Horizontal justifyContent="space-between">
          <$ProfileImage src={avatar ? avatar : DEFAULT_PROFILE_PICTURE} alt={`Avatar ${username}`} />
          <$Vertical justifyContent="flex-start" spacing={2} style={{ marginLeft: '20px', alignItems: 'center' }}>
            <$InviteButton onClick={() => setIsNextStepsOpen(true)}>{words.nextSteps}</$InviteButton>
            {/* <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
            {bonusTicketText}
          </span> */}
          </$Vertical>
        </$Horizontal>
        <$Vertical style={{ marginTop: '10px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: screen === 'mobile' ? 'column' : 'row',
            }}
          >
            <b style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{username || 'Human'}</b>
            <br />
            <span
              style={{
                margin: screen === 'mobile' ? '5px 0px' : '0px 10px',
                fontStyle: 'italic',
                fontSize: screen === 'mobile' ? '0.7rem' : '0.8rem',
              }}
            >
              <a onClick={() => setIsSocialsOpen(true)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <FormattedMessage
                  id="profile.public.viewSocials"
                  defaultMessage="View Socials"
                  description="Public Profile Page link to view socials"
                />
              </a>
              <span>{` | `}</span>
              <a href={`${manifest.microfrontends.webflow.myProfilePage}`} style={{ textDecoration: 'none' }}>
                <FormattedMessage
                  id="profile.public.editProfile"
                  defaultMessage="Edit Profile"
                  description="Public Profile Page link to edit profile"
                />
              </a>
            </span>
          </div>
          <span
            style={{
              fontWeight: 'lighter',
              color: 'rgba(0,0,0,0.7)',
              margin: '10px 0px 30px 0px',
              width: '100%',
              maxWidth: '600px',
            }}
          >
            {biography ? (
              biography
            ) : (
              <FormattedMessage
                id="profile.public.aboutMe"
                defaultMessage="Follow tournament organizers on social media to be updated on when you can redeem your lottery tickets if you win."
              />
            )}
          </span>
        </$Vertical>

        {isSocialsOpen && socials ? (
          <ProfileSocials userSocials={socials} onClose={() => setIsSocialsOpen(false)} />
        ) : (
          <UserLotteryTickets userId={props.userId} />
        )}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Share Ticket Modal"
          style={customStyles}
        >
          <$Horizontal
            justifyContent="flex-end"
            style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <span onClick={() => setIsModalOpen(false)}>X</span>
          </$Horizontal>
        </Modal>
        <Modal
          isOpen={isNextStepsOpen}
          onRequestClose={() => setIsNextStepsOpen(false)}
          contentLabel="Next Steps Modal"
          style={customStyles}
        >
          <$Horizontal
            justifyContent="flex-end"
            style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <span onClick={() => setIsNextStepsOpen(false)}>X</span>
          </$Horizontal>
          <$NextStepsInfographic src={NEXT_STEPS_INFOGRAPHIC} />
          <$OkayButton onClick={() => setIsNextStepsOpen(false)}> OKAY </$OkayButton>
        </Modal>
      </$PublicProfilePageContainer>
    </$PageContainer>
  )
}

const PublicProfilePage = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
    }
    load()
  }, [])

  const userId = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_PublicProfilePage()
    return INITIAL_URL_PARAMS.userId
  }, [])

  if (!userId) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="20vh auto" />
  }

  return <PublicProfile userId={userId as UserID} />
}

const $PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 920px;
  margin: 0 auto;
`

const $Banner = styled.div<{ screen: ScreenSize }>`
  padding: ${(props) => (props.screen === 'mobile' ? '10px 20px' : '20px 40px')};
  background: #00b0fb; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #4286f4, #00b0fb); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #4286f4,
    #00b0fb
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: ${COLORS.white};
  text-align: center;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
`

const $PublicProfilePageContainer = styled.div<{ screen: ScreenSize }>`
  font-family: sans-serif;
  background: #ffffff;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'mobile' ? '1.5rem 1rem 2.2rem' : '1.2rem 1.6rem 3.4rem')};
  width: 100%;
  box-sizing: border-box;
`

export const $ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 70px;
  min-width: 70px;
  min-height: 70px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
  box-shadow: 3px 3px 6px ${COLORS.surpressedBackground}aa;
`

const $InviteButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  border: 0px solid white;
  text-transform: capitalize;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  filter: drop-shadow(0px 4px 20px rgba(38, 166, 239, 0.64));
`

const $OkayButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  background-color: ${COLORS.successFontColor};
  color: ${COLORS.white};
  border: 0px solid white;
  text-transform: uppercase;
  margin: 20px 0 0 auto;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
`

export const $ProfileSectionContainer = styled.div<{ screen: ScreenSize }>`
  background: #ffffff;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'mobile' ? '1.5rem 1rem 2.2rem' : '1.2rem 1.6rem 3.4rem')};
`

const $NextStepsInfographic = styled.img`
  width: 100%;
`

export default PublicProfilePage
