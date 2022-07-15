import { $h1, $h2, $Horizontal, $p, $span, $Vertical } from '../Generics'
import { useQuery } from '@apollo/client'
import {
  BattleFeedResponse,
  BattleFeedResponseSuccess,
  QueryBattleFeedArgs,
  Tournament,
} from 'lib/api/graphql/generated/types'
import { QUERY_BATTLE_FEED } from './api.gql'
import Spinner from '../Generics/Spinner'
import { Oopsies } from '../Profile/common'
import { useState } from 'react'
import $Button from '../Generics/Button'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { manifest } from 'manifest'
import useWords from 'lib/hooks/useWords'
import { useIntl } from 'react-intl'

const BattleFeed = () => {
  const words = useWords()
  const intl = useIntl()
  const { screen } = useWindowSize()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [lastTournament, setLastTournament] = useState<null | string>(null)
  const { data, loading, error } = useQuery<{ battleFeed: BattleFeedResponse }, QueryBattleFeedArgs>(
    QUERY_BATTLE_FEED,
    {
      variables: { first: 6, after: lastTournament },
      onCompleted: (data) => {
        if (data?.battleFeed?.__typename === 'BattleFeedResponseSuccess') {
          const nodes = data.battleFeed.edges
          setTournaments([...tournaments, ...nodes.map((node) => node.node)])
        }
      },
    }
  )

  const startsToday = intl.formatMessage({
    id: 'battleFeed.msg.startsToday',
    defaultMessage: 'Starts today',
    description: 'Text indicating a tournament or something starts today',
  })

  const battleFinished = intl.formatMessage({
    id: 'battleFeed.msg.battleFinished',
    defaultMessage: 'Battle finished',
    description: 'Text indicating a tournament is finished',
  })

  if (error) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.battleFeed?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.battleFeed?.error?.message || ''} icon="🤕" />
  }

  const { edges, pageInfo } = (data?.battleFeed as BattleFeedResponseSuccess) || {}

  const handleMore = () => {
    setLastTournament(pageInfo?.endCursor || null)
  }

  const goToTournamentPage = (tourny: Tournament) => {
    window.open(`${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tourny.id}`, '_self')
  }

  return (
    <$Vertical spacing={4}>
      <$Horizontal flexWrap spacing={2}>
        {tournaments.map((tourny, idx) => {
          const daysDiff = tourny.tournamentDate
            ? Math.round((new Date(tourny.tournamentDate).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24))
            : undefined

          return (
            <$BattleContainer key={`battle_${idx}`} screen={screen} onClick={() => goToTournamentPage(tourny)}>
              <$Horizontal height="100%" spacing={2}>
                <$BattleCardsContainer width="40%">
                  {tourny.lootboxSnapshots?.length ? (
                    tourny.lootboxSnapshots?.slice(0, 2)?.map((snap, idx2) => {
                      return <$BattleCardImage src={snap.stampImage} cardNumber={idx2} />
                    })
                  ) : (
                    <$BattleCardImage
                      src={TEMPLATE_LOOTBOX_STAMP}
                      cardNumber={0}
                      style={{
                        maxWidth: '100%',
                      }}
                    />
                  )}
                </$BattleCardsContainer>
                <$Vertical width="60%">
                  {tourny.prize && (
                    <$Vertical>
                      <$span
                        style={{
                          color: `${COLORS.surpressedFontColor}5f`,
                          fontSize: TYPOGRAPHY.fontSize.small,
                          fontStyle: 'italic',
                        }}
                      >
                        {words.prize}
                      </$span>
                      <$span
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          fontSize: TYPOGRAPHY.fontSize.xlarge,
                          lineHeight: TYPOGRAPHY.fontSize.xxlarge,
                          fontWeight: TYPOGRAPHY.fontWeight.light,
                        }}
                      >
                        {tourny.prize}
                      </$span>
                    </$Vertical>
                  )}

                  <$h2
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {tourny.title}
                  </$h2>
                  <$p
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      marginTop: '0px',
                      height: 'calc(1.4rem * 3)',
                    }}
                  >
                    {tourny.description}
                  </$p>
                  {daysDiff != undefined && (
                    <$span
                      style={{
                        color: `${COLORS.surpressedFontColor}5f`,
                        fontSize: TYPOGRAPHY.fontSize.small,
                        fontStyle: 'italic',
                        textTransform: 'lowercase',
                      }}
                    >
                      {daysDiff > 0 ? words.inDays(daysDiff) : daysDiff === 0 ? startsToday : battleFinished}
                    </$span>
                  )}
                </$Vertical>
              </$Horizontal>
            </$BattleContainer>
          )
        })}
      </$Horizontal>
      {loading && (
        <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} size="50px" />
      )}
      {pageInfo?.hasNextPage && (
        <div
          style={{
            margin: '0 auto',
          }}
        >
          <$Button
            screen={screen}
            onClick={handleMore}
            style={{
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              color: COLORS.trustFontColor,
              backgroundColor: COLORS.trustBackground,
              transform: 'capitalize',
            }}
          >
            {words.seeMore}
          </$Button>
        </div>
      )}
    </$Vertical>
  )
}

const $BattleContainer = styled.div<{ screen: ScreenSize }>`
  width: ${(props) => (props.screen === 'desktop' ? '48%' : '100%')};
  height: 260px;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  margin-bottom: 10px;
  padding: 26px;
  box-sizing: border-box;
  cursor: pointer;
`

const $BattleCardsContainer = styled.div<{ width: string }>`
  position: relative;
  ${(props) => props.width && `width: ${props.width};`}
`

const $BattleCardImage = styled.img<{ cardNumber: number }>`
  position: absolute;
  width: 100%;
  max-width: 90%;
  max-height: 100%;
  background-size: cover;
  margin-left: -${(props) => props.cardNumber * 10}px;
  margin-top: ${(props) => props.cardNumber * 12}px;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));
  object-fit: contain;
`

export default BattleFeed
