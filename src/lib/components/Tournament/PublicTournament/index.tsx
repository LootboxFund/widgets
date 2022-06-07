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
import { initDApp } from 'lib/hooks/useWeb3Api'
import { COLORS } from '@wormgraph/helpers'

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
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title="An error occured" icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title="An error occured" icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess

  return (
    <$Vertical spacing={4} width="100%" maxWidth="1000px">
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
                    target="_self"
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
            </$Horizontal>
          )}
        </$Vertical>
        <HiddenDescription description={tournament.description} screen={screen} />
      </$Vertical>
      <LootboxList
        lootboxes={tournament?.lootboxSnapshots || []}
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
    </$Vertical>
  )
}

const PublicTournamentPage = () => {
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

  return tournamentId ? (
    <PublicTournament tournamentId={tournamentId} />
  ) : (
    <Oopsies icon="🤷‍♂️" title="Tournament not found!" />
  )
}

export default PublicTournamentPage
