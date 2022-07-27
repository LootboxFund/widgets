import { useQuery } from '@apollo/client'
import { COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import {
  LootboxTournamentSnapshot,
  PartyBasket,
  QueryTournamentArgs,
  Stream,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import useWords from 'lib/hooks/useWords'
import { TournamentID, StreamID } from 'lib/types'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { $h1, $h2, $h3, $Horizontal, $p, $span, $Vertical } from '../Generics'
import Spinner from '../Generics/Spinner'
import { $Link, Oopsies } from '../Profile/common'
import { useTournamentWords } from '../Tournament/common'
import { GET_TOURNAMENT_BATTLE_PAGE } from './api.gql'
import LiveStreamVideo from './LiveStreamVideo'
import { extractURLState_BattlePage, BattlePageUrlParams } from './utils'
import { getSocials, TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import $Button from '../Generics/Button'
import { manifest } from 'manifest'
import { getSocialUrlLink, SocialType } from 'lib/utils/socials'

interface LootboxPartyBasket {
  lootbox: LootboxTournamentSnapshot
  partyBasket?: PartyBasket
}

interface BattlePageParams {
  tournamentId: TournamentID
  streamId?: StreamID
}
const BattlePage = (props: BattlePageParams) => {
  const { data, loading, error } = useQuery<{ tournament: TournamentResponse }, QueryTournamentArgs>(
    GET_TOURNAMENT_BATTLE_PAGE,
    {
      variables: {
        id: props.tournamentId,
      },
    }
  )
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <Oopsies message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess

  // Find the stream from  the URL params
  const stream: Stream | undefined = props.streamId
    ? tournament.streams?.find((stream) => stream.id === props.streamId)
    : !!tournament.streams
    ? tournament.streams[0]
    : undefined

  const lootboxPartyBaskets: LootboxPartyBasket[] = []
  tournament.lootboxSnapshots?.forEach((snapshot) => {
    if (snapshot.partyBaskets && snapshot.partyBaskets.length > 0) {
      snapshot.partyBaskets.forEach((partyBasket) => {
        lootboxPartyBaskets.push({
          lootbox: snapshot,
          partyBasket: partyBasket,
        })
      })
    } else {
      lootboxPartyBaskets.push({
        lootbox: snapshot,
      })
    }
  })

  const Socials = ({ lootboxSnapshot }: { lootboxSnapshot: LootboxTournamentSnapshot }) => {
    const flatSocials = Object.entries(lootboxSnapshot.socials)
      .filter((fack) => fack[0] !== '__typename')
      .filter((fack) => !!fack[1]) // Filter graphql ting
    return (
      <$Vertical spacing={4} style={{ paddingTop: screen === 'mobile' ? '10px' : 'auto' }}>
        <$h3
          style={{
            textTransform: 'capitalize',
            color: COLORS.black,
            textAlign: screen === 'mobile' ? 'center' : 'left',
          }}
        >
          <FormattedMessage
            id="battlePage.socials.followSocials"
            defaultMessage="Follow socials"
            description="Text prompting user to follow social media"
          />
        </$h3>
        <$Horizontal flexWrap justifyContent="space-between">
          {flatSocials.map(([platform, value]) => {
            const socialData = SOCIALS.find((soc) => soc.slug === platform.toLowerCase())
            if (socialData) {
              const url = getSocialUrlLink(socialData.slug as SocialType, value as string)
              return (
                <$Horizontal spacing={2} style={{ paddingBottom: '10px' }}>
                  <$SocialLogo src={socialData.icon} />
                  <a
                    href={url}
                    style={{
                      width: '100px',
                      margin: 'auto 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: url ? 'pointer' : 'unset',
                      textDecoration: 'none',
                    }}
                  >
                    <$span>{value}</$span>
                  </a>
                </$Horizontal>
              )
            } else {
              return null
            }
          })}
        </$Horizontal>
      </$Vertical>
    )
  }

  return (
    <$BattlePageContainer>
      <$Vertical spacing={4}>
        {!!stream && <LiveStreamVideo stream={stream} />}
        {!stream && <>No stream selected</>}
        <$BattlePageBody screen={screen}>
          <$Vertical spacing={4} height="100%">
            {!!stream && (
              <$span>
                <FormattedMessage
                  id="battlePage.streamText.switchStreamText"
                  defaultMessage='You are watching "{streamName}". To switch to another stream, {clickHereHyperlink}'
                  description="Text shown to user to allow them to switch streams. Stream is a live video feed of an esports tournament."
                  values={{
                    streamName: stream.name,
                    clickHereHyperlink: (
                      <$Link href="#" style={{ textTransform: 'lowercase' }}>
                        {words.clickHere}.
                      </$Link>
                    ),
                  }}
                />
              </$span>
            )}
            <$BattlePageSection screen={screen}>
              <$Horizontal height="100%" width="100%" flexWrap={screen === 'mobile'} spacing={2}>
                <$Vertical height="100%" spacing={2} style={{ margin: '0 auto' }}>
                  <$BattleCardsContainer screen={screen} width="220px">
                    {tournament.lootboxSnapshots?.length ? (
                      tournament.lootboxSnapshots?.slice(0, 2)?.map((snap, idx2) => {
                        return (
                          <$BattleCardImage src={snap.stampImage} cardNumber={idx2} key={`tournament-img-${idx2}`} />
                        )
                      })
                    ) : (
                      <$BattleCardImage src={TEMPLATE_LOOTBOX_STAMP} cardNumber={0} />
                    )}
                  </$BattleCardsContainer>
                </$Vertical>
                <$Vertical height="100%" spacing={2}>
                  <$h1 style={{ textAlign: screen === 'mobile' ? 'center' : 'left' }}>{tournament.title}</$h1>
                  {tournament.prize && (
                    <$span
                      style={{
                        textTransform: 'capitalize',
                        color: COLORS.black,
                        textAlign: screen === 'mobile' ? 'center' : 'left',
                      }}
                    >
                      {tournament.prize} {words.prize}
                    </$span>
                  )}
                  <$span
                    style={{
                      textTransform: 'capitalize',
                      color: COLORS.black,
                      marginTop: '20px',
                      fontWeight: TYPOGRAPHY.fontWeight.bold,
                      textAlign: screen === 'mobile' ? 'center' : 'left',
                    }}
                  >
                    <FormattedMessage
                      id="battlePage.about.aboutTournament"
                      description="Text describing the details of an esports tournament"
                      defaultMessage="About tournament"
                    />
                  </$span>
                  <$p
                    style={{
                      color: COLORS.black,
                      overflow: 'hidden',
                      whiteSpace: 'pre-line',
                      textAlign: screen === 'mobile' ? 'center' : 'left',
                    }}
                  >
                    {tournament.description && tournament.description?.length > 250
                      ? tournament.description.slice(0, 250) + '...'
                      : tournament.description
                      ? tournament.description
                      : ''}
                  </$p>
                </$Vertical>
              </$Horizontal>
            </$BattlePageSection>
            <$h1 style={{ textAlign: screen === 'mobile' ? 'center' : 'left' }}>
              <FormattedMessage
                id="battlePage.lotteryHeader"
                defaultMessage="Claim a Lottery Ticket"
                description="Header indicating to user to receive a free NFT lottery ticket."
              />
            </$h1>
            {lootboxPartyBaskets.map((data) => {
              return (
                <$BattlePageSection screen={screen}>
                  <$Horizontal height="100%" width="100%" flexWrap={screen === 'mobile'} spacing={2}>
                    <$Vertical height="100%" spacing={2} style={{ margin: '0 auto' }}>
                      <$BattleCardsContainer screen={screen} width="220px">
                        <$BattleCardImage src={data.lootbox?.stampImage} cardNumber={0} />
                      </$BattleCardsContainer>
                      <span
                        style={{
                          textAlign: 'center',
                          width: '90%',
                          paddingBottom: screen === 'mobile' ? '12px' : 'auto',
                        }}
                      >
                        🎁{' '}
                        <$Link
                          href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${data.lootbox.address}`}
                          style={{
                            color: `${COLORS.surpressedFontColor}ce`,
                            textDecoration: 'none',
                          }}
                          target="_blank"
                        >
                          {words.buyLootbox}
                        </$Link>
                      </span>
                    </$Vertical>
                    <$Vertical height="100%" spacing={2}>
                      <$Horizontal justifyContent="space-between" flexWrap={screen !== 'desktop'} spacing={2}>
                        <$Vertical>
                          <$h1 style={{ marginBottom: '0', textAlign: screen === 'mobile' ? 'center' : 'left' }}>
                            {data?.partyBasket?.name || data?.lootbox?.name}
                          </$h1>
                          <$p style={{ color: COLORS.black, textAlign: screen === 'mobile' ? 'center' : 'left' }}>
                            {data?.lootbox?.description && data?.lootbox?.description?.length > 250
                              ? data?.lootbox?.description.slice(0, 250) + '...'
                              : data?.lootbox?.description
                              ? data?.lootbox?.description
                              : ''}
                          </$p>
                        </$Vertical>
                        <$Vertical
                          style={{
                            margin: screen === 'mobile' ? '0 auto' : 'unset',
                          }}
                        >
                          <div>
                            <$Button
                              screen={screen}
                              onClick={() =>
                                data?.partyBasket &&
                                window.open(
                                  `${manifest.microfrontends.webflow.basketRedeemPage}?basket=${data.partyBasket.address}`,
                                  '_blank'
                                )
                              }
                              style={{
                                textTransform: 'capitalize',
                                color: COLORS.trustFontColor,
                                background: data.partyBasket
                                  ? COLORS.trustBackground
                                  : `${COLORS.surpressedBackground}ae`,
                                whiteSpace: 'nowrap',
                                marginTop: '0.67em',
                                cursor: data.partyBasket ? 'pointer' : 'not-allowed',
                              }}
                            >
                              {data.partyBasket ? (
                                <FormattedMessage
                                  id="battlePage.button.claimLottery"
                                  defaultMessage="Claim lottery"
                                  description="Text prompting user to claim a lottery ticket"
                                />
                              ) : (
                                <FormattedMessage
                                  id="battlePage.button.noneAvailable"
                                  defaultMessage="None available"
                                  description="Text indicating that something is not available"
                                />
                              )}
                            </$Button>
                          </div>

                          {data.partyBasket?.nftBountyValue && (
                            <$span
                              style={{
                                textTransform: 'capitalize',
                                color: COLORS.black,
                                textAlign: 'center',
                                paddingTop: '10px',
                              }}
                            >
                              {words.win} {data.partyBasket.nftBountyValue}
                            </$span>
                          )}
                        </$Vertical>
                      </$Horizontal>
                      <Socials lootboxSnapshot={data.lootbox} />
                    </$Vertical>
                  </$Horizontal>
                </$BattlePageSection>
              )
            })}
          </$Vertical>
        </$BattlePageBody>
      </$Vertical>
    </$BattlePageContainer>
  )
}

const BattlePageWrapper = () => {
  const [params, setParams] = useState<BattlePageUrlParams | undefined>(undefined)
  const words = useWords()

  useEffect(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_BattlePage()
    setParams(INITIAL_URL_PARAMS)
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
`

const $BattlePageSection = styled.div<{ screen: ScreenSize }>`
  width: 100%;
  background: ${COLORS.surpressedBackground}25;
  border-radius: 20px;
  height: ${(props) => (props.screen === 'mobile' ? 'auto' : '400px')};
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
`

const $BattleCardsContainer = styled.div<{ width: string; screen: ScreenSize }>`
  height: ${(props) => (props.screen === 'mobile' ? '300px' : '100%')};
  position: relative;
  ${(props) => props.width && `width: ${props.width};`}
`

const $BattleCardImage = styled.img<{ cardNumber: number }>`
  position: absolute;
  width: 100%;
  max-width: 90%;
  max-height: 400px;
  background-size: cover;
  margin-left: -${(props) => props.cardNumber * 10}px;
  margin-top: ${(props) => props.cardNumber * 12}px;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));
  object-fit: contain;
`

export const $SocialLogo = styled.img`
  width: 30px;
  height: 30px;
`

export default BattlePageWrapper
