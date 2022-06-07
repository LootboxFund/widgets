import AuthGuard from '../../AuthGuard'
import { $Vertical, $Divider, $Horizontal, $span, $h1, $h3 } from '../../Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { LootboxList, $SearchInput } from '../common'
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
import { initDApp } from 'lib/hooks/useWeb3Api'

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
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies title="An error occured" icon="🤕" message={error?.message || ''} />
  } else if (data?.myTournament?.__typename === 'ResponseError') {
    return <Oopsies title="An error occured" icon="🤕" message={data?.myTournament?.error?.message || ''} />
  }

  const { tournament } = data.myTournament as TournamentResponseSuccess
  const createLootboxUrl = `${manifest.microfrontends.webflow.createPage}?tournamentId=${tournament.id}`
  const tournamentUrl = `${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`

  const lootboxSnapshots = [...(tournament?.lootboxSnapshots || [])]

  return (
    <$Vertical spacing={4} width="100%" maxWidth="1000px">
      <$Vertical spacing={4}>
        <$Vertical>
          <$h3 style={{ marginBottom: '-10px' }}>MANAGE</$h3>
          <$h1>{tournament.title}</$h1>
          <$Divider margin="0px 0px 20px 0px" />
          <$Horizontal flexWrap style={{ paddingBottom: '15px' }}>
            <$span>
              👉{' '}
              <$Link
                color={'inherit'}
                fontStyle="italic"
                href={'https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC'}
                style={{ marginRight: '15px', textDecoration: 'none' }}
                target="_blank"
              >
                Watch Tutorial
              </$Link>
            </$span>

            <$span>
              👉{' '}
              <$Link
                color={'inherit'}
                fontStyle="italic"
                href={createLootboxUrl}
                style={{ marginRight: '15px', textDecoration: 'none' }}
                target="_self"
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
                target="_self"
              >
                Public View
              </$Link>
            </$span>
          </$Horizontal>
        </$Vertical>

        {!tournament.magicLink && (
          <div style={{ paddingBottom: '15px' }}>
            <Oopsies
              title="Add a Magic Link"
              icon="🧙"
              message={
                <$span>
                  Magic Links help people sign up for your tournament by creating a special Lootbox with the settings
                  you choose!{' '}
                  <$Link
                    fontStyle="italic"
                    href={'https://www.youtube.com/channel/UCC1o25acjSJSx64gCtYqdSA'}
                    target="_blank"
                  >
                    Learn more.
                  </$Link>
                  <br />
                  <br />
                  1) Create a magic link for this exact tournament by 👉{' '}
                  <$Link fontStyle="italic" href={createLootboxUrl} target="_self">
                    clicking here
                  </$Link>
                  <br />
                  <br />
                  2) Update your tournament with the Magic Link by 👉{' '}
                  <$Link fontStyle="italic" href={'#input-magic'}>
                    clicking here
                  </$Link>{' '}
                </$span>
              }
            />
          </div>
        )}
      </$Vertical>

      {lootboxSnapshots.length === 0 && (
        <Oopsies
          title="No Lootboxes"
          message={<$span>There are no Lootboxes associated to your tournament yet.</$span>}
          icon={'🧐'}
        />
      )}

      {lootboxSnapshots.length > 0 && (
        <LootboxList
          lootboxes={lootboxSnapshots}
          screen={screen}
          onClickLootbox={(lootbox) => {
            lootbox &&
              lootbox.address &&
              window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootbox.address}`)
          }}
          templateAction={
            tournament.magicLink
              ? () => {
                  window.open(`${tournament.magicLink}`, '_self')
                }
              : undefined
          }
        />
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
    const load = async () => {
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
    }
    load()
  }, [])

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
