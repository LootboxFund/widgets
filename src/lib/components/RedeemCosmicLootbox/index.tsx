import { Address, chainIdHexToName, COLORS, LootboxID, LootboxTicketID_Web3, TYPOGRAPHY } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import LogRocket from 'logrocket'
import { useEffect, useMemo, useState } from 'react'
import AuthGuard from '../AuthGuard'
import { Oopsies } from '../Profile/common'
import {
  GET_LOOTBOX_REDEEM_PAGE,
  GetLootboxRedeemPageResponseFE,
  LootboxRedemptionFE,
  GetLootboxRedeemPageResponseFESuccess,
  UserClaimFE,
  GET_USER_CLAIM_COUNT,
  GetUserClaimCountFE,
  GetUserClaimCountFESuccess,
  GetLootboxRedemptionClaimsFE,
  GET_LOOTBOX_CLAIMS_TO_REDEEM,
} from './api.gql'
import { useQuery } from '@apollo/client'
import { LootboxUserClaimsArgs, QueryGetLootboxByIdArgs, UserClaimsCursor } from 'lib/api/graphql/generated/types'
import Spinner, { LoadingText } from '../Generics/Spinner'
import { $Horizontal, $Vertical } from '../Generics'
import styled from 'styled-components'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import useWords from 'lib/hooks/useWords'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { useLootbox } from 'lib/hooks/useLootbox'
import RedeemButton from './RedeemButton'
import { SwitchTicketComponent } from './SwitchTicketComponent'
import { truncateAddress } from 'lib/api/helpers'
import { $Button } from 'lib/components/Generics/Button'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import { withdrawCosmic } from 'lib/api/redeemNFT'
import { parseEth } from 'lib/utils/bnConversion'
import { Deposit } from 'lib/hooks/useLootbox/utils'
import { useAuth } from 'lib/hooks/useAuth'

export const onloadWidget = async () => {
  initLogging()
  try {
    await initDApp()
  } catch (err) {
    LogRocket.captureException(err)
  }
}

