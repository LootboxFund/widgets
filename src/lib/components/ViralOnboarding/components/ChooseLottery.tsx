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
import { COLORS, LootboxID, TournamentID, TYPOGRAPHY } from '@wormgraph/helpers'
import useWords from 'lib/hooks/useWords'
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

const PAGE_SIZE = 6

interface Props {
  onNext: (lootboxID: LootboxID) => Promise<void>
  onBack: () => void
}
const ChooseLottery = (props: Props) => {
  const [searchString, setSearchString] = useState('')
  const [page, setPage] = useState(0)
  const { referral, setChosenLootbox } = useViralOnboarding()
  const words = useWords()
  const [errorMessage, setErrorMessage] = useState('')
  const [localLoading, setLocalLoading] = useState(false)
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

    if (searchString.length > 0) {
      const paginated = tickets.filter((t) => {
        return t?.lootbox?.name ? t.lootbox.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 : false
      })

      return [paginated, false]
    } else {
      const paginated = tickets.slice(0, PAGE_SIZE * (page + 1))

      return [paginated, paginated.length < tickets.length]
    }
  }, [page, tournament?.lootboxSnapshots, referral?.seedLootboxID, searchString])

  if (loading || localLoading) {
    return <LoadingCard />
  } else if (error || errorMessage || !data) {
    return (
      <ErrorCard message={errorMessage || error?.message || ''} title={words.anErrorOccured} icon="🤕">
        {errorMessage && (
          <$SubHeading onClick={() => setErrorMessage('')} style={{ fontStyle: 'italic', textTransform: 'lowercase' }}>
            {words.retry + '?'}
          </$SubHeading>
        )}
      </ErrorCard>
    )
  } else if (data?.tournament?.__typename === 'ResponseError') {
    return <ErrorCard message={data?.tournament?.error?.message || ''} title={words.anErrorOccured} icon="🤕" />
  }

  const hardcodedTournamentsNonEsports: TournamentID[] = [
    '1qKLXgaRXviPP110ZHLe' as TournamentID, // Angkas
    'RV09iGE02V7nOgEbq8hW' as TournamentID, // GCash
    'tX5tCISFjDcWmctvILnk' as TournamentID, // MetaCare
    'fPxO1FXLyu6p39FTf9yq' as TournamentID, // Binance
    'pMkl6CSOuEsyQDvJzvA5' as TournamentID, // Cash Giveaway 1
    'LGT4JtA6sV73KhXVcCEH' as TournamentID, // Cash Giveaway 2
    'G0ESRAL0O4OcgZ7Bw38M' as TournamentID, // Cash Giveaway 3
    'C3msweDHfYCesJ2SWxeC' as TournamentID, // Cash Giveaway 4
    'LFqlqg3UcPx8E0pu0mTu' as TournamentID, // Prod Test
  ]
  const nonEsportsEvents = hardcodedTournamentsNonEsports.includes(referral.tournamentId)

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical>
          <$Heading2 style={{ textAlign: 'start' }}>
            <FormattedMessage
              id="viralOnboarding.chooseLottery.heading"
              defaultMessage="Choose Your FREE Ticket"
              description="Heading for ticket gift"
            />
          </$Heading2>

          <$SubHeading style={{ marginTop: '0px', textAlign: 'start' }}>
            {nonEsportsEvents ? (
              'Each Ticket has a chance to win the prize. Share with friends to get more tickets.'
            ) : (
              <FormattedMessage
                id="viralOnboarding.chooseLottery.description"
                defaultMessage="Each Ticket is a Team competing in a cash prize tournament. You only win money if your chosen team wins."
              />
            )}
          </$SubHeading>
          <$InputMedium
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search by team name"
          />
          <br />
          <br />
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
                  onClick={async () => {
                    setErrorMessage('')

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
                    setLocalLoading(true)
                    try {
                      await props.onNext(ticket.lootbox.id)
                    } catch (err) {
                      console.error(err)
                      setErrorMessage(err.message)
                    } finally {
                      setLocalLoading(false)
                    }
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

const $InputMedium = styled.input`
  background-color: ${`${COLORS.white}`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

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
