import AuthGuard from '../../AuthGuard'
import { $Vertical, $Divider, $Horizontal, $span, $h1, $h3 } from '../../Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { LootboxList, $SearchInput, $TournamentCover } from '../common'
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
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import { tournamentWords as getTournamentWords } from '../common'

interface ManageTournamentProps {
  tournamentId: TournamentID
}

/** Manage Tournament Widget */
const ManageTournament = (props: ManageTournamentProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{ myTournament: TournamentResponse }, QueryTournamentArgs>(
    GET_MY_TOURNAMENT,
    {
      variables: {
        id: props.tournamentId,
      },
    }
  )

  const tournamentWords = getTournamentWords(intl)
  const noLootboxesText = intl.formatMessage({
    id: 'tournament.manage.noLootboxes.text',
    defaultMessage: 'No Lootboxes',
    description: 'Text when no Lootboxes were found',
  })

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies title={words.anErrorOccured} icon="🤕" message={error?.message || ''} />
  } else if (data?.myTournament?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} icon="🤕" message={data?.myTournament?.error?.message || ''} />
  }

  const { tournament } = data.myTournament as TournamentResponseSuccess
  const createLootboxUrl = `${manifest.microfrontends.webflow.createPage}?tournamentId=${tournament.id}`
  const tournamentUrl = `${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`

  const lootboxSnapshots = [...(tournament?.lootboxSnapshots || [])]

  return (
    <$Vertical spacing={4} width="100%" maxWidth="1000px">
      <$Vertical spacing={4}>
        <$Vertical spacing={4}>
          {tournament.coverPhoto && <$TournamentCover src={tournament.coverPhoto} />}
          <$Vertical>
            <$h3 style={{ marginBottom: '-10px', textTransform: 'uppercase' }}>{words.manage}</$h3>
            <$h1>{tournament.title}</$h1>
            <$Divider margin="0px 0px 20px 0px" />
            <$Horizontal flexWrap style={{ paddingBottom: '15px' }}>
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

              <$span>
                👉{' '}
                <$Link
                  color={'inherit'}
                  fontStyle="italic"
                  href={createLootboxUrl}
                  style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                  target="_blank"
                >
                  {words.createMagicLink}
                </$Link>
              </$span>

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
              ) : (
                <$span>
                  👉{' '}
                  <$Link
                    color={'inherit'}
                    fontStyle="italic"
                    href={'#input-link'}
                    style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                  >
                    <FormattedMessage
                      id="tournament.edit.addTournamentLink"
                      defaultMessage="Add tournament link"
                      description="Prompt to user to add a hyperlink URL to the tournament's official page. I.e. might be a streaming website etc."
                    />
                  </$Link>
                </$span>
              )}

              <$span>
                👉{' '}
                <$Link
                  color={'inherit'}
                  fontStyle="italic"
                  href={tournamentUrl}
                  style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                  target="_self"
                >
                  <FormattedMessage
                    id="tournament.edit.publicView"
                    defaultMessage="Public View"
                    description="Hyperlink to navigate to the public page of an esports tournament"
                  />
                </$Link>
              </$span>
            </$Horizontal>
          </$Vertical>
        </$Vertical>

        {!tournament.magicLink && (
          <div style={{ paddingBottom: '15px' }}>
            <Oopsies
              // title="Add a Magic Link"
              title={words.createMagicLink}
              icon="🧙"
              message={
                <$span>
                  <FormattedMessage
                    id="tournament.edit.createMagicLink.help"
                    defaultMessage="Magic Links help people sign up for your tournament by creating a special Lootbox with the settings you choose! {learnMoreHyperLink}"
                    description="Help text for the user to create a magic link"
                    values={{
                      learnMoreHyperLink: (
                        <$Link
                          fontStyle="italic"
                          href={'https://www.youtube.com/channel/UCC1o25acjSJSx64gCtYqdSA'}
                          target="_blank"
                        >
                          {words.learnMore}.
                        </$Link>
                      ),
                    }}
                  />
                  <br />
                  <br />
                  <FormattedMessage
                    id="tournament.edit.createMagicLink.help.step1"
                    defaultMessage="1) Create a magic link for this exact tournament by 👉 {hyperlink}"
                    description="Help text for the user to create a magic link"
                    values={{
                      hyperlink: (
                        <$Link
                          fontStyle="italic"
                          href={createLootboxUrl}
                          target="_blank"
                          style={{ textTransform: 'lowercase' }}
                        >
                          {words.clickingHere}
                        </$Link>
                      ),
                    }}
                  />
                  <br />
                  <br />
                  <FormattedMessage
                    id="tournament.edit.createMagicLink.help.step2"
                    defaultMessage="2) Update your tournament with the Magic Link by 👉 {hyperlink}"
                    description=""
                    values={{
                      hyperlink: (
                        <$Link fontStyle="italic" href={'#input-magic'} style={{ textTransform: 'lowercase' }}>
                          {words.clickingHere}
                        </$Link>
                      ),
                    }}
                  />
                </$span>
              }
            />
          </div>
        )}
      </$Vertical>

      {lootboxSnapshots.length === 0 && (
        <Oopsies
          title={noLootboxesText}
          message={
            <FormattedMessage
              id="tournament.edit.noLootboxes.message"
              defaultMessage="There are no Lootboxes associated to your tournament yet."
              description="When there are no Lootboxes in a tournament"
            />
          }
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
          magicLink={tournament.magicLink || ''}
        />
      )}

      <$Divider />
      <$h3 style={{ fontStyle: 'italic' }}>
        <FormattedMessage
          id="tournament.edit.editTournament.title"
          defaultMessage="Edit your Lootbox Tournament"
          description="Title for the section to edit a Lootbox esports tournament"
        />
      </$h3>
      <EditTournament tournamentId={tournament.id as TournamentID} initialState={tournament} />
    </$Vertical>
  )
}

const ManageTournamentPage = () => {
  const [tournamentId, setTournamentId] = useState<TournamentID>()
  const words = useWords()

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
    initLogging()
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
        <Oopsies icon="🤷‍♂️" title={`${words.notFound}!`} />
      )}
    </AuthGuard>
  )
}

export default ManageTournamentPage
