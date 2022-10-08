import { Address, COLORS, LootboxID, LootboxTicketID_Web3, TYPOGRAPHY } from '@wormgraph/helpers'
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
} from './api.gql'
import { useQuery } from '@apollo/client'
import { QueryGetLootboxByIdArgs } from 'lib/api/graphql/generated/types'
import Spinner, { LoadingText } from '../Generics/Spinner'
import { $Horizontal, $Vertical } from '../Generics'
import styled from 'styled-components'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import useWords from 'lib/hooks/useWords'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { DepositFragment, useLootbox } from 'lib/hooks/useLootbox'
import WalletButton from '../WalletButton'
import RedeemButton from '../TicketCard/RedeemButton'

export const onloadWidget = async () => {
  initLogging()
  try {
    await initDApp()
  } catch (err) {
    LogRocket.captureException(err)
  }
}

export type RedeemState = 'not-connected' | 'no-claims' | 'no-whitelist' | 'not-minted' | 'ready'
interface Web3DepositData {}
const RedeemCosmicLootbox = ({ lootboxID }: { lootboxID: LootboxID }) => {
  const { screen } = useScreenSize()
  const words = useWords()
  const userSnapshot = useSnapshot(userState)
  const [errorMint, setErrorMint] = useState<string>('')
  const isWalletConnected = !!userSnapshot.currentAccount
  const [loadingWeb3Data, setLoadingWeb3Data] = useState(false)
  // const [allDeposits, setAllDeposits] = useState<DepositFragment[]>([])

  // const [claimIdx, setClaimIdx] = useState(0) // should index data.getLootboxByID.lootbox.mintWhitelistSignatures
  // DEV::
  const [claimIdx, setClaimIdx] = useState(1) // should index data.getLootboxByID.lootbox.mintWhitelistSignatures

  const { data, loading, error } = useQuery<GetLootboxRedeemPageResponseFE, QueryGetLootboxByIdArgs>(
    GET_LOOTBOX_REDEEM_PAGE,
    {
      variables: { id: lootboxID },
    }
  )
  const { claims, lootboxData }: { claims: UserClaimFE[]; lootboxData: LootboxRedemptionFE | null } = useMemo(() => {
    const claims = (data?.getLootboxByID as GetLootboxRedeemPageResponseFESuccess)?.lootbox?.userClaims || []
    const lootboxData = (data?.getLootboxByID as GetLootboxRedeemPageResponseFESuccess)?.lootbox || null
    return { claims, lootboxData }
  }, [data?.getLootboxByID])

  const {
    loading: loadingLootbox,
    proratedDeposits,
    deposits: allDeposits,
    loadProratedDeposits,
    mintTicket,
  } = useLootbox({
    lootboxAddress: lootboxData?.address,
    chainIDHex: lootboxData?.chainIdHex,
  })

  const claimData: UserClaimFE | undefined = useMemo(() => {
    console.log(claims[claimIdx])
    return claims[claimIdx]
  }, [claims, claimIdx])

  useEffect(() => {
    const ticketID = claimData?.whitelist?.lootboxTicket?.ticketID

    if (!ticketID || proratedDeposits[ticketID] != undefined) {
      return
    }

    loadProratedDeposits(ticketID)
  }, [claimData?.whitelist?.lootboxTicket?.ticketID, proratedDeposits])

  const updateIndex = (increment: number) => {
    if (claimIdx + increment >= claims.length) {
      setClaimIdx(0)
    } else if (claimIdx + increment < 0) {
      setClaimIdx(claims.length > 0 ? claims.length - 1 : 0)
    }
  }

  const getRedeemType = (): RedeemState => {
    if (!isWalletConnected) {
      return 'not-connected'
    } else if (!claimData || claims.length === 0) {
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
    if (!claimData?.whitelist?.signature || !claimData?.whitelist?.nonce || !claimData?.whitelist?.digest) {
      console.error('No signature or nonce')
      return
    }
    try {
      await mintTicket(claimData.whitelist.signature, claimData.whitelist.nonce, claimData.whitelist.digest)
    } catch (err) {
      console.error('error trying to mint', err)
      setErrorMint(err?.data?.message || words.anErrorOccured)
    }
  }

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error || data?.getLootboxByID.__typename === 'ResponseError') {
    return <Oopsies icon="🤕" title={words.anErrorOccured} />
  } else if (!lootboxData) {
    return <Oopsies icon="🧐" title={words.notFound} />
  }

  const whitelistImg = claimData?.whitelist?.lootboxTicket?.stampImage
    ? convertFilenameToThumbnail(claimData?.whitelist?.lootboxTicket?.stampImage, 'md')
    : convertFilenameToThumbnail(lootboxData.stampImage, 'md')

  const watchPage = `${manifest.microfrontends.webflow.battlePage}?tid=${lootboxData.id}`
  const status = getRedeemType()
  const isWrongWallet =
    claimData?.whitelist?.whitelistedAddress &&
    userSnapshot.currentAccount &&
    claimData?.whitelist?.whitelistedAddress !== userSnapshot.currentAccount

  console.log('status', status)

  return (
    <$RedeemCosmicContainer screen={screen} themeColor={lootboxData.themeColor} style={{ margin: '0 auto' }}>
      <$Horizontal spacing={4} style={screen === 'mobile' ? { flexDirection: 'column-reverse' } : undefined}>
        <$Vertical>
          <$StampImg src={whitelistImg} alt={lootboxData.name} />
        </$Vertical>

        <$Vertical spacing={2}>
          <$RedeemCosmicTitle screen={screen}>{lootboxData.name}</$RedeemCosmicTitle>
          <$RedeemCosmicSubtitle>
            You have
            <b>{claims.length} Tickets</b> to claim
          </$RedeemCosmicSubtitle>
          {status === 'not-connected' && (
            <$Vertical>
              <$RedeemCosmicSubtitle>🎁 Mint your Lootbox NFT to Claim your rewards!</$RedeemCosmicSubtitle>
              <br />
              <$RedeemCosmicSubtitle>
                Connect wallet <b>{claimData?.whitelist?.whitelistedAddress}</b>
              </$RedeemCosmicSubtitle>
              <WalletButton />
              {/* {isWalletConnected && <$RedeemCosmicButton theme="trust">MINT NFT</$RedeemCosmicButton>} */}
              {/* <$RedeemCosmicButton></$RedeemCosmicButton> */}
            </$Vertical>
          )}
          {status === 'not-minted' && (
            <$Vertical>
              <$RedeemCosmicSubtitle>🎁 Mint your Lootbox NFT to Claim your rewards!</$RedeemCosmicSubtitle>
              <br />
              {!isWalletConnected && <WalletButton />}
              {isWrongWallet && <$RedeemCosmicButton theme="warn">Switch address {'addr'}</$RedeemCosmicButton>}
              {!isWrongWallet && isWalletConnected && (
                <$RedeemCosmicButton theme="trust" onClick={mintNFT}>
                  <LoadingText color={COLORS.white} loading={loadingLootbox} text={'MINT NFT'}></LoadingText>
                </$RedeemCosmicButton>
              )}
              {errorMint && <$ErrorText>{errorMint}</$ErrorText>}
            </$Vertical>
          )}
          {isWrongWallet && (
            <$Vertical>
              ⚠️ You have the wrong wallet connected. Please connect wallet{' '}
              <b>{claimData?.whitelist?.whitelistedAddress}</b>
            </$Vertical>
          )}

          {/* {(!allDeposits || allDeposits.length === 0) && (
            <$Vertical>
              <$RedeemCosmicSubtitle>🕵️‍♂️ No deposits</$RedeemCosmicSubtitle>
            </$Vertical>
          )} */}
          {status === 'no-claims' || claims.length === 0 ? (
            <$EarningsContainer>
              <$EarningsText>You do not own any tickets for this Lootbox</$EarningsText>
              <$RedeemCosmicButton theme="ghost">GET TICKETS</$RedeemCosmicButton>
            </$EarningsContainer>
          ) : !allDeposits || allDeposits.length === 0 ? (
            <$EarningsContainer>
              <$EarningsText> No rewards have been deposited yet</$EarningsText>
            </$EarningsContainer>
          ) : null}
        </$Vertical>
      </$Horizontal>
    </$RedeemCosmicContainer>
  )
}

