import AuthGuard from '../../AuthGuard'
import { $Vertical, $Divider, $Horizontal, $span, $h1, $h3, $p } from '../../Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { LootboxList, $TournamentCover, StreamListItem, $TournamentSectionContainer } from '../common'
import {
  QueryTournamentArgs,
  ResponseError,
  Tournament,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation, useQuery } from '@apollo/client'
import { GET_MY_TOURNAMENT, DELETE_STREAM, MyTournamentFE } from './api.gql'
import { useEffect, useState } from 'react'
import { StreamID, TournamentID } from 'lib/types'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { manifest } from 'manifest'
import EditTournament from './EditTournament'
import { $Link, Oopsies } from 'lib/components/Profile/common'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import { useTournamentWords } from '../common'
import AddStream from './AddStream'
import $Button from 'lib/components/Generics/Button'
import TournamentAnalytics from './TournamentAnalytics'

const LEARN_MORE_STREAM_LINK = 'https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC'

interface ManageTournamentProps {
  tournamentId: TournamentID
}

/** Manage Tournament Widget */
const ManageTournament = (props: ManageTournamentProps) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{ myTournament: MyTournamentFE | ResponseError }, QueryTournamentArgs>(
    GET_MY_TOURNAMENT,
    {
      variables: {
        id: props.tournamentId,
      },
    }
  )

  const tournamentWords = useTournamentWords()
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

  const { tournament } = data.myTournament as MyTournamentFE
  const createLootboxUrl = `${manifest.microfrontends.webflow.createPage}?tournamentId=${tournament.id}`
  const tournamentUrl = `${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`

  const lootboxSnapshots = [...(tournament?.lootboxSnapshots || [])]

  const JoinButton = () => (
    <$Button
      screen={screen}
      onClick={() => {
        if (tournament.magicLink) {
          window.open(`${tournament.magicLink}`, '_self')
        } else {
          window.open(createLootboxUrl, '_self')
        }
      }}
      color={COLORS.trustFontColor}
      backgroundColor={`${COLORS.trustBackground}`}
      style={{
        fontWeight: TYPOGRAPHY.fontWeight.light,
        fontSize: TYPOGRAPHY.fontSize.large,
      }}
    >
      <FormattedMessage
        id="tournament.manage.joinButton.text"
        defaultMessage="Add Team"
        description="button text to add team to tournament"
      />
    </$Button>
  )

  return (
    <$Vertical spacing={5} width="100%" maxWidth="720px" style={{ margin: '0 auto' }}>
      <$TournamentSectionContainer screen={screen} style={{ boxShadow: 'none', marginBottom: '0px' }}>
        <$Vertical spacing={4}>
          <$Vertical spacing={4}>
            {tournament.coverPhoto && <$TournamentCover src={tournament.coverPhoto} />}
            <$Vertical>
              <$h3 style={{ marginBottom: '-10px', textTransform: 'uppercase' }}>{words.manage}</$h3>
              <$Horizontal width="100%" justifyContent="space-between" flexWrap spacing={2}>
                <$h1>{tournament.title}</$h1>
                <div style={{ margin: 'auto 0 10px' }}>
                  <JoinButton />
                </div>
              </$Horizontal>
              <$Divider margin="0px 0px 20px 0px" />
              <$Horizontal flexWrap>
                <$span style={{ paddingBottom: '15px' }}>
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

                <$span style={{ paddingBottom: '15px' }}>
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
                  <$span style={{ paddingBottom: '15px' }}>
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
                  <$span style={{ paddingBottom: '15px' }}>
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

                <$span style={{ paddingBottom: '15px' }}>
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
        </$Vertical>
      </$TournamentSectionContainer>

      {!tournament.magicLink || !tournament.streams || tournament.streams.length === 0 ? (
        <$TournamentSectionContainer screen={screen}>
          <$h1>{words.yourAlmostSetup}</$h1>
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
                      description="Message to the user to update their tournament with a magic link"
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

          {(!tournament.streams || tournament.streams.length === 0) && (
            <div style={{ paddingBottom: '15px' }}>
              <Oopsies
                title={words.addLiveStream}
                icon="🎥"
                message={
                  <$span>
                    <FormattedMessage
                      id="tournament.manage.addLiveStream.message1"
                      defaultMessage="Live Streams let people watch your tournament in real-time! {learnMoreHyperLink}"
                      values={{
                        learnMoreHyperLink: (
                          <$Link fontStyle="italic" href={LEARN_MORE_STREAM_LINK} target="_blank">
                            {words.learnMore}.
                          </$Link>
                        ),
                      }}
                    />
                    <br />
                    <br />
                    <FormattedMessage
                      id="tournament.manage.addLiveStream.message2"
                      defaultMessage="Update your tournament with a Live Stream by 👉 {hyperlink}"
                      description="Message to the user to update their tournament with a live stream"
                      values={{
                        hyperlink: (
                          <$Link fontStyle="italic" href={'#button-add-stream'} style={{ textTransform: 'lowercase' }}>
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
        </$TournamentSectionContainer>
      ) : null}
      <$TournamentSectionContainer screen={screen}>
        <$Vertical spacing={4}>
          <$h1>
            <FormattedMessage id="tournament.edit.analytics.title" defaultMessage="Tournament Analytics" />
          </$h1>
          <$p style={{ marginTop: '0px' }}>
            <FormattedMessage
              id="tournament.edit.analytics.description"
              defaultMessage="Track how many referral bounties have been claimed by your community."
            />{' '}
            <$Link href={'#input-stream'}>{words.learnMore + '.'}</$Link>
          </$p>
          <TournamentAnalytics tournamentId={tournament.id as TournamentID} />
        </$Vertical>
      </$TournamentSectionContainer>

      <$TournamentSectionContainer screen={screen}>
        <$h1>
          <FormattedMessage
            id="tournament.edit.addStream.title"
            defaultMessage="Manage Streams"
            description="Title for the section to add / manage a live stream for tournament. A live stream is a video feed of an esports tournament gameplay."
          />
        </$h1>
        <$p style={{ marginTop: '0px' }}>
          <FormattedMessage
            id="tournament.edit.addStream.description"
            defaultMessage="Tournament streams increase community engagement by allowing users to watch the tournament live, directly on the public tournament page. You can add a stream for your tournament by clicking the button below."
            description="Description for the section to add / manage a live stream for tournament."
          />{' '}
          <$Link href={'#input-stream'}>{words.learnMore + '.'}</$Link>
        </$p>
        {!!tournament?.streams && tournament?.streams?.length > 0 && (
          <$Vertical spacing={3}>
            {tournament.streams.map((stream, index) => (
              <StreamListItem key={`stream-${index}`} stream={stream} tournamentId={tournament.id as TournamentID} />
            ))}
          </$Vertical>
        )}
        <br />
        <AddStream tournamentId={tournament.id as TournamentID} />
      </$TournamentSectionContainer>

      <$TournamentSectionContainer screen={screen}>
        <$h1>
          <FormattedMessage
            id="tournament.edit.editTournament.title"
            defaultMessage="Edit your Lootbox Tournament"
            description="Title for the section to edit a Lootbox esports tournament"
          />
        </$h1>
        <EditTournament tournamentId={tournament.id as TournamentID} initialState={tournament} />
      </$TournamentSectionContainer>

      {lootboxSnapshots.length === 0 && (
        <$TournamentSectionContainer screen={screen}>
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
        </$TournamentSectionContainer>
      )}

      {lootboxSnapshots.length > 0 && (
        <LootboxList
          pageSize={5}
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
          magicLink={tournament.magicLink ? tournament.magicLink : undefined}
        />
      )}
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
