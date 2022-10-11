import { $Horizontal, $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage } from 'react-intl'
import { $Heading, $SubHeading, background1, $Heading2, $SmallText, $NextButton } from '../contants'
import { GET_LOTTERY_LISTINGS_V2, LotteryListingV2FE, LootboxReferralSnapshot } from '../api.gql'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useQuery } from '@apollo/client'
import {
  LootboxStatus,
  LootboxTournamentStatus,
  QueryTournamentArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { ErrorCard, LoadingCard } from './GenericCard'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

const PAGE_SIZE = 6

interface Props {
  onNext: () => void
  onBack: () => void
}
const ChooseLottery = (props: Props) => {
  const [page, setPage] = useState(0)
  const { referral, setChosenLootbox } = useViralOnboarding()
  const words = useWords()
  const { data, loading, error } = useQuery<{ tournament: LotteryListingV2FE | ResponseError }, QueryTournamentArgs>(
    GET_LOTTERY_LISTINGS_V2,
    {
      variables: {
        id: referral?.tournamentId || '',
      },
    }
  )

  const tournament = useMemo(() => {
    return data?.tournament?.__typename === 'TournamentResponseSuccess' ? data.tournament.tournament : null
  }, [data])

  const [tickets, hasNextPage] = useMemo<[LootboxReferralSnapshot[], boolean]>(() => {
    if (!tournament) {
      return [[], false]
    }

    const tickets = [
      ...tournament.lootboxSnapshots.filter(
        (t) => t.status !== LootboxTournamentStatus.Disabled && t.lootbox.status !== LootboxStatus.Disabled
      ),
    ]
    tickets.sort((a, b) => {
      if (referral?.seedLootboxID && a.lootboxID === referral.seedLootboxID) {
        // Bring to begining of array
        return -1
      }

      if (a.lootbox.status === LootboxStatus.SoldOut) {
        return 1
      }

      if (b.lootbox.status === LootboxStatus.SoldOut) {
        return -1
      }

      return 0
    })

    console.log('received tickets', tickets)

    const paginated = tickets.slice(0, PAGE_SIZE * (page + 1))

    return [paginated, paginated.length < tickets.length]
  }, [page, tournament?.lootboxSnapshots, referral?.seedLootboxID])

  if (loading) {
    return <LoadingCard />
  } else if (error || !data) {
    return <ErrorCard message={error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <ErrorCard message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

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
            {tickets.map((ticket, idx) => {
              const description = !ticket?.lootbox?.description
                ? ''
                : ticket.lootbox.description.length > 80
                ? ticket.lootbox.description.slice(0, 80) + '...'
                : ticket?.lootbox?.description
              const isDisabled =
                ticket?.lootbox?.status &&
                [LootboxStatus.SoldOut, LootboxStatus.Disabled].indexOf(ticket.lootbox.status) > -1
              return (
                <$LotteryContainer
                  onClick={() => {
                    if (isDisabled) {
                      return
                    }
                    // setChosenLootbox(ticket.lootbox)
                    setChosenLootbox({
                      nftBountyValue: ticket.lootbox.nftBountyValue,
                      address: ticket.address,
                      id: ticket.lootbox.id,
                      stampImage: ticket.stampImage,
                    })
                    props.onNext()
                  }}
                  key={`selection-${idx}`}
                  type={ticket?.lootboxID === referral?.seedLootboxID ? 'highlight' : 'default'}
                  style={{
                    cursor: !isDisabled ? 'pointer' : 'not-allowed',
                    position: 'relative',
                  }}
                >
                  {ticket.lootbox.status === LootboxStatus.SoldOut && (
                    <$SoldOut>{`📦 ${words.outOfStock} 📦`}</$SoldOut>
                  )}
                  <$Horizontal spacing={2}>
                    <$PartyBasketImage
                      src={
                        ticket?.stampImage
                          ? convertFilenameToThumbnail(ticket.stampImage, 'sm')
                          : TEMPLATE_LOOTBOX_STAMP
                      }
                      alt={ticket?.lootbox?.name || 'Lootbox NFT'}
                    />
                    <$Vertical>
                      <$SmallText style={{ color: COLORS.black, textAlign: 'start', marginTop: '5px' }}>
                        {words.win} {ticket?.lootbox?.nftBountyValue}
                      </$SmallText>
                      <$Heading2
                        style={{
                          color: COLORS.black,
                          textAlign: 'start',
                          margin: '0px',
                          fontSize: TYPOGRAPHY.fontSize.large,
                          lineHeight: TYPOGRAPHY.fontSize.xxlarge,
                        }}
                      >
                        {ticket?.lootbox?.name}
                      </$Heading2>
                      <$SmallText style={{ color: COLORS.black, textAlign: 'start' }}>{description}</$SmallText>
                    </$Vertical>
                  </$Horizontal>
                </$LotteryContainer>
              )
            })}
            {hasNextPage && (
              <$NextButton
                onClick={() => setPage(page + 1)}
                style={{ color: COLORS.white, background: COLORS.trustBackground }}
              >
                {words.seeMore}
              </$NextButton>
            )}
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
  box-shadow: ${(props) => (props.type === 'highlight' ? `0px 3px 50px #00a3ff` : 'none')};
`

const $PartyBasketImage = styled.img`
  border-radius: 5px;
  max-height: 180px;
  height: 100%;
  max-width: 35%;
`

const $SoldOut = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.white};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  text-transform: uppercase;
`

export default ChooseLottery
