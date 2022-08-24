import { COLORS } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import { manifest } from 'manifest'
import { useEffect } from 'react'
import AuthGuard from '../AuthGuard'
import Spinner from '../Generics/Spinner'

const MyTickets = () => {
  const { user } = useAuth()
  useEffect(() => {
    if (!!user?.id) {
      window.location.replace(`${manifest.microfrontends.webflow.publicProfile}?uid=${user.id}`)
    }
  }, [user])
  return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
}

const MyTicketsPage = () => {
  return (
    <AuthGuard>
      <MyTickets />
    </AuthGuard>
  )
}

export default MyTicketsPage
