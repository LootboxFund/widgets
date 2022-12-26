import { chainIdHexToName, ClaimID, COLORS, LootboxAirdropMetadata, LootboxID, TYPOGRAPHY } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import LogRocket from 'logrocket'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  WHITELIST_ALL_LOOTBOX_CLAIMS,
  WhitelistLootboxClaimsResponseFE,
  UPDATE_CLAIM_REDEMPTION_STATUS,
} from './api.gql'
import { useQuery, useMutation } from '@apollo/client'
import {
  LootboxUserClaimsArgs,
  MutationWhitelistAllUnassignedClaimsArgs,
  QueryGetLootboxByIdArgs,
  UserClaimsCursor,
  MutationWhitelistMyLootboxClaimsArgs,
  ClaimRedemptionStatus,
  MutationUpdateClaimRedemptionStatusArgs,
  UpdateClaimRedemptionStatusResponse,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import Spinner, { LoadingText } from '../Generics/Spinner'
import { $Horizontal } from '../Generics'
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
import { parseEth } from 'lib/utils/bnConversion'
import { awaitPollResult } from 'lib/utils/promise'
import { Deposit } from 'lib/hooks/useLootbox/utils'
import { useAuth } from 'lib/hooks/useAuth'
import CosmicAuthGuard from './CosmicAuthGuard'
import { getBlockExplorerUrl } from 'lib/utils/chain'
import { ContractTransaction } from 'ethers'
import BN from 'bignumber.js'
import BeforeAirdropClaimQuestions from '../BeforeAirdropClaim'
import { CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS } from './api.gql'
import {
  QueryCheckIfUserAnsweredAirdropQuestionsArgs,
  CheckIfUserAnsweredAirdropQuestionsResponse,
} from '../../api/graphql/generated/types'
import BeforeAirdropAdProvider, { useBeforeAirdropAd } from 'lib/hooks/useBeforeAirdropAd'
import { $Vertical } from 'lib/components/Generics'
import $Spinner from 'lib/components/Generics/Spinner'

export const onloadWidget = async () => {
  initLogging()
  try {
    await initDApp()
  } catch (err) {
    LogRocket.captureException(err)
  }
}

export type RedeemState = 'lootbox-not-deployed' | 'no-claims' | 'no-whitelist' | 'not-minted' | 'ready'
const RedeemCosmicLootbox = ({ lootboxID, answered }: { lootboxID: LootboxID; answered: boolean }) => {
  const { screen } = useScreenSize()
  const words = useWords()
  const userSnapshot = useSnapshot(userState)
  const [claimIdx, setClaimIdx] = useState(0) // should index data.getLootboxByID.lootbox.mintWhitelistSignatures
  const [isPolling, setIsPolling] = useState<boolean>(false)

  const { sessionId, ad, adQuestions, retrieveAirdropAd } = useBeforeAirdropAd()
  const pollStatus = useRef<RedeemState | undefined>()
  const [showAllDeposits, setShowAllDeposits] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'loading' | 'info' | 'error' | 'success'
    tx?: ContractTransaction
  }>()
  const [cursor, setCursor] = useState<UserClaimsCursor>({
    startAfter: null,
    endBefore: null,
  })
  const isWalletConnected = userSnapshot.accounts.length > 0
  const [updateClaimRedemptionStatus] = useMutation<
    { updateClaimRedemptionStatus: ResponseError | UpdateClaimRedemptionStatusResponse },
    MutationUpdateClaimRedemptionStatusArgs
  >(UPDATE_CLAIM_REDEMPTION_STATUS)
  const {
    data: dataLootbox,
    loading: loadingLootboxQuery,
    error: errorLootbox,
  } = useQuery<GetLootboxRedeemPageResponseFE, QueryGetLootboxByIdArgs>(GET_LOOTBOX_REDEEM_PAGE, {
    variables: { id: lootboxID },
  })

  const [whitelistMyLootboxClaims, { loading: loadingWhitelist }] = useMutation<
    WhitelistLootboxClaimsResponseFE,
    MutationWhitelistMyLootboxClaimsArgs
  >(WHITELIST_ALL_LOOTBOX_CLAIMS, {
    refetchQueries: [GET_LOOTBOX_CLAIMS_TO_REDEEM],
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
            claimData &&
            claimData?.id === newClaimData?.id &&
            newClaimData?.whitelist?.isRedeemed &&
            !!newClaimData?.whitelist?.lootboxTicket &&
            pollStatus.current === 'not-minted'
          ) {
            console.log('STOPPING MINT POLL')
            // Minting Condition
            stopPolling()
            setIsPolling(false)
            setNotification({
              type: 'success',
              message: "You're LOOTBOX NFT has been minted!",
            })
            pollStatus.current = undefined
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
    status: web3LootboxStatus,
    proratedDeposits,
    deposits: allDeposits,
    lastTx,
    loadProratedDepositsIntoState,
    loadAllDepositsIntoState,
    mintTicket,
    withdrawCosmic,
  } = useLootbox({
    lootboxAddress: lootboxData?.address || undefined,
    chainIDHex: lootboxData?.chainIdHex || undefined,
  })

  useEffect(() => {
    loadAllDepositsIntoState().finally(() => {
      setNotification(undefined)
    })
    retrieveAirdropAd(lootboxID)
  }, [])

  useEffect(() => {
    if (web3LootboxStatus === 'pending-wallet') {
      setNotification({
        type: 'info',
        message: 'Open your MetaMask Wallet and confirm the transaction',
      })
    } else if (web3LootboxStatus === 'loading') {
      if (status === 'not-minted' || status === 'ready') {
        setNotification({ type: 'loading', message: 'Please wait while we confirm the transaction', tx: lastTx })
      } else {
        setNotification({ type: 'loading', message: 'Loading...' })
      }
    } else if (web3LootboxStatus === 'ready' && notification?.type === 'loading') {
      setNotification(undefined)
    }
  }, [web3LootboxStatus])

  const claimData: UserClaimFE | undefined = useMemo(() => {
    if (dataClaims?.getLootboxByID?.__typename === 'LootboxResponseSuccess') {
      const [claimData] = dataClaims?.getLootboxByID?.lootbox?.userClaims?.edges.map((edge) => edge.node) || []
      if (claimData) {
        updateClaimRedemptionStatus({
          variables: { payload: { claimID: claimData.id, status: ClaimRedemptionStatus.Started } },
        })
      }
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

  const sortDeposits = (a: Deposit, b: Deposit) => {
    if (a.isRedeemed && b.isRedeemed) {
      return 0
    } else {
      return a.isRedeemed ? 1 : -1
    }
  }

  const ticketProratedDeposits: Deposit[] = useMemo(() => {
    if (proratedDeposits && claimData?.whitelist?.lootboxTicket?.ticketID) {
      const deposits = proratedDeposits[claimData.whitelist.lootboxTicket.ticketID]
      if (!deposits) {
        return []
      }
      // Merges deposits of the same token
      return deposits
        .reduce<Deposit[]>((a, b) => {
          const deposit = a.find((d) => d.tokenAddress === b.tokenAddress && d.isRedeemed === b.isRedeemed)

          if (deposit) {
            deposit.tokenAmount = new BN(deposit.tokenAmount).plus(new BN(b.tokenAmount)).toString()
          } else {
            a.push(b)
          }
          return a
        }, [])
        .sort(sortDeposits)
    } else {
      return []
    }
  }, [proratedDeposits, claimData?.whitelist?.lootboxTicket?.ticketID])

  const noDepositsAvailable: boolean = useMemo(() => {
    return ticketProratedDeposits.length === 0 || ticketProratedDeposits.every((deposit) => deposit.isRedeemed)
  }, [ticketProratedDeposits])

  const incrementClaimIdx = (incrementAmount: number) => {
    if (loadingClaimCountQuery || nClaims <= 1) {
      return
    }
    setNotification(undefined)
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
    if (loadingClaimCountQuery || nClaims <= 1) {
      return
    }
    setNotification(undefined)
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

  const mintNFT = async () => {
    if (!claimData?.whitelist?.signature || !claimData?.whitelist?.nonce || !claimData?.whitelist?.digest) {
      setNotification({ type: 'error', message: 'Something went wrong! Please try again later.' })
      console.error('No signature or nonce')
      return
    }
    try {
      const tx = await mintTicket(claimData.whitelist.signature, claimData.whitelist.nonce, claimData.whitelist.digest)
      setIsPolling(true)
      pollStatus.current = status
      startPolling(3000) // poll every 3 seconds to listen for the isRedeemed = true event
    } catch (err) {
      if (err?.code !== 4001) {
        console.error('error trying to mint', err)
        setNotification({ type: 'error', message: err?.data?.message || err?.message || words.anErrorOccured })
      } else {
        setNotification(undefined)
      }
    }
  }

  const withdrawEarnings = async () => {
    if (!claimData?.whitelist?.lootboxTicket?.ticketID) {
      setNotification({ type: 'error', message: 'Something went wrong! Please try again later.' })
      console.error('No Ticket')
      return
    }
    try {
      await withdrawCosmic(claimData.whitelist.lootboxTicket.ticketID, claimData.id)
      // Refetch the deposit (which should be marked as redeemed)
      loadProratedDepositsIntoState(claimData.whitelist.lootboxTicket.ticketID)
    } catch (err) {
      if (err?.code !== 4001) {
        console.error('Error withdrawing', err)
        setNotification({ type: 'error', message: err?.message || words.anErrorOccured })
      } else {
        setNotification(undefined)
      }
    }
  }

  // const handleWalletConnect = async () => {
  //   setConnectingWallet(true)
  //   setNotification({ type: 'info', message: 'Open your MetaMask Wallet and sign the message' })
  //   try {
  //     await connectWallet()
  //     setNotification({ type: 'loading', message: 'Please wait as we generate a whitelist for your wallet' })
  //     setIsPolling(true)
  //     pollStatus.current = status
  //     startPolling(3000) // poll every 3 seconds to listen for the isRedeemed = true event
  //     await awaitPollResult(isPolling)
  //     setNotification({ type: 'success', message: 'You have been whitelisted!' })
  //     setTimeout(() => {
  //       setNotification(undefined)
  //     }, 3000)
  //   } catch (err) {
  //     if (err?.code !== 4001) {
  //       setNotification({ type: 'error', message: err?.message || words.anErrorOccured })
  //     } else {
  //       setNotification(undefined)
  //     }
  //   } finally {
  //     setConnectingWallet(false)
  //   }
  // }
  const handleWalletConnect = async () => {
    try {
      if (!userSnapshot.currentAccount) {
        throw new Error('Wallet not connected!')
      }
      setNotification({
        type: 'info',
        message: `Wallet ${
          userSnapshot.currentAccount ? `${truncateAddress(userSnapshot.currentAccount)} ` : ''
        }is being whitelisted...`,
      })
      await whitelistMyLootboxClaims({
        variables: { payload: { walletAddress: userSnapshot.currentAccount as any, lootboxID: lootboxID } },
      })

      setNotification({ type: 'success', message: 'You have been whitelisted. You can now mint your LOOTBOX NFT.' })
    } catch (err) {
      if (err?.code !== 4001) {
        setNotification({ type: 'error', message: err?.message || words.anErrorOccured })
      } else {
        setNotification(undefined)
      }
    }
  }

  const renderAllDeposits = () => {
    if (allDeposits.length === 0) {
      return null
    }
    return (
      <$Vertical spacing={2}>
        <$RedeemCosmicSubtitle style={{ fontStyle: 'italic' }}>All Lootbox Deposits</$RedeemCosmicSubtitle>
        {truncatedDeposits.map((deposit, idx) => {
          return (
            <$DividendRow key={`ticket-${claimIdx}-${idx}`} isActive={!deposit.isRedeemed}>
              <$DividendOwed>
                {`${deposit.isRedeemed ? '☑️ ' : ''}${parseEth(deposit.tokenAmount, Number(deposit.decimal), 22)}`}
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
    )
  }

  const status: RedeemState = useMemo(() => {
    if (!lootboxData.address) {
      return 'lootbox-not-deployed'
    } else if (!claimData || nClaims === 0) {
      return 'no-claims'
    } else if (claimData && !claimData.whitelist) {
      return 'no-whitelist'
    } else if (claimData?.whitelist && !claimData?.whitelist?.lootboxTicket) {
      return 'not-minted'
    } else {
      return 'ready'
    }
  }, [lootboxData, claimData, nClaims])

  const renderLootboxAddress = () => {
    if (!lootboxData.address) {
      return null
    }
    return (
      <$RedeemCosmicSubtitle style={{ color: `${COLORS.surpressedFontColor}AE` }}>
        {truncateAddress(lootboxData.address, { prefixLength: 8, suffixLength: 6 })}&nbsp;
        <CopyIcon text={lootboxData.address} smallWidth={18} />
      </$RedeemCosmicSubtitle>
    )
  }

  if (loadingLootboxQuery) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || dataLootbox?.getLootboxByID.__typename === 'ResponseError') {
    const isNotFound =
      dataLootbox?.getLootboxByID.__typename === 'ResponseError'
        ? dataLootbox?.getLootboxByID.error.code === 'NotFound'
        : false
    if (isNotFound) {
      return <Oopsies icon="🧐" title={words.notFound} />
    }
    return (
      <Oopsies
        icon="🤕"
        title={words.anErrorOccured}
        // @ts-ignore
        message={error?.message || lootboxData?.getLootboxByID?.error?.message || words.notFound}
      />
    )
  } else if (!lootboxData) {
    return <Oopsies icon="🧐" title={words.notFound} />
  }

  const lootboxImage = convertFilenameToThumbnail(lootboxData.stampImage, 'md')

  const whitelistImg = claimData?.whitelist?.lootboxTicket?.stampImage
    ? convertFilenameToThumbnail(claimData?.whitelist?.lootboxTicket?.stampImage, 'md')
    : lootboxImage

  const watchPage = 'https://lootbox.fund' // claimData ? `${manifest.microfrontends.webflow.battlePage}?tid=${claimData?.tournamentId}` : null
  const getTicketsPage = lootboxData?.joinCommunityUrl || watchPage
  const isWrongWallet =
    claimData?.whitelist?.whitelistedAddress &&
    userSnapshot.currentAccount &&
    claimData.whitelist.whitelistedAddress.toLowerCase() !== userSnapshot.currentAccount.toLowerCase()

  const truncatedDeposits = showAllDeposits ? allDeposits.slice() : allDeposits.slice(0, 4)
  const truncatedProratedDeposits = showAllDeposits
    ? ticketProratedDeposits.slice()
    : ticketProratedDeposits.slice(0, 4)

  const isLoading =
    notification?.type === 'loading' ||
    web3LootboxStatus === 'loading' ||
    web3LootboxStatus === 'pending-wallet' ||
    isPolling ||
    loadingClaims

  const blockExplorerURL = lootboxData?.chainIdHex ? getBlockExplorerUrl(lootboxData.chainIdHex) : null
  const socialsURL = lootboxData?.joinCommunityUrl ? lootboxData.joinCommunityUrl : watchPage

  if (!ad) {
    return (
      <$Vertical justifyContent="center">
        <$Spinner />
      </$Vertical>
    )
  }

  if (lootboxData.airdropMetadata && adQuestions && !answered) {
    const isAirdropScreenNecessary =
      lootboxData.airdropMetadata.instructionsLink ||
      lootboxData.airdropMetadata.callToActionLink ||
      (adQuestions && adQuestions.length > 0)

    if (isAirdropScreenNecessary) {
      return (
        <BeforeAirdropClaimQuestions
          lootboxID={lootboxID}
          claimID={claimData?.id || ('no-claim-id' as ClaimID)}
          name={lootboxData.name}
          nftBountyValue={lootboxData.nftBountyValue || 'Free Gift'}
          stampImage={lootboxData.stampImage}
          airdropMetadata={lootboxData?.airdropMetadata as unknown as LootboxAirdropMetadata}
          airdropQuestions={adQuestions || []}
          ad={ad}
          sessionID={sessionId}
        />
      )
    }
  }

  return (
    <$RedeemCosmicContainer screen={screen} themeColor={lootboxData.themeColor} style={{ margin: '0 auto' }}>
      <$Horizontal spacing={4} style={screen === 'mobile' ? { flexDirection: 'column-reverse' } : undefined}>
        <$Vertical spacing={2}>
          <$StampImgObject data={whitelistImg} type="image/png">
            <$StampImg src={lootboxImage} alt={lootboxData.name} />
          </$StampImgObject>

          {lootboxData?.address && screen !== 'mobile' && renderLootboxAddress()}
        </$Vertical>

        <$Vertical spacing={2} width="100%" style={{ maxWidth: screen === 'desktop' ? '460px' : '100%' }}>
          <$RedeemCosmicTitle screen={screen}>{lootboxData.name}</$RedeemCosmicTitle>
          {lootboxData?.address && screen === 'mobile' && renderLootboxAddress()}
          <$RedeemCosmicSubtitle>
            You have&nbsp;
            <b>
              {nClaims} Ticket{nClaims > 1 ? 's' : null}
            </b>
            &nbsp;to claim&nbsp;&nbsp;&nbsp;
            {getTicketsPage && (
              <a
                href={getTicketsPage}
                style={{
                  cursor: 'pointer',
                  fontStyle: 'italic',
                  textDecoration: 'underline',
                  textDecorationColor: COLORS.surpressedFontColor,
                }}
              >
                <$RedeemCosmicSubtitle>View Event</$RedeemCosmicSubtitle>
              </a>
            )}
          </$RedeemCosmicSubtitle>
          <br />

          {claimData && (
            <>
              <$Horizontal spacing={4} flexWrap={screen === 'mobile'} justifyContent="space-between">
                {status === 'lootbox-not-deployed' ? (
                  <$Button
                    screen={screen}
                    color={COLORS.white}
                    backgroundColor={COLORS.surpressedBackground}
                    style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px', minWidth: '200px' }}
                    disabled={true}
                  >
                    Not Deployed
                  </$Button>
                ) : (
                  <div>
                    <RedeemButton
                      targetNetwork={lootboxData?.chainIdHex || undefined}
                      targetWalletAddress={claimData?.whitelist?.whitelistedAddress}
                    >
                      {
                        // this means the user needs to connect their wallet to their profile & it will auto whitelist
                        status === 'no-whitelist' ? (
                          <$Button
                            screen={screen}
                            onClick={!isLoading ? handleWalletConnect : undefined}
                            color={`${COLORS.warningFontColor}`}
                            colorHover={`${COLORS.warningFontColor}90`}
                            backgroundColor={`${COLORS.warningBackground}`}
                            backgroundColorHover={`${COLORS.warningBackground}80`}
                            style={{
                              textTransform: 'uppercase',
                              height: '60px',
                              maxWidth: '300px',
                              minWidth: '200px',
                            }}
                            disabled={loadingWhitelist}
                          >
                            <LoadingText loading={isLoading} color={`${COLORS.warningFontColor}`} text={'Whitelist'} />
                          </$Button>
                        ) : status === 'not-minted' ? (
                          <$Button
                            screen={screen}
                            onClick={!isLoading ? mintNFT : undefined}
                            color={COLORS.trustFontColor}
                            backgroundColor={COLORS.trustBackground}
                            style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px', minWidth: '200px' }}
                            disabled={isLoading}
                          >
                            <LoadingText loading={isLoading} color={COLORS.trustFontColor} text={'Claim Ticket'} />
                          </$Button>
                        ) : (
                          <$Button
                            screen={screen}
                            onClick={!isLoading ? withdrawEarnings : undefined}
                            color={COLORS.white}
                            backgroundColor={
                              noDepositsAvailable ? COLORS.surpressedBackground : COLORS.successFontColor
                            }
                            style={{ textTransform: 'uppercase', height: '60px', maxWidth: '300px', minWidth: '200px' }}
                            disabled={isLoading || noDepositsAvailable}
                          >
                            <LoadingText loading={isLoading} color={COLORS.white} text={'Redeem'} />
                          </$Button>
                        )
                      }
                    </RedeemButton>
                  </div>
                )}

                <div style={{ paddingTop: screen === 'mobile' ? '20px' : '5px' }}>
                  <SwitchTicketComponent
                    ticketID={nClaims === 0 ? 0 : claimIdx + 1}
                    maxTickets={nClaims}
                    onBack={() => decrementClaimIdx(1)}
                    onForward={() => incrementClaimIdx(1)}
                  />
                </div>
              </$Horizontal>
              {/* <br /> */}
            </>
          )}

          {status === 'no-whitelist' && isWalletConnected && userSnapshot.currentAccount && (
            <$RedeemCosmicSubtitle light>
              💳 {truncateAddress(userSnapshot.currentAccount)}
              <CopyIcon text={`${userSnapshot.currentAccount}`} smallWidth={18} />
            </$RedeemCosmicSubtitle>
          )}

          {claimData && status === 'lootbox-not-deployed' ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.warningBackground }} bold>
              ⚠️ This LOOTBOX has not been deployed to the blockchain yet. Ask the tournament host to deploy it.
            </$RedeemCosmicSubtitle>
          ) : isWalletConnected && isWrongWallet && claimData?.whitelist && claimData.whitelist.whitelistedAddress ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.warningBackground, fontSize: TYPOGRAPHY.fontSize.large }}>
              ⚠️ Please connect wallet{' '}
              <b>{truncateAddress(claimData.whitelist.whitelistedAddress, { prefixLength: 6, suffixLength: 4 })}</b>
              <CopyIcon text={claimData.whitelist.whitelistedAddress} smallWidth={18} />
            </$RedeemCosmicSubtitle>
          ) : isWalletConnected &&
            lootboxData?.chainIdHex &&
            lootboxData?.chainIdHex !== userSnapshot.network.currentNetworkIdHex &&
            status !== 'no-claims' ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.warningBackground, fontSize: TYPOGRAPHY.fontSize.large }}>
              ⚠️ Please change MetaMask to: <b>{chainIdHexToName(lootboxData.chainIdHex)}</b>
            </$RedeemCosmicSubtitle>
          ) : ticketProratedDeposits.length > 0 && noDepositsAvailable ? (
            <$RedeemCosmicSubtitle>✅ All deposits redeemed for this ticket</$RedeemCosmicSubtitle>
          ) : null}

          {notification && notification.type === 'error' && notification.message ? (
            <$RedeemCosmicSubtitle style={{ color: COLORS.dangerFontColor }}>
              🚨&nbsp;
              {notification.message.length > 220 ? notification.message.slice(0, 220) + '...' : notification.message}
            </$RedeemCosmicSubtitle>
          ) : notification && notification.type === 'info' ? (
            <$RedeemCosmicSubtitle>
              ℹ️&nbsp;{notification.message}{' '}
              {notification && notification.tx ? (
                <span style={{ display: 'inline' }}>
                  &nbsp;👉&nbsp;
                  <$Link href={`${blockExplorerURL}/tx/${notification.tx.hash}`} target="_blank">
                    {words.viewOnBlockExplorer}
                  </$Link>
                  &nbsp;
                </span>
              ) : null}
            </$RedeemCosmicSubtitle>
          ) : notification && notification.type === 'success' ? (
            <$RedeemCosmicSubtitle>
              ✅&nbsp;{notification.message}
              {notification && notification.tx ? (
                <span style={{ display: 'inline' }}>
                  &nbsp;👉&nbsp;
                  <$Link href={`${blockExplorerURL}/tx/${notification.tx.hash}`} target="_blank">
                    {words.viewOnBlockExplorer}
                  </$Link>
                  &nbsp;
                </span>
              ) : null}
            </$RedeemCosmicSubtitle>
          ) : isLoading ? (
            <$RedeemCosmicSubtitle>
              <Spinner size="0.75rem" color={`${COLORS.surpressedFontColor}3A`} style={{ display: 'inline-block' }} />
              &nbsp;{notification?.message || 'Loading... Please wait.'}
              {notification && notification.tx ? (
                <span style={{ display: 'inline' }}>
                  &nbsp;👉&nbsp;
                  <$Link href={`${blockExplorerURL}/tx/${notification.tx.hash}`} target="_blank">
                    {words.viewOnBlockExplorer}
                  </$Link>
                  &nbsp;
                </span>
              ) : null}
            </$RedeemCosmicSubtitle>
          ) : null}

          {isLoading ? null : !allDeposits || allDeposits.length === 0 ? (
            <$Vertical spacing={2}>
              <$EarningsContainer>
                <$EarningsText> No rewards have been deposited yet</$EarningsText>
                {socialsURL && (
                  <$Link href={socialsURL} style={{ margin: '-20px auto 0px' }}>
                    Follow this Lootbox
                  </$Link>
                )}
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
                      {`${deposit.isRedeemed ? '☑️ ' : ''}${parseEth(
                        deposit.tokenAmount,
                        Number(deposit.decimal),
                        22
                      )}`}
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
            <>
              <$Vertical spacing={4}>
                {(status === 'no-claims' || nClaims === 0) && (
                  <$EarningsContainer>
                    <$EarningsText style={{ margin: 'auto' }}>
                      You do not own any tickets for this Lootbox
                    </$EarningsText>
                    {getTicketsPage && (
                      <div style={{ margin: '10px auto auto auto' }}>
                        <a href={getTicketsPage} target="_blank">
                          <$RedeemCosmicButton theme="ghost">GET TICKETS</$RedeemCosmicButton>
                        </a>
                      </div>
                    )}
                  </$EarningsContainer>
                )}
                {renderAllDeposits()}
              </$Vertical>
            </>
          )}
          {screen === 'mobile' && <br />}
        </$Vertical>
      </$Horizontal>
    </$RedeemCosmicContainer>
  )
}