export type RedeemState = 'no-claims' | 'no-whitelist' | 'not-minted' | 'ready'
const RedeemCosmicLootbox = ({ lootboxID }: { lootboxID: LootboxID }) => {
  const { screen } = useScreenSize()
  const words = useWords()
  const userSnapshot = useSnapshot(userState)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { connectWallet } = useAuth()
  const [claimIdx, setClaimIdx] = useState(0) // should index data.getLootboxByID.lootbox.mintWhitelistSignatures
  const [isPolling, setIsPolling] = useState(false)
  const [showAllDeposits, setShowAllDeposits] = useState(false)
  const [cursor, setCursor] = useState<UserClaimsCursor>({
    startAfter: null,
    endBefore: null,
  })

  const {
    data: dataLootbox,
    loading: loadingLootboxQuery,
    error: errorLootbox,
  } = useQuery<GetLootboxRedeemPageResponseFE, QueryGetLootboxByIdArgs>(GET_LOOTBOX_REDEEM_PAGE, {
    variables: { id: lootboxID },
  })

  const {
    data: dataClaims,
    loading: loadingClaims,
    error,
    startPolling,
    stopPolling,
  } = useQuery<GetLootboxRedemptionClaimsFE, QueryGetLootboxByIdArgs & LootboxUserClaimsArgs>(
    GET_LOOTBOX_CLAIMS_TO_REDEEM,
    {
      variables: { id: lootboxID, first: 1, cursor },
      onCompleted: (data) => {
        if (data?.getLootboxByID?.__typename === 'LootboxResponseSuccess') {
          const [newClaimData] = data?.getLootboxByID?.lootbox?.userClaims?.edges.map((edge) => edge.node) || []

          if (
            isPolling &&
            claimData?.id === newClaimData?.id &&
            newClaimData?.whitelist?.isRedeemed &&
            !!newClaimData?.whitelist?.lootboxTicket
          ) {
            stopPolling()
            setIsPolling(false)
          }
        }
      },
    }
  )

  const {
    data: claimCountData,
    loading: loadingClaimCountQuery,
    error: errorClaimCount,
  } = useQuery<GetUserClaimCountFE, QueryGetLootboxByIdArgs & LootboxUserClaimsArgs>(GET_USER_CLAIM_COUNT, {
    variables: { id: lootboxID, first: 1 },
  })
  const { lootboxData }: { lootboxData: LootboxRedemptionFE | null } = useMemo(() => {
    const lootboxData = (dataLootbox?.getLootboxByID as GetLootboxRedeemPageResponseFESuccess)?.lootbox || null
    return { lootboxData }
  }, [dataLootbox?.getLootboxByID])

  const nClaims: number = useMemo<number>(() => {
    return (claimCountData?.getLootboxByID as GetUserClaimCountFESuccess)?.lootbox?.userClaims?.totalCount || 0
  }, [claimCountData?.getLootboxByID])

  const {
    loading: loadingLootboxWeb3,
    proratedDeposits,
    deposits: allDeposits,
    loadProratedDepositsIntoState,
    mintTicket,
  } = useLootbox({
    lootboxAddress: lootboxData?.address,
    chainIDHex: lootboxData?.chainIdHex,
  })

  const allLoading = loadingLootboxWeb3 || isLoading

  const claimData: UserClaimFE | undefined = useMemo(() => {
    if (dataClaims?.getLootboxByID?.__typename === 'LootboxResponseSuccess') {
      const [claimData] = dataClaims?.getLootboxByID?.lootbox?.userClaims?.edges.map((edge) => edge.node) || []
      return claimData
    } else {
      return undefined
    }
  }, [dataClaims])

  useEffect(() => {
    const ticketID = claimData?.whitelist?.lootboxTicket?.ticketID

    if (!ticketID || proratedDeposits[ticketID] != undefined) {
      return
    }
    loadProratedDepositsIntoState(ticketID)
  }, [claimData?.whitelist?.lootboxTicket?.ticketID, proratedDeposits])

  const ticketProratedDeposits: Deposit[] = useMemo(() => {
    if (proratedDeposits && claimData?.whitelist?.lootboxTicket?.ticketID) {
      return proratedDeposits[claimData.whitelist.lootboxTicket.ticketID] || []
    } else {
      return []
    }
  }, [proratedDeposits, claimData?.whitelist?.lootboxTicket?.ticketID])

  const incrementClaimIdx = (incrementAmount: number) => {
    if (loadingClaimCountQuery) {
      return
    }
    setErrorMessage('')
    if (claimIdx + incrementAmount >= nClaims) {
      // start at begining
      setCursor({
        startAfter: null,
        endBefore: null,
      })
      setClaimIdx(0)
    } else {
      setCursor({
        startAfter: claimData?.timestamps.createdAt || null,
        endBefore: null,
      })
      setClaimIdx((claimIdx) => claimIdx + incrementAmount)
    }
  }

  const decrementClaimIdx = (decrementAmount: number) => {
    if (loadingClaimCountQuery) {
      return
    }
    setErrorMessage('')
    if (claimIdx - decrementAmount < 0) {
      // start at end
      setCursor({
        startAfter: null,
        // endBefore: claimData?.timestamps.createdAt || null,
        // we need to senfd the cursor to the start... so lets just use a GIANT number lol as a hack
        endBefore: Number.MAX_SAFE_INTEGER,
      })
      setClaimIdx(nClaims - 1)
    } else {
      setCursor({
        startAfter: null,
        endBefore: claimData?.timestamps.createdAt || null,
      })
      setClaimIdx((claimIdx) => claimIdx - decrementAmount)
    }
  }

  const getRedeemType = (): RedeemState => {
    if (!claimData || nClaims === 0) {
      return 'no-claims'
    } else if (claimData && !claimData.whitelist) {
      return 'no-whitelist'
    } else if (claimData?.whitelist && !claimData?.whitelist?.lootboxTicket) {
      return 'not-minted'
    } else {
      return 'ready'
    }
  }

  const mintNFT = async () => {
    setErrorMessage('')
    if (!claimData?.whitelist?.signature || !claimData?.whitelist?.nonce || !claimData?.whitelist?.digest) {
      console.error('No signature or nonce')
      return
    }
    setIsLoading(true)
    try {
      await mintTicket(claimData.whitelist.signature, claimData.whitelist.nonce, claimData.whitelist.digest)
      setIsPolling(true)
      startPolling(3000) // poll every 3 seconds to listen for the isRedeemed = true event
    } catch (err) {
      if (err?.code !== 4001) {
        console.error('error trying to mint', err)
        setErrorMessage(err?.data?.message || err?.message || words.anErrorOccured)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const withdrawEarnings = async () => {
    setErrorMessage('')
    if (!claimData?.whitelist?.lootboxTicket?.ticketID) {
      console.error('No Ticket')
      return
    }

    setIsLoading(true)
    try {
      await withdrawCosmic({
        lootboxAddress: lootboxData.address,
        ticketID: claimData.whitelist.lootboxTicket.ticketID,
      })
      // Refetch the deposit (which should be marked as redeemed)
      loadProratedDepositsIntoState(claimData.whitelist.lootboxTicket.ticketID)
    } catch (err) {
      if (err?.code !== 4001) {
        console.error('Error withdrawing', err)
        setErrorMessage(err?.message || words.anErrorOccured)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      await connectWallet()
    } catch (err) {
      if (err?.code !== 4001) {
        setErrorMessage(err?.message || `${words.anErrorOccured}!`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingLootboxQuery) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || dataLootbox?.getLootboxByID.__typename === 'ResponseError') {
    return <Oopsies icon="🤕" title={words.anErrorOccured} />
  } else if (!lootboxData) {
    return <Oopsies icon="🧐" title={words.notFound} />
  }

  const whitelistImg = claimData?.whitelist?.lootboxTicket?.stampImage
    ? convertFilenameToThumbnail(claimData?.whitelist?.lootboxTicket?.stampImage, 'md')
    : convertFilenameToThumbnail(lootboxData.stampImage, 'md')

  const watchPage = `${manifest.microfrontends.webflow.battlePage}?tid=${lootboxData.id}`
  const getTicketsPage = lootboxData?.joinCommunityUrl || watchPage
  const status = getRedeemType()
  const isWrongWallet =
    claimData?.whitelist?.whitelistedAddress &&
    userSnapshot.currentAccount &&
    claimData.whitelist.whitelistedAddress.toLowerCase() !== userSnapshot.currentAccount.toLowerCase()

  const truncatedDeposits = showAllDeposits ? allDeposits.slice() : allDeposits.slice(0, 4)
  const truncatedProratedDeposits = showAllDeposits
    ? ticketProratedDeposits.slice()
    : ticketProratedDeposits.slice(0, 4)
  return (
    <$RedeemCosmicContainer screen={screen} themeColor={lootboxData.themeColor} style={{ margin: '0 auto' }}>
      <$Horizontal spacing={4} style={screen === 'mobile' ? { flexDirection: 'column-reverse' } : undefined}>
        <$Vertical spacing={2}>
          <$StampImg src={whitelistImg} alt={lootboxData.name} />
          <$RedeemCosmicSubtitle style={{ color: `${COLORS.surpressedFontColor}AE` }}>
            {truncateAddress(lootboxData.address, { prefixLength: 10, suffixLength: 8 })}{' '}
            <CopyIcon text={lootboxData.address} smallWidth={18} />
          </$RedeemCosmicSubtitle>
        </$Vertical>

        <$Vertical spacing={2}>
          <$RedeemCosmicTitle screen={screen}>{lootboxData.name}</$RedeemCosmicTitle>
          <$RedeemCosmicSubtitle>
            You have&nbsp;
            <b>
              {nClaims} Ticket{nClaims > 1 ? 's' : null}
            </b>
            &nbsp;to claim&nbsp;&nbsp;&nbsp;
            <a style={{ cursor: 'pointer', fontStyle: 'italic', textDecoration: 'underline' }}>View Event</a>
          </$RedeemCosmicSubtitle>
          <br />
          {isWrongWallet && claimData?.whitelist ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.warningBackground }}>
              ⚠️ Please connect wallet{' '}
              <b>{truncateAddress(claimData.whitelist.whitelistedAddress, { prefixLength: 6, suffixLength: 4 })}</b>
              <CopyIcon text={claimData.whitelist.whitelistedAddress} smallWidth={18} />
            </$RedeemCosmicSubtitle>
          ) : lootboxData?.chainIdHex && lootboxData?.chainIdHex !== userSnapshot.network.currentNetworkIdHex ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.warningBackground }}>
              ⚠️ Please change MetaMask to: <b>{chainIdHexToName(lootboxData.chainIdHex)}</b>
            </$RedeemCosmicSubtitle>
          ) : null}
          {claimData && (
            <$Horizontal spacing={4} flexWrap={screen === 'mobile'} justifyContent="space-between">
              <div>
                <RedeemButton
                  targetNetwork={lootboxData.chainIdHex}
                  targetWalletAddress={claimData?.whitelist?.whitelistedAddress}
                >
                  {
                    // this means the user needs to connect their wallet to their profile & it will auto whitelist
                    status === 'no-whitelist' ? (
                      <$Button
                        screen={screen}
                        onClick={!allLoading ? handleWalletConnect : undefined}
                        color={`${COLORS.dangerFontColor}90`}
                        colorHover={COLORS.dangerFontColor}
                        backgroundColor={`${COLORS.dangerBackground}80`}
                        backgroundColorHover={`${COLORS.dangerBackground}`}
                        style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px' }}
                        disabled={allLoading}
                      >
                        <LoadingText
                          loading={allLoading}
                          color={`${COLORS.dangerFontColor}90`}
                          text={words.connectMetamask}
                        />
                      </$Button>
                    ) : status === 'not-minted' ? (
                      <$Button
                        screen={screen}
                        onClick={!allLoading ? mintNFT : undefined}
                        color={COLORS.trustFontColor}
                        backgroundColor={COLORS.trustBackground}
                        style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px' }}
                        disabled={allLoading}
                      >
                        <LoadingText loading={allLoading} color={COLORS.trustFontColor} text={'Claim Ticket'} />
                      </$Button>
                    ) : (
                      <$Button
                        screen={screen}
                        onClick={!allLoading ? withdrawEarnings : undefined}
                        color={COLORS.white}
                        backgroundColor={COLORS.successFontColor}
                        style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px' }}
                        disabled={allLoading}
                      >
                        <LoadingText loading={allLoading} color={COLORS.white} text={'Redeem Rewards'} />
                      </$Button>
                    )
                  }
                </RedeemButton>
              </div>
              <div style={{ paddingTop: screen === 'mobile' ? '20px' : '5px' }}>
                <SwitchTicketComponent
                  ticketID={nClaims === 0 ? 0 : claimIdx + 1}
                  maxTickets={nClaims}
                  onBack={() => decrementClaimIdx(1)}
                  onForward={() => incrementClaimIdx(1)}
                />
              </div>
            </$Horizontal>
          )}

          {errorMessage && <$ErrorText style={{ margin: '15px 0px 15px' }}>{errorMessage}</$ErrorText>}

          {isPolling || loadingClaims || loadingLootboxWeb3 ? (
            <Spinner size="25px" margin="auto" color={`${COLORS.surpressedFontColor}3A`} />
          ) : status === 'no-claims' || nClaims === 0 ? (
            <$Vertical>
              <$EarningsContainer>
                <$EarningsText style={{ marginTop: 'auto' }}>You do not own any tickets for this Lootbox</$EarningsText>
                <div style={{ margin: '10px auto auto auto' }}>
                  <a href={getTicketsPage} target="_blank">
                    <$RedeemCosmicButton theme="ghost">GET TICKETS</$RedeemCosmicButton>
                  </a>
                </div>
              </$EarningsContainer>
            </$Vertical>
          ) : !allDeposits || allDeposits.length === 0 ? (
            <$Vertical>
              <$EarningsContainer>
                <$EarningsText> No rewards have been deposited yet</$EarningsText>
              </$EarningsContainer>
            </$Vertical>
          ) : ticketProratedDeposits.length > 0 ? (
            <$Vertical spacing={2}>
              <$Horizontal justifyContent="space-between">
                <$RedeemCosmicSubtitle style={{ fontStyle: 'italic', color: `${COLORS.surpressedFontColor}AE` }}>
                  Rewards for Ticket #{claimData?.whitelist?.lootboxTicket?.ticketID || '0'}
                </$RedeemCosmicSubtitle>
                {userSnapshot.currentAccount && (
                  <$RedeemCosmicSubtitle style={{ fontStyle: 'italic', color: `${COLORS.surpressedFontColor}AE` }}>
                    You ({truncateAddress(userSnapshot.currentAccount)}){' '}
                    <CopyIcon text={`${userSnapshot.currentAccount}`} smallWidth={18} />
                  </$RedeemCosmicSubtitle>
                )}
              </$Horizontal>
              {truncatedProratedDeposits.map((deposit, idx) => {
                return (
                  <$DividendRow key={`ticket-${claimIdx}-${idx}`} isActive={!deposit.isRedeemed}>
                    <$DividendOwed>
                      {`${deposit.isRedeemed ? '☑️ ' : ''}${parseEth(deposit.tokenAmount, Number(deposit.decimal))}`}
                    </$DividendOwed>
                    <$DividendTokenSymbol>{deposit.tokenSymbol}</$DividendTokenSymbol>
                  </$DividendRow>
                )
              })}
              {showAllDeposits && truncatedProratedDeposits.length >= ticketProratedDeposits.length ? (
                <div>
                  <$RedeemCosmicButton onClick={() => setShowAllDeposits(false)} theme="link">
                    {words.hide}
                  </$RedeemCosmicButton>
                </div>
              ) : !showAllDeposits && truncatedProratedDeposits.length < ticketProratedDeposits.length ? (
                <div>
                  <$RedeemCosmicButton onClick={() => setShowAllDeposits(true)} theme="link">
                    {words.seeMore}
                  </$RedeemCosmicButton>
                </div>
              ) : null}
            </$Vertical>
          ) : (
            <$Vertical spacing={2}>
              <$RedeemCosmicSubtitle style={{ fontStyle: 'italic' }}>All Lootbox Deposits</$RedeemCosmicSubtitle>
              {truncatedDeposits.map((deposit, idx) => {
                return (
                  <$DividendRow key={`ticket-${claimIdx}-${idx}`} isActive={!deposit.isRedeemed}>
                    <$DividendOwed>
                      {`${deposit.isRedeemed ? '☑️ ' : ''}${parseEth(deposit.tokenAmount, Number(deposit.decimal))}`}
                    </$DividendOwed>
                    <$DividendTokenSymbol>{deposit.tokenSymbol}</$DividendTokenSymbol>
                  </$DividendRow>
                )
              })}
              {showAllDeposits && truncatedDeposits.length >= allDeposits.length ? (
                <div>
                  <$RedeemCosmicButton onClick={() => setShowAllDeposits(false)} theme="link">
                    {words.hide}
                  </$RedeemCosmicButton>
                </div>
              ) : !showAllDeposits && truncatedDeposits.length < allDeposits.length ? (
                <div>
                  <$RedeemCosmicButton onClick={() => setShowAllDeposits(true)} theme="link">
                    {words.seeMore}
                  </$RedeemCosmicButton>
                </div>
              ) : null}
            </$Vertical>
          )}
          {screen === 'mobile' && <br />}
        </$Vertical>
      </$Horizontal>
    </$RedeemCosmicContainer>
  )
}

