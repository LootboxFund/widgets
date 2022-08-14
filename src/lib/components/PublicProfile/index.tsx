import { useQuery } from '@apollo/client'
import { COLORS } from '@wormgraph/helpers'
import { ResponseError } from 'lib/api/graphql/generated/types'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { UserID } from 'lib/types'
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
import AuthGuard from '../AuthGuard'
import CreatePartyBasketReferral from '../Referral/CreatePartyBasketReferral'
import { LocalClaim } from '../ViralOnboarding/contants'
import ProfileSocials from 'lib/components/ProfileSocials'
import UserLotteryTickets from 'lib/components/PublicProfile/UserTickets'

interface PublicProfileProps {
  userId: UserID
}
const PublicProfile = (props: PublicProfileProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [isSocialsOpen, setIsSocialsOpen] = useState(false)
  const [lastClaimCreatedAt, setLastClaimCreatedAt] = useState<undefined | string>(undefined)
  const [userClaims, setUserClaims] = useState<PublicUserFEClaims[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()
  const {
    data: userData,
    loading: loadingData,
    error: errorData,
  } = useQuery<{ publicUser: ResponseError | PublicUserFE }, PublicUserGQLArgs>(PUBLIC_USER, {
    variables: { publicUserId: props.userId },
  })
  const inviteFriendText = intl.formatMessage({
    id: 'profile.public.inviteFriends',
    defaultMessage: 'Invite Friend',
    description: 'Button to invite friend',
  })
  const bonusTicketText = intl.formatMessage({
    id: 'profile.public.bothGetBonusTickets',
    defaultMessage: 'Both get bonus FREE Lottery Tickets',
    description: 'Reward caption for inviting friend',
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

  /**
   * TODO: remove localstorage bs
   */
  let recentClaims: LocalClaim[]
  try {
    const raw = localStorage.getItem('recentClaims')
    recentClaims = raw ? JSON.parse(raw) : []
  } catch (err) {
    recentClaims = []
  }

  // Here we kinda coalesce the response into a predictable type
  const { username } = (userData?.publicUser as PublicUserFE)?.user || {}

  if (isSocialsOpen) {
    return (
      <$PublicProfilePageContainer screen={screen}>
        <ProfileSocials />
      </$PublicProfilePageContainer>
    )
  }
  return (
    <$PublicProfilePageContainer screen={screen}>
      <$Horizontal justifyContent="space-between">
        <$ProfileImage src="https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg" />
        <$Vertical justifyContent="flex-start" spacing={2} style={{ marginLeft: '20px', alignItems: 'center' }}>
          <$InviteButton onClick={() => setIsModalOpen(true)}>{inviteFriendText}</$InviteButton>
          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
            {bonusTicketText}
          </span>
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
          <br />
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
            <a href="" style={{ textDecoration: 'none' }}>
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
          <FormattedMessage
            id="profile.public.aboutMe"
            defaultMessage="Follow tournament organizers on social media to be updated on when you can redeem your lottery tickets if you win."
          />
        </span>
      </$Vertical>

      {isSocialsOpen ? <ProfileSocials /> : <UserLotteryTickets userId={props.userId} />}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Stream Selection Modal"
        style={customStyles}
      >
        <$Horizontal
          justifyContent="flex-end"
          style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span onClick={() => setIsModalOpen(false)}>X</span>
        </$Horizontal>
        {!!userClaims && !!userClaims[0] && (
          <AuthGuard>
            <CreatePartyBasketReferral
              partyBasketId={userClaims[0].chosenPartyBasket.id}
              tournamentId={userClaims[0].tournamentId}
              qrcodeMargin={'0px -40px'}
            />
          </AuthGuard>
        )}
      </Modal>
    </$PublicProfilePageContainer>
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

const $PublicProfilePageContainer = styled.div<{ screen: ScreenSize }>`
  font-family: sans-serif;
  padding: ${(props) => (props.screen === 'mobile' ? '5px' : '10px')};
  max-width: 600px;
  margin: 0 auto;
`

const $ClaimsGrid = styled.div<{ screen: ScreenSize }>`
  display: grid;
  grid-template-columns: ${(props) => {
    if (props.screen === 'desktop') return '1fr 1fr 1fr 1fr'
    else if (props.screen === 'tablet') return '1fr 1fr 1fr'
    else return '1fr 1fr'
  }};
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  margin-top: 10px;
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
`

const $ClaimCard = styled.div`
  flex: 1;
  width: 100%;
  cursor: pointer;
`

const $InviteFriend = styled.div<{ screen: ScreenSize }>`
  width: auto;
  height: 90%;
  min-height: ${(props) => (props.screen === 'mobile' ? '180px' : '220px')};
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-color: rgba(225, 225, 225, 0.2);
  border-style: dashed;
  padding: 10px 0px 10px 0px;
`

const $InviteButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  border: 0px solid white;
  text-transform: uppercase;
`

const $MoreButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  border: 0px solid white;
  text-transform: uppercase;
`

export default PublicProfilePage
