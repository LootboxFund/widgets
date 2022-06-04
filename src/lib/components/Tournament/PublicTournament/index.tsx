import { $Divider, $Horizontal, $Vertical, $h1, $span, $h3 } from '../../Generics'
import { useQuery } from '@apollo/client'
import { GET_TOURNAMENT } from './api.gql'
import { useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { TournamentID } from 'lib/types'
import {
  LootboxTournamentSnapshot,
  QueryTournamentArgs,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { $HideTings, HiddenDescription, $SearchInput, LootboxList } from '../common'
import useWindowSize from 'lib/hooks/useScreenSize'
import Spinner from 'lib/components/Generics/Spinner'
import { manifest } from 'manifest'
import { Oopsies } from 'lib/components/Profile/common'

interface PublicTournamentProps {
  tournamentId: TournamentID
}

/** Public Tournament Widget */
const PublicTournament = (props: PublicTournamentProps) => {
  const { screen } = useWindowSize()
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, error } = useQuery<{ tournament: TournamentResponse }, QueryTournamentArgs>(GET_TOURNAMENT, {
    variables: {
      id: props.tournamentId,
    },
  })

  const Options = ({}) => {
    const Option = ({ text, link }: { text: string; link: string }) => {
      return (
        <$span onClick={() => window.open(link)} style={{ cursor: 'pointer', marginRight: '15px' }}>
          👉 {text}
        </$span>
      )
    }
    return (
      <$Horizontal flexWrap>
        <Option text="View Tournament" link={'google.com'} />
        <Option text="Create Lootbox" link={'google.com'} />
      </$Horizontal>
    )
  }

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title="An error occured" icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title="An error occured" icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess

  const filteredLootboxSnapshots: LootboxTournamentSnapshot[] = !!searchTerm
    ? [
        ...(tournament.lootboxSnapshots?.filter(
          (snapshot) =>
            snapshot?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            snapshot?.address?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []),
      ]
    : [...(tournament?.lootboxSnapshots || [])]

  return (
    <$Vertical spacing={4}>
      <$h3 style={{ marginBottom: '-4px' }}>TOURNAMENT</$h3>
      <$h1>{tournament.title}</$h1>
      <$Divider margin="0px 0px 20px 0px" />
      <Options />

      <HiddenDescription description={tournament.description} screen={screen} />
      <$SearchInput
        type="search"
        placeholder="🔍 Search Lootboxes by Name or Address"
        onChange={(e) => setSearchTerm(e.target.value || '')}
      />
      <LootboxList
        lootboxes={filteredLootboxSnapshots || []}
        screen={screen}
        onClickLootbox={(lootbox) => {
          lootbox &&
            lootbox.address &&
            window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootbox.address}`)
        }}
      />
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

  return tournamentId ? (
    <PublicTournament tournamentId={tournamentId} />
  ) : (
    <Oopsies icon="🤷‍♂️" title="Tournament not found!" />
  )
}

export default PublicTournamentPage