const RedeemCosmicLootboxPage = () => {
  const seedLootboxID = parseUrlParams('lid') || parseUrlParams('lootbox') || parseUrlParams('id')
  const [lootboxID, setLootboxID] = useState<LootboxID | undefined>(seedLootboxID as LootboxID | undefined)

  useEffect(() => {
    onloadWidget().catch((err) => console.error('Error initializing DApp', err))
  }, [])

  if (!lootboxID) {
    return <Oopsies title={'Please enter a Lootbox'} icon="🎁" />
  }

  return (
    <AuthGuard loginTitle={'Login to redeem your FREE rewards'}>
      <RedeemCosmicLootbox lootboxID={lootboxID} />
    </AuthGuard>
  )
}

const $RedeemCosmicContainer = styled.div<{
  themeColor: string
  boxShadow?: string
  screen: ScreenSize
}>`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => `0px 0px 10px ${COLORS.surpressedBackground}`};
  border-radius: 20px;
  padding: ${(props) => (props.screen === 'desktop' ? '40px' : '20px')};
  max-width: 800px;
  font-family: sans-serif;
  background: ${(props) =>
    `linear-gradient(117.52deg, ${props.themeColor}21 15%, ${props.themeColor}11 26%, rgba(217, 217, 217, 0) 60%)`};
`

