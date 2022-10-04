import { useQuery } from '@apollo/client'
import { Address, COLORS, TYPOGRAPHY, TournamentID, StreamID } from '@wormgraph/helpers'
import { PartyBasketStatus, QueryTournamentArgs, ResponseError, Tournament } from 'lib/api/graphql/generated/types'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import useWords from 'lib/hooks/useWords'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { $h1, $h3, $Horizontal, $p, $span, $Vertical } from '../Generics'
import Spinner from '../Generics/Spinner'
import { $Link, Oopsies } from '../Profile/common'
import {
  GET_TOURNAMENT_BATTLE_PAGE,
  BattlePageResponseSuccessFE,
  PartyBasketFE,
  BattlePageLootboxSnapshotFE,
  TournamentStreamsFE,
  TournamentFE,
} from './api.gql'
import LiveStreamVideo from './LiveStreamVideo'
import { extractURLState_BattlePage, BattlePageUrlParams } from './utils'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { manifest } from 'manifest'
import Modal from 'react-modal'
import { $StreamListItem, $StreamLogo, useTournamentWords } from '../Tournament/common'
import { getStreamLogo } from 'lib/hooks/constants'
import BattlePagePartyBasket from './BattlePagePartyBasket'
import BattlePageLootbox from './BattlePageLootbox'
import $Button from '../Generics/Button'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import { InitialUrlParams } from '../CreateLootbox/state'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { initDApp, useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { initLogging } from 'lib/api/logrocket'
import QuickCreate from '../QuickCreate'

export interface LootboxPartyBasket {
  lootbox: BattlePageLootboxSnapshotFE
  partyBasket?: PartyBasketFE
}

interface BattlePageParams {
  tournamentId: TournamentID
  streamId?: StreamID
}
const BattlePage = (props: BattlePageParams) => {
  const { data, loading, error } = useQuery<
    { tournament: BattlePageResponseSuccessFE | ResponseError },
    QueryTournamentArgs
  >(GET_TOURNAMENT_BATTLE_PAGE, {
    variables: {
      id: props.tournamentId,
    },
  })
  const web3Utils = useWeb3Utils()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [magicLinkParams, setMagicLinkParams] = useState<InitialUrlParams>()
  const [network, setNetwork] = useState<NetworkOption>()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const intl = useIntl()
  const words = useWords()
  const tournamentWords = useTournamentWords()
  const { screen } = useWindowSize()
  const [searchTerm, setSearchTerm] = useState('')

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

  const tournament = useMemo<TournamentFE | undefined>(() => {
    return (data?.tournament as BattlePageResponseSuccessFE)?.tournament
  }, [data?.tournament])

  const lootboxTournamentSnapshots = useMemo<BattlePageLootboxSnapshotFE[]>(() => {
    return (data?.tournament as BattlePageResponseSuccessFE)?.tournament?.lootboxSnapshots
  }, [data?.tournament])

  const filteredLootboxTournamentSnapshots = useMemo<BattlePageLootboxSnapshotFE[]>(() => {
    if (!lootboxTournamentSnapshots) {
      return []
    }
    return lootboxTournamentSnapshots.filter((lootboxSnapshot) => {
      if (!searchTerm) {
        return true
      }

      return (
        lootboxSnapshot?.lootbox?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lootboxSnapshot?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [lootboxTournamentSnapshots, searchTerm])

  console.log('snaps', filteredLootboxTournamentSnapshots, lootboxTournamentSnapshots)

  /** @deprecated use lootboxTournamentSnapshots */
  const lootboxPartyBaskets = useMemo<LootboxPartyBasket[]>(() => {
    if (!tournament) {
      return []
    }

    const _lootboxPartyBaskets: LootboxPartyBasket[] = []
    const _soldout: LootboxPartyBasket[] = []
    const _noPartyBaskets: LootboxPartyBasket[] = []
    let _first: LootboxPartyBasket | undefined
    tournament.lootboxSnapshots?.forEach((snapshot) => {
      if (snapshot.partyBaskets && snapshot.partyBaskets.length > 0) {
        snapshot.partyBaskets.forEach((partyBasket) => {
          if (partyBasket.status === PartyBasketStatus.Disabled) {
            return
          }

          if (!_first) {
            _first = {
              lootbox: snapshot,
              partyBasket,
            }
            return
          }

          if (partyBasket.status === PartyBasketStatus.SoldOut) {
            _soldout.push({
              lootbox: snapshot,
              partyBasket: partyBasket,
            })
          } else {
            _lootboxPartyBaskets.push({
              lootbox: snapshot,
              partyBasket: partyBasket,
            })
          }
        })
      } else {
        return
        // _noPartyBaskets.push({
        //   lootbox: snapshot,
        // })
      }
    })

    if (_first) {
      _lootboxPartyBaskets.unshift(_first)
    }

    return [..._lootboxPartyBaskets, ..._soldout, ..._noPartyBaskets]
  }, [tournament])

  /** @deprecated use filteredLootboxTournamentSnapshots */
  const filteredLootboxPartyBaskets: LootboxPartyBasket[] = useMemo<LootboxPartyBasket[]>(() => {
    if (!lootboxPartyBaskets) {
      return []
    }
    return lootboxPartyBaskets.filter((partyBasket) => {
      if (!searchTerm) {
        return true
      }

      return (
        partyBasket.lootbox?.lootbox?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partyBasket.partyBasket?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partyBasket.lootbox.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partyBasket.partyBasket?.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [lootboxPartyBaskets, searchTerm])

  // Find the stream from  the URL params
  const stream: TournamentStreamsFE | undefined = props.streamId
    ? tournament?.streams?.find((stream) => stream.id === props.streamId)
    : !!tournament?.streams
    ? tournament?.streams[0]
    : undefined

  const seemsLikeThisTournamentDoesNotHaveAnyLotteryTicketsYet = intl.formatMessage({
    id: 'battlePage.seemsLikeThisTournamentDoesNotHaveAnyLotteryTicketsYet',
    defaultMessage: 'Seems like this tournament does not have any lottery tickets yet',
    description: 'Text prompting indicating that there are no lottery tickets yet for this tournament',
  })
  const noStreamsMessage = intl.formatMessage({
    id: 'battlePage.noStreamsMessage',
    defaultMessage: 'Tournament does not have any streams. Ask the Tournament host to add some.',
    description: 'Text prompting indicating that there are no streams for this tournament',
  })

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      inset: screen === 'mobile' ? '10px' : '60px',
      maxWidth: '500px',
      margin: 'auto',
      maxHeight: '500px',
      fontFamily: 'sans-serif',
    },
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 10000,
    },
  }

  const quickCreateModalStyles = {
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

  const publicTournamentUrl = `${manifest.microfrontends.webflow.battlePage}?tid=${tournament?.id}`

  const previewLootboxes = lootboxTournamentSnapshots.slice(0, 4) || []
  /** @deprecated */
  const previewLootboxPartyBaskets = lootboxPartyBaskets?.slice(0, 4) || []
  const previewTings = previewLootboxes || previewLootboxPartyBaskets

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (!tournament) {
    return <Oopsies message={words.notFound} title={words.notFound} icon="🧐" />
  }

  return (
    <$BattlePageContainer>
      <$Vertical spacing={4}>
        {!!stream && <LiveStreamVideo stream={stream} />}
        {!stream && !!tournament.coverPhoto && <$TournamentCover src={tournament.coverPhoto} />}
        {!stream && !tournament.coverPhoto && <$TournamentCoverPlaceholder />}
        <br />
        <$BattlePageBody screen={screen}>
          <$Vertical spacing={4} height="100%">
            {!!stream && (
              <$span style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id="battlePage.streamText.switchStreamText"
                  defaultMessage='You are watching "{streamName}". To switch to another stream, {clickHereHyperlink}'
                  description="Text shown to user to allow them to switch streams. Stream is a live video feed of an esports tournament."
                  values={{
                    streamName: stream.name,
                    clickHereHyperlink: (
                      <$Link style={{ textTransform: 'lowercase' }} onClick={() => setIsModalOpen(true)}>
                        {words.clickHere}.
                      </$Link>
                    ),
                  }}
                />
                <br />
                <br />
              </$span>
            )}
            {!stream && (
              <$span>
                <FormattedMessage
                  id="battlePage.streamText.switchStreamText.noStream"
                  defaultMessage="You are not watching a stream. To choose a stream, {clickHereHyperlink}"
                  description="Text shown to user to allow them to switch streams. Stream is a live video feed of an esports tournament."
                  values={{
                    clickHereHyperlink: (
                      <$Link href="#" style={{ textTransform: 'lowercase' }}>
                        {words.clickHere}.
                      </$Link>
                    ),
                  }}
                />
              </$span>
            )}
            <$BattlePageSection screen={screen} style={{ overflow: 'visible' }}>
              <$Horizontal height="100%" width="100%" flexWrap={screen === 'mobile'} spacing={2}>
                <$Vertical height="100%" spacing={2} style={{ margin: '0 auto' }}>
                  <$BattleCardsContainer
                    screen={screen}
                    width="220px"
                    style={{
                      marginBottom: previewTings?.length > 0 ? `${previewTings?.length * 12}px` : 'auto',
                      marginLeft: previewTings?.length > 0 ? `${previewTings?.length * 10}px` : 'auto',
                    }}
                  >
                    {previewTings?.length ? (
                      previewTings
                        .reverse() // reversed because it renders in reverse order
                        ?.map((snap, idx2) => {
                          return (
                            <$BattleCardBlessed
                              screen={screen}
                              src={
                                snap?.stampImage
                                  ? convertFilenameToThumbnail(snap.stampImage, 'md')
                                  : TEMPLATE_LOOTBOX_STAMP
                              }
                              cardNumber={idx2}
                              key={`tournament-img-${idx2}`}
                            />
                          )
                        })
                    ) : (
                      <$BattleCardImage src={TEMPLATE_LOOTBOX_STAMP} cardNumber={0} />
                    )}
                  </$BattleCardsContainer>
                  {/* {tournament.tournamentLink && (
                    <span
                      style={{
                        textAlign: 'center',
                        width: '90%',
                        paddingBottom: screen === 'mobile' ? '12px' : 'auto',
                      }}
                    >
                      🔗{' '}
                      <$Link
                        href={tournament.tournamentLink}
                        style={{
                          color: `${COLORS.surpressedFontColor}ce`,
                          textDecoration: 'none',
                          textTransform: 'capitalize',
                        }}
                        target="_blank"
                      >
                        {tournamentWords.visitTournament}
                      </$Link>
                    </span>
                  )} */}
                </$Vertical>
                <$Horizontal flexWrap spacing={2}>
                  <$Vertical width="100%" spacing={2}>
                    <$h1> {tournament.title}</$h1>
                    {tournament.prize && (
                      <$span
                        style={{
                          textTransform: 'capitalize',
                          // color: COLORS.black,
                          color: `${COLORS.surpressedFontColor}`,
                        }}
                      >
                        {tournament.prize} {words.prize}
                      </$span>
                    )}
                    <$Horizontal flexWrap>
                      {tournament.tournamentLink ? (
                        <$span style={{ padding: '15px 0px 8px' }}>
                          👉{' '}
                          <$Link
                            color={'inherit'}
                            fontStyle="italic"
                            href={tournament.tournamentLink}
                            style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                            target="_blank"
                          >
                            {tournamentWords.tournamentDetails}
                          </$Link>
                        </$span>
                      ) : null}

                      {tournament.communityURL && (
                        <$span style={{ padding: '15px 0px 8px' }}>
                          👉{' '}
                          <$Link
                            color={'inherit'}
                            fontStyle="italic"
                            href={tournament.communityURL}
                            style={{ marginRight: '15px', textDecoration: 'none', textTransform: 'capitalize' }}
                            target="_self"
                          >
                            {words.joinCommunity}
                          </$Link>
                        </$span>
                      )}
                    </$Horizontal>
                    {/* <$span
                      style={{
                        textTransform: 'capitalize',
                        color: COLORS.black,
                        marginTop: '10px',
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                      }}
                    >
                      <FormattedMessage
                        id="battlePage.about.aboutTournament"
                        description="Text describing the details of an esports tournament"
                        defaultMessage="About tournament"
                      />
                    </$span> */}
                    <$p
                      style={{
                        color: COLORS.black,
                        overflow: 'hidden',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {tournament.description && tournament.description?.length > 250
                        ? tournament.description.slice(0, 250) + '...'
                        : tournament.description
                        ? tournament.description
                        : ''}
                    </$p>
                  </$Vertical>

                  <$Horizontal spacing={4} flexWrap={screen === 'mobile'}>
                    <a
                      href={tournament?.communityURL || tournament.tournamentLink || publicTournamentUrl}
                      target="_blank"
                    >
                      <$Button
                        screen={screen}
                        // onClick={() => isInviteEnabled && setIsInviteModalOpen(true)}
                        style={{
                          textTransform: 'capitalize',
                          color: COLORS.trustFontColor,
                          background: COLORS.trustBackground,
                          whiteSpace: 'nowrap',
                          marginTop: '0.67em',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          width: '100%',
                          filter: 'drop-shadow(0px 4px 20px rgba(38, 166, 239, 0.64))',
                        }}
                      >
                        {words.joinCommunity}
                      </$Button>
                    </a>
                    {tournament.magicLink && network && (
                      <$span
                        color={`${COLORS.surpressedFontColor}5a`}
                        style={{
                          marginTop: '0.67em',
                        }}
                      >
                        <$Link
                          color={'inherit'}
                          fontStyle="italic"
                          onClick={() => {
                            if (tournament.magicLink && network) {
                              setCreateModalOpen(true)
                            }
                          }}
                          style={{
                            textDecoration: 'none',
                            textTransform: 'lowercase',
                            lineHeight: 'calc(20px + 1.4rem)',
                          }}
                        >
                          {words.register}
                        </$Link>
                      </$span>
                    )}
                  </$Horizontal>
                </$Horizontal>
              </$Horizontal>
            </$BattlePageSection>
            <$h1>
              <FormattedMessage
                id="battlePage.lotteryHeader"
                defaultMessage="Claim a Lottery Ticket"
                description="Header indicating to user to receive a free NFT lottery ticket."
              />
            </$h1>
            {(!lootboxPartyBaskets || lootboxPartyBaskets?.length === 0) &&
              (!lootboxTournamentSnapshots || lootboxTournamentSnapshots.length === 0) && (
                <Oopsies title={seemsLikeThisTournamentDoesNotHaveAnyLotteryTicketsYet} icon="🧐" />
              )}

            <$SearchInput
              type="search"
              placeholder={`🔍 ${words.searchLootboxesByNameOrAddress}`}
              onChange={(e) => setSearchTerm(e.target.value || '')}
            />
            {!tournament.isPostCosmic
              ? filteredLootboxPartyBaskets.map((data) => {
                  return (
                    <BattlePagePartyBasket
                      lootboxPartyBasket={data}
                      tournamentId={tournament.id as TournamentID}
                      key={`${data.lootbox.address}_${data.partyBasket?.address || ''}`}
                    />
                  )
                })
              : filteredLootboxTournamentSnapshots.map((data) => {
                  return (
                    <BattlePageLootbox
                      key={`${data.address}_${data.address || ''}`}
                      lootboxSnapshot={data}
                      tournamentId={tournament.id}
                    />
                  )
                })}
          </$Vertical>
        </$BattlePageBody>
      </$Vertical>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Stream Selection Modal"
        style={customStyles}
      >
        <$Horizontal
          justifyContent="flex-end"
          style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span onClick={() => setIsModalOpen(false)}>X</span>
        </$Horizontal>
        {!tournament?.streams || (tournament.streams.length === 0 && <Oopsies title={noStreamsMessage} icon="🧐" />)}
        {tournament?.streams && tournament.streams.length > 0 && (
          <$Vertical spacing={2}>
            <$h1 textAlign="center">
              <FormattedMessage
                id="battlePage.chooseStream.header"
                defaultMessage="Choose a Stream"
                description="Header for live esports stream selection modal"
              />
            </$h1>
            <br />
            {tournament.streams.map((stream) => {
              return (
                <$StreamListItem style={{ cursor: 'pointer' }} key={stream.id}>
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
      </Modal>
      <Modal
        isOpen={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        contentLabel="Create Lootbox Modal"
        style={quickCreateModalStyles}
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
    </$BattlePageContainer>
  )
}

const BattlePageWrapper = () => {
  const [params, setParams] = useState<BattlePageUrlParams | undefined>(undefined)
  const words = useWords()

  useEffect(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_BattlePage()
    setParams(INITIAL_URL_PARAMS)
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

  if (!params) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (!params.tournament) {
    return <Oopsies title={words.notFound} icon="🧐" />
  }

  return (
    <BattlePage
      tournamentId={params.tournament as TournamentID}
      streamId={params.stream ? (params.stream as StreamID) : undefined}
    />
  )
}

const $BattlePageContainer = styled.div`
  width: 100%;
  height: 100%;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

const $BattlePageBody = styled.div<{ screen: ScreenSize }>`
  width: 100%;
  padding: 0px ${(props) => (props.screen === 'mobile' ? '0px' : '3rem')};
  box-sizing: border-box;
  max-width: 900px;
  margin: 0 auto;
`

export const $BattlePageSection = styled.div<{ screen: ScreenSize }>`
  width: 100%;
  background: ${COLORS.surpressedBackground}25;
  border-radius: 20px;
  height: auto;
  min-height: 400px;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
`

export const $BattleCardsContainer = styled.div<{ width: string; screen: ScreenSize }>`
  height: ${(props) => (props.screen === 'mobile' ? '300px' : '100%')};
  position: relative;
  ${(props) => props.width && `width: ${props.width};`}
`

export const $BattleCardImage = styled.img<{ cardNumber: number }>`
  position: absolute;
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  border: 0px solid transparent;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
  width: 100%;
  max-width: 90%;
  max-height: 400px;
  background-size: cover;
  margin-left: -${(props) => props.cardNumber * 10}px;
  margin-top: ${(props) => props.cardNumber * 12}px;
  object-fit: contain;
  box-shadow: 2px 4px 5px #a2a2a2;
`

export const $BattleCardBlessed = styled.img<{ screen: ScreenSize; cardNumber: number }>`
  position: absolute;
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  border: 0px solid transparent;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
  width: 100%;
  max-width: 90%;
  max-height: 400px;
  background-size: cover;
  rotate: -${(props) => (props.screen === 'mobile' ? 0 : props.cardNumber * 12)}deg;
  margin-left: -${(props) => props.cardNumber * 20}px;
  margin-top: ${(props) => props.cardNumber * 22}px;
  object-fit: contain;
  box-shadow: 2px 4px 5px #a2a2a2;
`

export const $SocialLogo = styled.img`
  width: 30px;
  height: 30px;
`

export const $TournamentCover = styled.img`
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  border: 0px solid transparent;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
`

const $TournamentCoverPlaceholder = styled.div`
  width: 100%;
  height: 40vh;
  border: 0px solid transparent;
  border-radius: 10px;
  background: #16222a; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #3a6073, #16222a); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #3a6073,
    #16222a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`
export const $SearchInput = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${COLORS.surpressedFontColor}7a;
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${COLORS.surpressedFontColor}7a;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${COLORS.surpressedFontColor}7a;
  }
`

export default BattlePageWrapper
