import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE, MyProfileFE } from './api.gql'
import { GetMyProfileResponse, ResponseError } from 'lib/api/graphql/generated/types'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $Divider, $Horizontal, $Vertical } from '../Generics'
import { $h0, $p } from '../Generics/Typography'
import Spinner from '../Generics/Spinner'
import Wallets from './Wallets'
import MyLootboxes from './MyLootboxes'
import Onboarding from './Onboarding'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Link, $ProfileButton, $ProfileSectionContainer } from './common'
import Settings from './Settings'
import { Oopsies } from './common'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import MyTournaments from './MyTournaments'
import { initLogging } from 'lib/api/logrocket'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'
import { manifest } from 'manifest'
import MySocials from './MySocials'
import ManagePublicProfile from './ManagePublicProfile'

const Profile = () => {
  const { user, logout } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: ResponseError | MyProfileFE }>(GET_MY_PROFILE)
  const { screen } = useWindowSize()
  const words = useWords()

  if (loading || user === undefined) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (!user || error || !data) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.getMyProfile?.error?.message || ''} icon="🤕" />
  }

  const { user: userDB } = (data?.getMyProfile as MyProfileFE) || {}

  const pseudoUserName = userDB?.username || user?.username || user?.email?.split('@')[0] || 'Human'

  return (
    <$Vertical spacing={5}>
      <$Vertical spacing={4}>
        <$h0 textAlign="center">
          <FormattedMessage
            id="profile.welcomeUserMessage"
            defaultMessage="Welcome, {userName}"
            values={{ userName: pseudoUserName }}
          />
        </$h0>
        <$Horizontal justifyContent="center">
          <div>
            <a href={`${manifest.microfrontends.webflow.publicProfile}?uid=${user.id}`}>
              <$ProfileButton
                screen={screen}
                backgroundColor={`${COLORS.trustBackground}C0`}
                backgroundColorHover={`${COLORS.trustBackground}`}
                color={COLORS.trustFontColor}
              >
                <FormattedMessage id="profile.button.viewLotteryTickets" defaultMessage="View Lottery Tickets" />
              </$ProfileButton>
            </a>
          </div>
        </$Horizontal>
        {user && (
          <$p style={{ margin: '0px' }} textAlign="center">
            <$Link
              onClick={logout}
              style={{
                textAlign: 'center',
                textDecoration: 'none',
                fontStyle: 'normal',
                fontFamily: TYPOGRAPHY.fontFamily.regular,
                textTransform: 'lowercase',
              }}
            >
              {words.logout}
            </$Link>
          </$p>
        )}
      </$Vertical>

      <Onboarding />
      <$ProfileSectionContainer screen={screen}>
        <ManagePublicProfile
          username={userDB.username}
          avatar={userDB.avatar}
          biography={userDB.biography}
          headshot={userDB?.headshot ? userDB?.headshot[0] : undefined}
        />
      </$ProfileSectionContainer>
      <$ProfileSectionContainer screen={screen}>
        <MySocials userSocials={userDB.socials} />
      </$ProfileSectionContainer>
      <$ProfileSectionContainer screen={screen}>
        <Settings />
      </$ProfileSectionContainer>
      <$ProfileSectionContainer screen={screen}>
        <Wallets />
      </$ProfileSectionContainer>
      <$ProfileSectionContainer screen={screen}>
        <MyTournaments />
      </$ProfileSectionContainer>
      <$ProfileSectionContainer screen={screen}>
        <MyLootboxes />
      </$ProfileSectionContainer>
    </$Vertical>
  )
}

const ProfilePage = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
    }
    load()
  }, [])

  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}

export default ProfilePage
