import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from './api.gql'
import { GetMyProfileResponse } from 'lib/api/graphql/generated/types'
import { TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $Divider, $Vertical } from '../Generics'
import { $h1, $p } from '../Generics/Typography'
import Spinner from '../Generics/Spinner'
import Wallets from './Wallets'
import MyLootboxes from './MyLootboxes'
import Onboarding from './Onboarding'
import useWindowSize from 'lib/hooks/useScreenSize'

const Profile = () => {
  const { user } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)
  const { screen } = useWindowSize()

  const pseudoUserName = user?.email?.split('@')[0] || 'Human'

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <MyProfileError message={error?.message || ''} />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <MyProfileError message={data?.getMyProfile?.error?.message || ''} />
  }

  const dividerWidth = screen === 'mobile' ? '100%' : '320px'

  return (
    <$Vertical spacing={5}>
      <$Vertical>
        <$h1 textAlign="center">Welcome, {pseudoUserName}</$h1>
        <$Divider width={dividerWidth} margin="20px auto 0px" />
        {user && <$p textAlign="center">{user?.email}</$p>}
        <$Divider width={dividerWidth} margin="0px auto 0px" />
      </$Vertical>
      <Onboarding />
      <Wallets />
      <MyLootboxes />
      <br />
      <br />
    </$Vertical>
  )
}

const MyProfileError = ({ message }: { message: string }) => {
  return (
    <$Vertical>
      <$Manz>🤕 </$Manz>
      <$h1>An error occured</$h1>
      <$p>{message}</$p>
    </$Vertical>
  )
}

const $Manz = styled.span`
  font-size: 3.5rem;
`

const ProfilePage = () => {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}

export default ProfilePage