const $StampImg = styled.img`
  max-width: 240px;
`

const $RedeemCosmicTitle = styled.h1<{ screen: ScreenSize }>`
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
  font-family: ${TYPOGRAPHY.fontFamily.regular};

  font-size: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
  line-height: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
`

const $RedeemCosmicSubtitle = styled.span`
  padding: 10px 0px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  word-break: break-word;
`

const $RedeemCosmicButton = styled.button<{
  theme: 'primary' | 'warn' | 'trust' | 'ghost' | 'link'
  disabled?: boolean
}>`
  background-color: ${(props) =>
    props.theme === 'link'
      ? 'transparent'
      : props.theme === 'primary'
      ? COLORS.trustBackground
      : props.theme === 'warn'
      ? COLORS.dangerBackground
      : props.theme === 'ghost'
      ? '#f5f5f5'
      : COLORS.trustBackground};
  border: ${(props) =>
    props.theme === 'link'
      ? 'none'
      : props.theme === 'primary'
      ? `3px solid ${COLORS.trustBackground}`
      : props.theme === 'warn'
      ? `3px solid ${COLORS.dangerBackground}`
      : props.theme === 'ghost'
      ? `1px solid ${COLORS.surpressedFontColor}AE`
      : `3px solid ${COLORS.trustBackground}`};
  box-shadow: ${(props) => (props.theme === 'link' ? 'none' : `0px 3px 4px ${COLORS.surpressedBackground}aa`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) =>
    props.theme === 'ghost' || props.theme === 'link' ? `${COLORS.surpressedFontColor}AE` : COLORS.white};
  margin-left: 0px;
  font-weight: 400;
  font-size: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  padding: 10px 16px;
  font-style: ${(props) => (props.theme === 'link' ? 'italic' : 'normal')};
`

const $ErrorText = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.dangerFontColor};
  text-align: start;
  margin-top: 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
`

const $EarningsContainer = styled.div<{}>`
  width: 100%;
  height: 224px;

  background: #f5f5f5;
  background: ${COLORS.surpressedBackground}15;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 20px;
  box-sizing: border-box;

  box-shadow: 0px 1px 5px ${COLORS.surpressedBackground};
}
`

const $EarningsText = styled.p<{}>`
  margin-top: 5px;
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.large};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor}AE;
`

export const $DividendRow = styled.section<{ isActive: boolean }>`
  height: 40px;
  background: ${(props) => (props.isActive ? `${COLORS.trustBackground}1e` : `${COLORS.surpressedBackground}15`)};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
`

export const $DividendOwed = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-size: 1.6rem;
  line-height: 27px;
  color: ${COLORS.surpressedFontColor}AE;
  margin: auto 0px;
`

export const $DividendTokenSymbol = styled.span`
  font-family: sans-serif;
  font-style: normal;
  font-size: 1.2rem;
  line-height: 22px;

  display: flex;
  align-items: center;
  text-align: right;

  color: ${COLORS.surpressedFontColor}AE;
`

export default RedeemCosmicLootboxPage
