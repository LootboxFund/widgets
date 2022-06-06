import AuthGuard from '../../AuthGuard'
import { $Vertical, $Divider, $Horizontal, $span, $h1, $h3 } from '../../Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { HiddenDescription, LootboxList, $SearchInput } from '../common'
import {
  LootboxTournamentSnapshot,
  QueryTournamentArgs,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useQuery } from '@apollo/client'
import { GET_MY_TOURNAMENT } from './api.gql'
import { useEffect, useState } from 'react'
import { TournamentID } from 'lib/types'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { manifest } from 'manifest'
import EditTournament from './EditTournament'
import { $Link, Oopsies } from 'lib/components/Profile/common'
import { COLORS } from '@wormgraph/helpers'

interface ManageTournamentProps {
  tournamentId: TournamentID
}

/** Manage Tournament Widget */
const ManageTournament = (props: ManageTournamentProps) => {
  const { screen } = useWindowSize()
  const [searchTerm, setSearchTerm] = useState('')
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
    return <Oopsies title="An error occured" icon="🤕" message={error?.message || ''} />
  } else if (data?.myTournament?.__typename === 'ResponseError') {
    return <Oopsies title="An error occured" icon="🤕" message={data?.myTournament?.error?.message || ''} />
  }

  const { tournament } = data.myTournament as TournamentResponseSuccess
  const createLootboxUrl = `${manifest.microfrontends.webflow.createPage}?tournamentId=${tournament.id}`
  const tournamentUrl = `${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`

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
          <$h3 style={{ marginBottom: '-10px' }}>MANAGE</$h3>
          <$h1>{tournament.title}</$h1>
          <$Divider margin="0px 0px 20px 0px" />
          <$Horizontal flexWrap>
            <$span>
              👉{' '}
              <$Link
                color={'inherit'}
                fontStyle="italic"
                href={createLootboxUrl}
                style={{ marginRight: '15px', textDecoration: 'none' }}
                target="_blank"
              >
                Create Magic Link
              </$Link>
            </$span>

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
            ) : (
              <$span>
                👉{' '}
                <$Link
                  color={'inherit'}
                  fontStyle="italic"
                  href={'#input-link'}
                  style={{ marginRight: '15px', textDecoration: 'none' }}
                >
                  Add Tournament Link
                </$Link>
              </$span>
            )}

            <$span>
              👉{' '}
              <$Link
                color={'inherit'}
                fontStyle="italic"
                href={tournamentUrl}
                style={{ marginRight: '15px', textDecoration: 'none' }}
                target="_blank"
              >
                Public View
              </$Link>
            </$span>
          </$Horizontal>
        </$Vertical>

        {!tournament.magicLink && (
          <Oopsies
            title="Add a Magic Link"
            icon="🧙"
            message={
              <$span>
                Magic Links help people sign up to your tournament by creating a special Lootbox with the settings you
                choose! Confused?{' '}
                <$Link
                  fontStyle="italic"
                  href={'https://www.youtube.com/channel/UCC1o25acjSJSx64gCtYqdSA'}
                  target="_blank"
                >
                  Learn more.
                </$Link>
                <br />
                <br />
                1) Create your Magic Link 👉{' '}
                <$Link fontStyle="italic" href={createLootboxUrl} target="_blank">
                  here
                </$Link>
                <br />
                <br />
                2) Update your tournament with the Magic Link{' '}
                <$Link fontStyle="italic" href={'#input-magic'}>
                  below
                </$Link>{' '}
                👇
              </$span>
            }
          />
        )}

        <HiddenDescription description={tournament.description} screen={screen} />
      </$Vertical>

      {filteredLootboxSnapshots.length === 0 ? (
        <Oopsies
          title="No Lootboxes"
          message={<$span>There are no Lootboxes associated to your tournament yet.</$span>}
          icon={'🧐'}
        />
      ) : (
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
      )}

      <$Divider />
      <$h3 style={{ fontStyle: 'italic' }}>Edit your Lootbox Tournament</$h3>
      <EditTournament tournamentId={tournament.id as TournamentID} initialState={tournament} />
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

  return (
    <AuthGuard>
      {tournamentId ? (
        <ManageTournament tournamentId={tournamentId} />
      ) : (
        <Oopsies icon="🤷‍♂️" title="Tournament not found!" />
      )}
    </AuthGuard>
  )
}

export default ManageTournamentPage
