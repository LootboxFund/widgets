import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from './api.gql'
import { GetMyProfileResponse } from 'lib/api/graphql/generated/types'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $Divider, $Horizontal, $Vertical } from '../Generics'
import { $h1, $p } from '../Generics/Typography'
import Spinner from '../Generics/Spinner'
import Wallets from './Wallets'
import MyLootboxes from './MyLootboxes'
import Onboarding from './Onboarding'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $Link } from './common'
import Settings from './Settings'
import { Oopsies } from './common'
import { useEffect } from 'react'
import { initDApp } from 'lib/hooks/useWeb3Api'
import MyTournaments from './MyTournaments'
import { initLogging } from 'lib/api/logrocket'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'

const Profile = () => {
  const { user, logout } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)
  const { screen } = useWindowSize()
  const words = useWords()

  const pseudoUserName = user?.email?.split('@')[0] || 'Human'

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.getMyProfile?.error?.message || ''} icon="🤕" />
  }

  const dividerWidth = screen === 'mobile' ? '100%' : '320px'

  return (
    <$Vertical spacing={5}>
      <$Vertical>
        <$h1 textAlign="center">
          <FormattedMessage
            id="profile.welcomeUserMessage"
            defaultMessage="Welcome, {userName}"
            values={{ userName: pseudoUserName }}
          />
        </$h1>
        {user && (
          <$Vertical>
            <$Divider width={dividerWidth} margin="20px auto 20px" />
            <$Horizontal justifyContent="center" flexWrap>
              <$p style={{ margin: '0px 15px 0px 0px' }}>{user?.email} </$p>
              <$p style={{ margin: '0px' }}>
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
            </$Horizontal>
            <$Divider width={dividerWidth} margin="20px auto 0px" />
          </$Vertical>
        )}
      </$Vertical>
      <Onboarding />
      <Settings />
      <Wallets />
      <MyTournaments />
      <MyLootboxes />
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