const RedeemCosmicLootboxPage = () => {
  const seedLootboxID = parseUrlParams('lid') || parseUrlParams('lootbox') || parseUrlParams('id')
  console.log('seedLootboxID', seedLootboxID)
  const [lootboxID, setLootboxID] = useState<LootboxID | undefined>(seedLootboxID as LootboxID | undefined)
  console.log('lootboxID', lootboxID)

  useEffect(() => {
    onloadWidget().catch((err) => console.error('Error initializing DApp', err))
  }, [])

  if (!lootboxID) {
    return <Oopsies title={'Please enter a Lootbox'} icon="🎁" />
  }

  return (
    <AuthGuard>
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
  box-shadow: ${(props) => `0px 3px 20px ${props.themeColor}`};
  border: ${(props) => `3px solid ${props.themeColor}`};
  border-radius: 20px;
  padding: ${(props) => (props.screen === 'desktop' ? '40px' : '20px')};
  max-width: 800px;
  font-family: sans-serif;
`

const $StampImg = styled.img`
  max-width: 240px;
`

const $RedeemCosmicTitle = styled.h1<{ screen: ScreenSize }>`
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
  font-family: ${TYPOGRAPHY.fontFamily.regular};

  font-size: ${(props) => (props.screen === 'desktop' ? '2.2rem' : '1.5rem')};
  line-height: ${(props) => (props.screen === 'desktop' ? '2.5rem' : '1.8rem')};
`

const $RedeemCosmicSubtitle = styled.h2`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.black};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  word-break: break-word;
`

const $RedeemCosmicButton = styled.button<{
  theme: 'primary' | 'warn' | 'trust' | 'ghost'
  // backgroundColor: string
  // borderColor: string
  disabled?: boolean
}>`
  background-color: ${(props) =>
    props.theme === 'primary'
      ? COLORS.trustBackground
      : props.theme === 'warn'
      ? COLORS.dangerBackground
      : COLORS.trustBackground};
  border: 3px solid
    ${(props) =>
      props.theme === 'primary'
        ? COLORS.trustBackground
        : props.theme === 'warn'
        ? COLORS.dangerBackground
        : COLORS.trustBackground};
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${COLORS.white};
  margin-left: 0px;
  font-weight: 400;
  font-size: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
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
  max-width: 418px;
  height: 142px;

  background: #f5f5f5;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 20px;
`

const $EarningsText = styled.p<{}>`
  margin-top: 5px;
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.large};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
`

export default RedeemCosmicLootboxPage
