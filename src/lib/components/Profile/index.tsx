import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from './api.gql'
import { GetMyProfileResponse } from 'lib/api/graphql/generated/types'
import { TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $Vertical } from '../Generics'
import { $h1, $p } from '../Generics/Typography'
import Spinner from '../Generics/Spinner'
import Wallets from './Wallets'
import MyLootboxes from './MyLootboxes'

const Profile = () => {
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <MyProfileError message={error?.message || ''} />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <MyProfileError message={data?.getMyProfile?.error?.message || ''} />
  }

  return (
    <$Vertical spacing={5}>
      <$h1 textAlign="center">Profile</$h1>
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
