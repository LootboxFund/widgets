import { $Divider, $Horizontal, $Vertical, $h1, $span, $h3, $h2 } from '../../Generics'
import { useQuery } from '@apollo/client'
import { GET_TOURNAMENT, TournamentFE } from './api.gql'
import { useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import Modal from 'react-modal'
import { QueryTournamentArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { HiddenDescription, LootboxList, $TournamentCover, $TournamentSectionContainer } from '../common'
import useWindowSize from 'lib/hooks/useScreenSize'
import Spinner from 'lib/components/Generics/Spinner'
import { manifest } from 'manifest'
import { $Link, Oopsies } from 'lib/components/Profile/common'
import { initDApp, useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { Address, COLORS, TYPOGRAPHY, TournamentID } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { useTournamentWords } from '../common'
import QuickCreate from 'lib/components/QuickCreate'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { InitialUrlParams } from 'lib/components/CreateLootbox/state'
import { $StreamListItem, $StreamLogo } from 'lib/components/Tournament/common'
import { getStreamLogo } from 'lib/hooks/constants'
import { FormattedMessage } from 'react-intl'
import $Button from 'lib/components/Generics/Button'

interface PublicTournamentProps {
  tournamentId: TournamentID
}

/**
 * @deprecated for battle page (AKA watch page)
 */
const PublicTournament = (props: PublicTournamentProps) => {
  const words = useWords()
  const web3Utils = useWeb3Utils()
  const [network, setNetwork] = useState<NetworkOption>()
  const [magicLinkParams, setMagicLinkParams] = useState<InitialUrlParams>()
  const { screen } = useWindowSize()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { data, loading, error } = useQuery<{ tournament: TournamentFE | ResponseError }, QueryTournamentArgs>(
    GET_TOURNAMENT,
    {
      variables: {
        id: props.tournamentId,
      },
    }
  )
  const tournamentWords = useTournamentWords()

  useEffect(() => {
    if (data?.tournament?.__typename === 'TournamentResponseSuccess' && data?.tournament?.tournament?.magicLink) {
      try {
        const url = new URL(data?.tournament?.tournament?.magicLink)
        const _magicLinkParams: InitialUrlParams = {
          network: url.searchParams.get('network'),
          type: url.searchParams.get('type'),
          fundingTarget: url.searchParams.get('fundingTarget'),
          fundingLimit: url.searchParams.get('fundingLimit'),
          receivingWallet: url.searchParams.get('receivingWallet'),
          returnsTarget: url.searchParams.get('returnsTarget'),
          returnsDate: url.searchParams.get('returnsDate'),
          logoImage: url.searchParams.get('logoImage'),
          coverImage: url.searchParams.get('coverImage'),
          campaignBio: url.searchParams.get('campaignBio'),
          campaignWebsite: url.searchParams.get('campaignWebsite'),
          themeColor: url.searchParams.get('themeColor'),
          tournamentId: url.searchParams.get('tournamentId'),
        }

        setMagicLinkParams(_magicLinkParams)

        const networkOption = matchNetworkByHex(_magicLinkParams.network as string)
        if (networkOption) {
          setNetwork(networkOption)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }, [data])

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentFE

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      inset: screen === 'mobile' ? '10px' : '60px',
    },
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
  }

  const JoinButton = () => (
    <$Button
      screen={screen}
      onClick={
        tournament.magicLink
          ? () => {
              setCreateModalOpen(true)
            }
          : undefined
      }
      color={COLORS.trustFontColor}
      backgroundColor={`${COLORS.trustBackground}`}
      style={{
        fontWeight: TYPOGRAPHY.fontWeight.light,
        fontSize: TYPOGRAPHY.fontSize.large,
      }}
    >
      {words.joinTournament}
    </$Button>
  )

  const watchUrl = `${manifest.microfrontends.webflow.battlePage}?tid=${tournament.id}`

  return (
    <$Vertical spacing={5} width="100%" maxWidth="720px" style={{ margin: '0 auto' }}>
      <$TournamentSectionContainer screen={screen} style={{ boxShadow: 'none', marginBottom: '0px' }}>
        <$Vertical>
          <$Vertical spacing={4}>
            {tournament.coverPhoto && <$TournamentCover src={tournament.coverPhoto} />}

            <$Vertical>
              <$Horizontal width="100%" justifyContent="space-between" flexWrap spacing={2}>
                <$h1>{tournament.title}</$h1>
                <div style={{ margin: 'auto 0 10px' }}>
                  <JoinButton />
                </div>
              </$Horizontal>
              <$Divider margin="0px 0px 20px 0px" />
              <$Horizontal flexWrap>
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
                ) : null}

                <$span style={{ paddingBottom: '15px' }}>
                  👉{' '}
                  <$Link
                    color={'inherit'}
                    fontStyle="italic"
                    href={watchUrl}
                    style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                    target="_self"
                  >
                    <FormattedMessage
                      id="tournament.edit.publicWatchPage"
                      defaultMessage="Public Watch Page"
                      description="Hyperlink to navigate to the public watch page of an esports tournament"
                    />
                  </$Link>
                </$span>
                {/* 
                {tournament.magicLink && (
                  <$span style={{ paddingBottom: '15px' }}>
                    👉{' '}
                    <$Link
                      color={'inherit'}
                      fontStyle="italic"
                      href={tournament.magicLink}
                      style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                      target="_self"
                    >
                      {words.joinTournament}
                    </$Link>
                  </$span>
                )} */}

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
              </$Horizontal>
            </$Vertical>
          </$Vertical>
          {tournament.description && <HiddenDescription description={tournament.description} screen={screen} />}
        </$Vertical>
      </$TournamentSectionContainer>

      {tournament?.streams && tournament.streams.length > 0 && (
        <$Vertical spacing={2}>
          <$h1>
            <FormattedMessage
              id="tournament.manage.chooseStream.header"
              defaultMessage="Watch this Tournament Live"
              description="Header for stream selection in the public tournament page"
            />
          </$h1>

          <br />
          {tournament.streams.map((stream) => {
            return (
              <$StreamListItem style={{ cursor: 'pointer', width: screen === 'mobile' ? '100%' : '80%' }}>
                <a
                  href={`${manifest.microfrontends.webflow.battlePage}?tid=${props.tournamentId}&stream=${stream.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <$Horizontal spacing={2}>
                    <$StreamLogo src={getStreamLogo(stream.type)} />
                    <$h3 style={{ textDecoration: 'none', margin: 'auto 0' }}>{stream.name}</$h3>
                  </$Horizontal>
                </a>
              </$StreamListItem>
            )
          })}
        </$Vertical>
      )}

      <LootboxList
        pageSize={5}
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
              }
            : undefined
        }
        magicLink={tournament.magicLink || ''}
      />

      <Modal
        isOpen={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        contentLabel="Create Lootbox Modal"
        style={customStyles}
      >
        <$Horizontal
          justifyContent="flex-end"
          style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span onClick={() => setCreateModalOpen(false)}>X</span>
        </$Horizontal>
        {magicLinkParams && network && (
          <QuickCreate
            tournamentName={tournament.title || ''}
            tournamentId={magicLinkParams.tournamentId as TournamentID}
            receivingWallet={magicLinkParams.receivingWallet as Address}
            network={network}
            fundraisingLimit={web3Utils.toBN(magicLinkParams.fundingLimit)}
            fundraisingTarget={web3Utils.toBN(magicLinkParams.fundingTarget)}
          />
        )}
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
