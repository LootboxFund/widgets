import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from './api.gql'
import { GetMyProfileResponse } from 'lib/api/graphql/generated/types'
import { TYPOGRAPHY } from '@wormgraph/helpers'
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

const Profile = () => {
  const { user, logout } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)
  const { screen } = useWindowSize()

  const pseudoUserName = user?.email?.split('@')[0] || 'Human'

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies title="An error occured" message={error?.message || ''} icon="🤕" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies title="An error occured" message={data?.getMyProfile?.error?.message || ''} icon="🤕" />
  }

  const dividerWidth = screen === 'mobile' ? '100%' : '320px'

  return (
    <$Vertical spacing={5}>
      <$Vertical>
        <$h1 textAlign="center">Welcome, {pseudoUserName}</$h1>
        <$Divider width={dividerWidth} margin="20px auto 0px" />
        {user && (
          <$Horizontal justifyContent="center" spacing={5} flexWrap>
            <$p>{user?.email} </$p>
            <$p>
              <$Link
                onClick={logout}
                style={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontStyle: 'normal',
                  fontFamily: TYPOGRAPHY.fontFamily.regular,
                }}
              >
                logout
              </$Link>
            </$p>
          </$Horizontal>
        )}
        <$Divider width={dividerWidth} margin="0px auto" />
      </$Vertical>
      <Onboarding />
      <Settings />
      <Wallets />
      <MyLootboxes />
    </$Vertical>
  )
}

const ProfilePage = () => {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}

export default ProfilePage
