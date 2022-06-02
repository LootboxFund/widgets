import { $Vertical } from '../../Generics'
import { useQuery } from '@apollo/client'
import { GET_TOURNAMENT } from '../api.gql'
import { useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { TournamentID } from 'lib/types'
import { QueryTournamentArgs, TournamentResponse, TournamentResponseSuccess } from 'lib/api/graphql/generated/types'
import { $h1, $p, $HideTings, HiddenDescription, TournamentError, EmptyResult } from '../common'
import useWindowSize from 'lib/hooks/useScreenSize'
import Spinner from 'lib/components/Generics/Spinner'

interface PublicTournamentProps {
  tournamentId: TournamentID
}

/** Public Tournament Widget */
const PublicTournament = (props: PublicTournamentProps) => {
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{ tournament: TournamentResponse }, QueryTournamentArgs>(GET_TOURNAMENT, {
    variables: {
      id: props.tournamentId,
    },
  })

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <TournamentError message={error?.message || ''} />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <TournamentError message={data?.tournament?.error?.message || ''} />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess
  return (
    <$Vertical>
      <$h1>{tournament.title}</$h1>
      <HiddenDescription description={tournament.description} screen={screen} />
    </$Vertical>
  )
}

const PublicTournamentPage = () => {
  const [tournamentId, setTournamentId] = useState<TournamentID>()

  useEffect(() => {
    const tid = parseUrlParams('tid')
    if (tid) {
      setTournamentId(tid as TournamentID)
    }
  })

  return tournamentId ? <PublicTournament tournamentId={tournamentId} /> : <EmptyResult />
}

export default PublicTournamentPage
