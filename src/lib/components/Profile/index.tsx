import { useAuth } from 'lib/hooks/useAuth'
import AuthGuard from '../AuthGuard'

const Profile = () => {
  const { user } = useAuth()
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