const RedeemCosmicLootboxPage = () => {
  const seedLootboxID = parseUrlParams('lid') || parseUrlParams('lootbox') || parseUrlParams('id')
  const { user } = useAuth()
  const [lootboxID, setLootboxID] = useState<LootboxID | undefined>(seedLootboxID as LootboxID | undefined)

  const {
    data: checkIfUserAnsweredAirdropQuestionsData,
    loading: checkIfUserAnsweredAirdropQuestionsLoading,
    error: errorCheckIfUserAnsweredAirdropQuestions,
  } = useQuery<
    { checkIfUserAnsweredAirdropQuestions: CheckIfUserAnsweredAirdropQuestionsResponse },
    QueryCheckIfUserAnsweredAirdropQuestionsArgs
  >(CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS, {
    variables: { lootboxID: (seedLootboxID || '') as LootboxID },
  })

  const statusAirdropQuestionsAnswered =
    checkIfUserAnsweredAirdropQuestionsData &&
    checkIfUserAnsweredAirdropQuestionsData.checkIfUserAnsweredAirdropQuestions.__typename ===
      'CheckIfUserAnsweredAirdropQuestionsResponseSuccess'
      ? checkIfUserAnsweredAirdropQuestionsData.checkIfUserAnsweredAirdropQuestions.status
      : false

  useEffect(() => {
    onloadWidget().catch((err) => console.error('Error initializing DApp', err))
  }, [])

  if (!lootboxID) {
    return <Oopsies title={'Please enter a Lootbox'} icon="🎁" />
  }

  const renderTutorial = () => {
    const tutorial = (
      <iframe
        width="100%"
        height="auto"
        src="https://www.youtube.com/embed/Xbsra2Ji-4g?start=50"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          maxWidth: '560',
          marginTop: '50px',
          minHeight: '600px',
        }}
      ></iframe>
    )
    if (!user) {
      return tutorial
    }
    if (statusAirdropQuestionsAnswered) {
      return tutorial
    }
    return null
  }

  return (
    <div>
      <CosmicAuthGuard loginTitle={'Login to redeem your FREE rewards'} lootboxID={lootboxID}>
        <RedeemCosmicLootbox lootboxID={lootboxID} answered={statusAirdropQuestionsAnswered} />
      </CosmicAuthGuard>
      <br />
      {renderTutorial()}
    </div>
  )
}

