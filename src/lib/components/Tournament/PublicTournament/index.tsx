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
import { $Link, Oopsies } from 'lib/components/Profile/common'

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
      <$Vertical spacing={4}>
        <$Vertical>
          <$h1>{tournament.title}</$h1>
          <$Divider margin="0px 0px 20px 0px" />

          {(tournament.magicLink || tournament.tournamentLink) && (
            <$Horizontal flexWrap>
              {tournament.magicLink && (
                <$span>
                  👉{' '}
                  <$Link
                    color={'inherit'}
                    fontStyle="italic"
                    href={tournament.magicLink}
                    style={{ marginRight: '15px', textDecoration: 'none' }}
                    target="_blank"
                  >
                    Create Lootbox
                  </$Link>
                </$span>
              )}

              {tournament.tournamentLink ? (
                <$span>
                  👉{' '}
                  <$Link
                    color={'inherit'}
                    fontStyle="italic"
                    href={tournament.tournamentLink}
                    style={{ marginRight: '15px', textDecoration: 'none' }}
                    target="_blank"
                  >
                    Visit Tournament
                  </$Link>
                </$span>
              ) : null}
            </$Horizontal>
          )}
        </$Vertical>
        <HiddenDescription description={tournament.description} screen={screen} />
      </$Vertical>

      <$Vertical spacing={4}>
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
          templateAction={
            tournament.magicLink
              ? () => {
                  window.open(`${tournament.magicLink}`)
                }
              : undefined
          }
        />
      </$Vertical>
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
