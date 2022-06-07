import { useQuery } from '@apollo/client'
import { GetMyProfileResponse, GetMyProfileSuccess, Tournament } from 'lib/api/graphql/generated/types'
import { $h1, $span, $Vertical } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { manifest } from 'manifest'
import { $Link, Oopsies } from '../common'
import { GET_MY_TOURNAMENTS } from './api.gql'

const MyTournaments = () => {
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_TOURNAMENTS)

  const navigateToCreateTournament = () => {
    window.open(manifest.microfrontends.webflow.tournamentCreatePage, '_self')
  }

  const TournamentList = ({ tournaments }: { tournaments: Tournament[] }) => {
    return (
      <ul>
        {tournaments.map((tournament, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <$Link href={`${manifest.microfrontends.webflow.tournamentManagePage}?tid=${tournament.id}`}>
              {tournament.title}
            </$Link>
          </li>
        ))}
      </ul>
    )
  }

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} icon="🤕" title="Error loading Tournaments" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies message={data?.getMyProfile?.error?.message || ''} icon="🤕" title="Error loading Tournaments" />
  }

  const tournaments = (data?.getMyProfile as GetMyProfileSuccess)?.user?.tournaments || []

  return (
    <$Vertical spacing={4}>
      <$Vertical>
        <$h1>My Tournaments</$h1>
        <$span color="#ababab" style={{ cursor: 'pointer' }} onClick={navigateToCreateTournament}>
          Create a Tournament
        </$span>
        <TournamentList tournaments={tournaments} />
      </$Vertical>
    </$Vertical>
  )
}

export default MyTournaments
