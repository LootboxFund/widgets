import AuthGuard from '../../AuthGuard'
import { $Vertical, $Divider, $Horizontal } from '../../Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { $h1, $h2, $p, EmptyResult, HiddenDescription, TournamentError } from '../common'
import { QueryTournamentArgs, TournamentResponse, TournamentResponseSuccess } from 'lib/api/graphql/generated/types'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useQuery } from '@apollo/client'
import { GET_MY_TOURNAMENT } from '../api.gql'
import { useEffect, useState } from 'react'
import { TournamentID } from 'lib/types'
import parseUrlParams from 'lib/utils/parseUrlParams'

interface ManageTournamentProps {
  tournamentId: TournamentID
}

/** Manage Tournament Widget */
const ManageTournament = (props: ManageTournamentProps) => {
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{ myTournament: TournamentResponse }, QueryTournamentArgs>(
    GET_MY_TOURNAMENT,
    {
      variables: {
        id: props.tournamentId,
      },
    }
  )

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <TournamentError message={error?.message || ''} />
  } else if (data?.myTournament?.__typename === 'ResponseError') {
    return <TournamentError message={data?.myTournament?.error?.message || ''} />
  }

  const { tournament } = data.myTournament as TournamentResponseSuccess

  const Options = ({}) => {
    const Option = ({ text, link }: { text: string; link: string }) => {
      return (
        <$p onClick={() => window.open(link)} style={{ cursor: 'pointer', marginRight: '10px' }}>
          👉 {text}
        </$p>
      )
    }
    return (
      <$Horizontal>
        <Option text="Create Magic Link" link={'google.com'} />
        <Option text="View Tournament" link={'google.com'} />
        <Option text="Public View" link={'google.com'} />
      </$Horizontal>
    )
  }

  return (
    <$Vertical>
      <$h2>MANAGE</$h2>
      <$h1>{tournament.title}</$h1>
      <$Divider margin="0px 0px 20px 0px" />
      <Options />
      <HiddenDescription description={tournament.description} screen={screen} />
    </$Vertical>
  )
}

const ManageTournamentPage = () => {
  const [tournamentId, setTournamentId] = useState<TournamentID>()

  useEffect(() => {
    const tid = parseUrlParams('tid')
    if (tid) {
      setTournamentId(tid as TournamentID)
    }
  })

  return <AuthGuard>{tournamentId ? <ManageTournament tournamentId={tournamentId} /> : <EmptyResult />}</AuthGuard>
}

export default ManageTournamentPage