export const $RedeemCosmicContainer = styled.div<{
  themeColor: string
  boxShadow?: string
  screen: ScreenSize
}>`
  height: auto;
  min-height: 320px;
  width: auto;
  display: flex;
  flex-direction: column;
  ${(props) => (props.screen !== 'mobile' ? `box-shadow: 0px 0px 10px ${COLORS.surpressedBackground};` : null)}
  ${(props) => (props.screen !== 'mobile' ? `border-radius: 20px;` : null)}
  padding: ${(props) => (props.screen === 'desktop' ? '40px' : '20px')};
  max-width: 800px;
  font-family: sans-serif;
  background: ${(props) =>
    `linear-gradient(${props.screen === 'mobile' ? '27.52deg' : '117.52deg'},${props.themeColor}44 7%,${
      props.themeColor
    }30 15%, ${props.themeColor}11 26%, rgba(217, 217, 217, 0) 60%)`};
  overflow: hidden;
`

export const $StampImg = styled.img`
  max-width: 240px;
`

export const $StampImgObject = styled.object`
  max-width: 240px;
`

export const $RedeemCosmicTitle = styled.h1<{ screen: ScreenSize }>`
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
  font-family: ${TYPOGRAPHY.fontFamily.regular};

  font-size: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
  line-height: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
`

