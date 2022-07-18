import { $Divider, $Horizontal, $Vertical, $h1, $span, $h3 } from '../../Generics'
import { useQuery } from '@apollo/client'
import { GET_TOURNAMENT } from './api.gql'
import { useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { TournamentID } from 'lib/types'
import Modal from 'react-modal'
import {
  LootboxTournamentSnapshot,
  QueryTournamentArgs,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { $HideTings, HiddenDescription, $SearchInput, LootboxList, $TournamentCover } from '../common'
import useWindowSize from 'lib/hooks/useScreenSize'
import Spinner from 'lib/components/Generics/Spinner'
import { manifest } from 'manifest'
import { $Link, Oopsies } from 'lib/components/Profile/common'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { COLORS } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { tournamentWords as getTournamentWords } from '../common'
import { useIntl } from 'react-intl'
import QuickCreate from 'lib/components/QuickCreate'

interface PublicTournamentProps {
  tournamentId: TournamentID
}

/** Public Tournament Widget */
const PublicTournament = (props: PublicTournamentProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, error } = useQuery<{ tournament: TournamentResponse }, QueryTournamentArgs>(GET_TOURNAMENT, {
    variables: {
      id: props.tournamentId,
    },
  })
  const tournamentWords = getTournamentWords(intl)

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess

  return (
    <$Vertical spacing={4} width="100%" maxWidth="1000px">
      <$Vertical spacing={4}>
        <$Vertical spacing={4}>
          {tournament.coverPhoto && <$TournamentCover src={tournament.coverPhoto} />}

          <$Vertical>
            <$h1>{tournament.title}</$h1>
            <$Divider margin="0px 0px 20px 0px" />

            <$Horizontal flexWrap>
              {tournament.magicLink && (
                <$span>
                  👉{' '}
                  <$Link
                    color={'inherit'}
                    fontStyle="italic"
                    href={tournament.magicLink}
                    style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                    target="_self"
                  >
                    {words.createLootbox}
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
                    style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                    target="_blank"
                  >
                    {tournamentWords.visitTournament}
                  </$Link>
                </$span>
              ) : null}

              <$span>
                👉{' '}
                <$Link
                  color={'inherit'}
                  fontStyle="italic"
                  href={'https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC'}
                  style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                  target="_blank"
                >
                  {words.watchTutorial}
                </$Link>
              </$span>
            </$Horizontal>
          </$Vertical>
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
                setCreateModalOpen(true)
                // window.open(`${tournament.magicLink}`, '_self')
              }
            : undefined
        }
      />
      <Modal
        isOpen={createModalOpen}
        onAfterOpen={() => console.log('onAfterOpen')}
        onRequestClose={() => setCreateModalOpen(false)}
        contentLabel="Create Lootbox Modal"
      >
        <h2>Hello</h2>
        <button onClick={() => setCreateModalOpen(false)}>close</button>
        <div>I am a modal</div>
      </Modal>
    </$Vertical>
  )
}

const PublicTournamentPage = () => {
  const [tournamentId, setTournamentId] = useState<TournamentID>()
  const words = useWords()

  useEffect(() => {
    const load = async () => {
      initLogging()
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
    <Oopsies icon="🤷‍♂️" title={`${words.notFound}!`} />
  )
}

export default PublicTournamentPage
