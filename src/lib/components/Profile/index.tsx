import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'
import { useQuery } from '@apollo/client'
import { GET_MY_PROFILE } from './api.gql'
import { GetMyProfileResponse } from 'lib/api/graphql/generated/types'

const Profile = () => {
  const { user } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)

  console.log(data, error)

  return (
    <AuthGuard>
      <div>
        <h1>Profile</h1>
        <p>This is the profile page {user?.email}</p>
      </div>
    </AuthGuard>
  )
}

export default Profile