export const $RedeemCosmicSubtitle = styled.span<{ bold?: boolean; light?: boolean }>`
  padding: 10px 0px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  // font-weight: ${(props) => (props.bold ? TYPOGRAPHY.fontWeight.bold : TYPOGRAPHY.fontWeight.regular)};
  font-weight: ${(props) => (props.bold ? TYPOGRAPHY.fontWeight.bold : TYPOGRAPHY.fontWeight.light)};
  color: ${(props) => (props.light ? `${COLORS.surpressedFontColor}AE` : COLORS.surpressedFontColor)};
  text-decoration-color: initial;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  word-break: break-word;
`

export const $Link = styled.a`
  padding: 10px 0px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  color: #2cb1ea;
  text-decoration-color: initial;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  word-break: break-word;
  font-style: italic;
`

export const $RedeemCosmicButton = styled.button<{
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

// export const $ErrorText = styled.span`
//   font-family: ${TYPOGRAPHY.fontFamily.regular};
//   color: ${COLORS.dangerFontColor};
//   text-align: start;
//   margin-top: 10px;
//   font-size: ${TYPOGRAPHY.fontSize.medium};
//   word-break: break-word;
// `

export const $EarningsContainer = styled.div<{}>`
  width: 100%;
  min-height: 124px;

  background: #f5f5f5;
  background: ${COLORS.surpressedBackground}15;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 20px;
  box-sizing: border-box;

  box-shadow: 0px 1px 5px ${COLORS.surpressedBackground};
`

export const $EarningsText = styled.p<{}>`
  margin-top: 5px;
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.large};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
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
