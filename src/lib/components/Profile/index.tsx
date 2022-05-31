import AuthGuard from '../AuthGuard'

const Profile = () => {
  return (
    <AuthGuard>
      <div>
        <h1>Profile</h1>
        <p>This is the profile page</p>
      </div>
    </AuthGuard>
  )
}

export default Profile
