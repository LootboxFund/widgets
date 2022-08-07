import { $Horizontal, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage } from 'react-intl'
import { $Heading, $SubHeading, background1, $Heading2, $SmallText } from '../contants'
import { GET_LOTTERY_LISTINGS } from '../api.gql'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useQuery } from '@apollo/client'
import {
  LootboxTournamentSnapshot,
  PartyBasket,
  QueryTournamentArgs,
  TournamentResponse,
  TournamentResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { ErrorCard, LoadingCard } from './GenericCard'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'

interface LootboxPartyBasket {
  lootbox: LootboxTournamentSnapshot
  partyBasket: PartyBasket
}

interface Props {
  onNext: () => void
  onBack: () => void
}
const ChooseLottery = (props: Props) => {
  const { referral, setChosenPartyBasket, chosenPartyBasket } = useViralOnboarding()
  const words = useWords()
  const { data, loading, error } = useQuery<{ tournament: TournamentResponse }, QueryTournamentArgs>(
    GET_LOTTERY_LISTINGS,
    {
      variables: {
        id: referral?.tournamentId || '',
      },
    }
  )

  if (loading) {
    return <LoadingCard />
  } else if (error || !data) {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <ErrorCard message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const { tournament } = data.tournament as TournamentResponseSuccess

  let lootboxPartyBaskets: LootboxPartyBasket[] = []
  const seenLootboxId: string[] = []
  let highligted: LootboxPartyBasket | undefined = undefined
  tournament.lootboxSnapshots?.forEach((snapshot) => {
    if (snapshot.partyBaskets && snapshot.partyBaskets.length > 0) {
      snapshot.partyBaskets.forEach((partyBasket) => {
        const doc: LootboxPartyBasket = {
          lootbox: snapshot,
          partyBasket,
        }
        if (partyBasket.id === referral?.seedPartyBasketId) {
          //   lootboxPartyBaskets.unshift(doc)
          highligted = doc
        } else {
          if (
            seenLootboxId.includes(doc.lootbox.address) ||
            (highligted && highligted.lootbox.address === doc.lootbox.address)
          ) {
            lootboxPartyBaskets.push(doc)
          } else {
            lootboxPartyBaskets.unshift(doc)
          }
        }
      })
    }
  })
  // Hacky shit to get the highlighted and slightly depuped tickets
  lootboxPartyBaskets = !!highligted ? [highligted, ...lootboxPartyBaskets] : [...lootboxPartyBaskets]

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical>
          <$Heading2 style={{ textAlign: 'start' }}>
            <FormattedMessage
              id="viralOnboarding.chooseLottery.heading"
              defaultMessage="Choose Your FREE Lottery"
              description="Heading for lottery gift"
            />
          </$Heading2>
          <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>
            <FormattedMessage
              id="viralOnboarding.chooseLottery.description"
              defaultMessage="Each Ticket is a Team competing in a cash prize tournament. You only win money if your chosen team wins."
            />
          </$SubHeading>
          <$Vertical spacing={4} style={{ margin: '0px -10px' }}>
            {lootboxPartyBaskets.map((data, idx) => {
              const description = !data?.lootbox?.description
                ? ''
                : data.lootbox.description.length > 80
                ? data.lootbox.description.slice(0, 80) + '...'
                : data?.lootbox?.description
              return (
                <$LotteryContainer
                  onClick={() => {
                    setChosenPartyBasket(data.partyBasket)
                    props.onNext()
                  }}
                  key={`selection-${idx}`}
                  type={data.partyBasket?.id === referral?.seedPartyBasketId ? 'highlight' : 'default'}
                >
                  <$Horizontal spacing={2}>
                    <$PartyBasketImage
                      src={data?.lootbox?.stampImage || ''}
                      alt={data?.partyBasket?.name || 'Lootbox NFT'}
                    />
                    <$Vertical>
                      <$SmallText style={{ color: COLORS.black, textAlign: 'start', marginTop: '5px' }}>
                        {words.win} {data?.partyBasket?.nftBountyValue}
                      </$SmallText>
                      <$Heading2
                        style={{
                          color: COLORS.black,
                          textAlign: 'start',
                          margin: '0px',
                          fontSize: TYPOGRAPHY.fontSize.large,
                        }}
                      >
                        {data?.partyBasket?.name}
                      </$Heading2>
                      <$SmallText style={{ color: COLORS.black, textAlign: 'start' }}>{description}</$SmallText>
                    </$Vertical>
                  </$Horizontal>
                </$LotteryContainer>
              )
            })}
          </$Vertical>
        </$Vertical>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const $LotteryContainer = styled.div<{ type?: 'default' | 'highlight' | 'locked' }>`
  width: 100%;
  background: ${COLORS.white};
  border-radius: 10px;
  height: 200px;
  padding: 0.65rem;
  box-sizing: border-box;
  overflow: hidden;
  cursor: ${(props) => (props.type === 'locked' ? 'not-allowed' : 'pointer')};
  filter: ${(props) => (props.type === 'highlight' ? 'drop-shadow(0px 0px 50px #00a3ff)' : 'none')};
`

const $PartyBasketImage = styled.img`
  border-radius: 5px;
  max-height: 180px;
  height: 100%;
  max-width: 35%;
`

export default ChooseLottery
