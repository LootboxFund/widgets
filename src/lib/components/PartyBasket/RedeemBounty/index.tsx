import { Address, COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import Spinner from 'lib/components/Generics/Spinner'
import { addCustomEVMChain, getProvider, initDApp, useProvider } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import LogRocket from 'logrocket'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  MUTATION_GET_WHITELIST_SIGNATURES,
  GET_PARTY_BASKET_FOR_REDEMPTION,
  MUTATION_REDEEM_SIGNATURE,
} from './api.gql'
import styled from 'styled-components'
import { $ErrorMessage, $Horizontal, $Vertical } from 'lib/components/Generics'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import NetworkText from 'lib/components/NetworkText'
import WalletButton from 'lib/components/WalletButton'
import { $ManageLootboxHeading } from 'lib/components/ManageLootbox'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import {
  GetPartyBasketResponse,
  GetPartyBasketResponseSuccess,
  GetWhitelistSignaturesResponseSuccess,
  MutationGetWhitelistSignaturesArgs,
  MutationRedeemSignatureArgs,
  QueryGetPartyBasketArgs,
  RedeemSignatureResponse,
} from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { generateWhitelistQueryMessage } from 'lib/utils/signatureMessage'
import { redeemNFT } from 'lib/api/redeemNFT'
import $Button from 'lib/components/Generics/Button'
import UserTicketsSimple from 'lib/components/UserTickets/UserTicketsSimple'
import { ticketCardState } from 'lib/components/TicketCard/state'
import { truncateAddress } from 'lib/api/helpers'
import { manifest } from 'manifest'
import useWords, { useSignatures } from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

interface RedeemBountyProps {
  basketAddress: Address
}

interface RedeemState {
  status: 'loading' | 'success' | 'signature' | 'error'
  error?: string
}

interface AuthSignature {
  message: string
  signature: string
}

const RedeemBounty = (props: RedeemBountyProps) => {
  const intl = useIntl()
  const words = useWords()
  const signatureWords = useSignatures()
  const [provider] = useProvider()
  const { screen } = useWindowSize()
  const isMobile = screen === 'mobile'
  const snapUserState = useSnapshot(userState)
  const [authSignature, setAuthSignature] = useState<AuthSignature | undefined>()
  const [redeemState, setRedeemState] = useState<RedeemState>({ status: 'signature' })
  const { data, loading, error } = useQuery<
    {
      getPartyBasket: GetPartyBasketResponse
    },
    QueryGetPartyBasketArgs
  >(GET_PARTY_BASKET_FOR_REDEMPTION, {
    variables: {
      address: props.basketAddress,
    },
  })
  const [userTicketStatus, setUserTicketStatus] = useState<'loading' | 'success'>('success')
  // This is a mutation because it write a nonce to the database to avoid replay attacks
  const [getSignatures, { data: signatureData, loading: loadingSignatures }] = useMutation<
    { getWhitelistSignatures: GetPartyBasketResponse },
    MutationGetWhitelistSignaturesArgs
  >(MUTATION_GET_WHITELIST_SIGNATURES)

  const [redeemSignature, { loading: loadingRedeemSignature }] = useMutation<
    { redeemSignature: RedeemSignatureResponse },
    MutationRedeemSignatureArgs
  >(MUTATION_REDEEM_SIGNATURE)

  const noNFTsToRedeemText = intl.formatMessage({
    id: 'bounty.redeem.noNFTsToRedeem.text',
    defaultMessage: 'You have no NFTs to redeem',
    description: 'Text displayed when there are no NFTs (non-fungible tokens) to redeem',
  })

  // const redeemNFTText = intl.formatMessage({
  //   id: 'bounty.redeem.redeemNFT.text',
  //   defaultMessage: 'Redeem NFT',
  //   description: 'Text displayed when the user can redeem an NFT',
  // })

  const checkForRedeemableNFTsText = intl.formatMessage({
    id: 'bounty.redeem.checkForRedeemableNFTs.text',
    defaultMessage: 'Check for redeemable NFTs',
    description: 'Text displayed when the user can check for redeemable NFTs',
  })

  const bountyRedeemedMessage = intl.formatMessage({
    id: 'bounty.redeem.bountyRedeemed.message',
    defaultMessage: 'Bounty redeemed',
    description:
      'Message displayed when the user has successfully redeemed a bounty (aka: received a free Lootbox NFT)',
  })

  const errorRetryText = intl.formatMessage({
    id: 'bounty.redeem.errorRetry.text',
    defaultMessage: 'Error occured, retry?',
    description: 'Text displayed when the user has an error redeeming a bounty',
  })

  const noNFTsRetry = intl.formatMessage({
    id: 'bounty.redeem.noNFTsRetry.text',
    defaultMessage: 'No NFTs to redeem, retry?',
    description: 'When the user does not have an NFT to redeem, they can retry it to check again.',
  })

  const unknownEarningText = intl.formatMessage({
    id: 'bounty.redeem.unknownEarning.text',
    defaultMessage: 'Mystery ROI',
    description: 'Text displayed when we do not know the potential ROI (Return on Investment) of the NFT',
  })

  const _lootboxAddress = (data?.getPartyBasket as GetPartyBasketResponseSuccess)?.partyBasket?.lootboxSnapshot
    ?.address as ContractAddress | undefined

  useEffect(() => {
    if (_lootboxAddress) {
      ticketCardState.lootboxAddress = _lootboxAddress
    }
  }, [_lootboxAddress])

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} size="50px" />
  } else if (error) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
  }

  const { signatures } =
    (signatureData?.getWhitelistSignatures as GetWhitelistSignaturesResponseSuccess | undefined) || {}

  const validSignatures = signatures?.filter((signature) => !signature?.isRedeemed) || []

  const {
    id: partyBasketId,
    chainIdHex,
    lootboxSnapshot,
    name: partyBasketName,
    nftBountyValue,
  } = (data?.getPartyBasket as GetPartyBasketResponseSuccess)?.partyBasket

  const { name: lootboxName, address: lootboxAddress, description: lootboxDescription } = lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((net) => net.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  const hasBountyToRedeem = !!authSignature && validSignatures != undefined && validSignatures.length > 0
  const noBountiesToRedeem = validSignatures != undefined && validSignatures.length === 0

  const isLoadingState = loadingSignatures || loadingRedeemSignature || redeemState.status === 'loading'

  const isWrongChain = chainIdHex != undefined && chainIdHex !== snapUserState?.network?.currentNetworkIdHex

  const redeemFromLootboxText = intl.formatMessage(
    {
      id: 'bounty.redeem.redeemFromLootbox.text',
      defaultMessage: 'Redeem a FREE Profit Sharing NFT from the Lootbox "{lootboxName}"',
      description: 'Text displayed when the user can redeem from a Lootbox',
    },
    {
      lootboxName: lootboxName || 'mystery',
    }
  )

  const handlePrimaryClick = async () => {
    if (redeemState.status === 'error') {
      setRedeemState({ status: 'signature', error: undefined })
    } else if (redeemState.status === 'signature' || noBountiesToRedeem) {
      try {
        const { metamask } = await getProvider()

        if (!snapUserState.currentAccount) {
          throw new Error(words.connectWalletToMetamask)
        }
        if (!metamask) {
          throw new Error(words.pleaseInstallMetamask)
        }

        const checksumAddress = ethers.utils.getAddress(snapUserState.currentAccount as unknown as string)

        const message = generateWhitelistQueryMessage(
          signatureWords.whitelistMessage,
          checksumAddress as Address,
          props.basketAddress,
          uuidv4()
        )

        // @ts-ignore metamask is not typed...
        const signature = await metamask.request({
          method: 'personal_sign',
          params: [message, snapUserState.currentAccount],
        })

        setAuthSignature({ message, signature })

        // Submit to the backend
        const { data } = await getSignatures({
          variables: {
            payload: {
              message,
              signedMessage: signature,
            },
          },
        })

        if (!data) {
          throw new Error(`${words.anErrorOccured}!`)
        } else if (data?.getWhitelistSignatures?.__typename === 'ResponseError') {
          throw new Error(data?.getWhitelistSignatures.error?.message)
        }

        setRedeemState({ status: 'success', error: undefined })
      } catch (err) {
        LogRocket.captureException(err)
        setRedeemState({ status: 'signature', error: err?.message || `${words.anErrorOccured}!` })
      }
    } else if (hasBountyToRedeem && !!authSignature) {
      const signature = validSignatures?.[0]
      setRedeemState({ status: 'loading' })
      try {
        if (!signature) {
          throw new Error(noNFTsToRedeemText)
        }

        // Redeem the NFT
        const tx = await redeemNFT({
          provider,
          args: {
            partyBasketAddress: props.basketAddress,
            signature: signature.signature,
            nonce: signature.nonce,
          },
        })

        console.log('done', tx)

        console.log('redeeming signature')
        const { data } = await redeemSignature({
          variables: {
            payload: {
              message: authSignature.message,
              signedMessage: authSignature.signature,
              partyBasketId,
              signatureId: signature.id,
            },
          },
        })

        if (!data) {
          throw new Error(`${words.anErrorOccured}!`)
        } else if (data?.redeemSignature?.__typename === 'ResponseError') {
          throw new Error(data?.redeemSignature.error?.message)
        }

        setRedeemState({ status: 'success' })
        setAuthSignature(undefined)

        // HACKY - force user tickets to reload
        setUserTicketStatus('loading')
        setTimeout(() => {
          setUserTicketStatus('success')
        }, 1500)
      } catch (err) {
        LogRocket.captureException(err)
        setRedeemState({ status: 'error', error: err?.data?.message || err?.message || `${words.anErrorOccured}!` })
      }
    } else {
      console.error('NOT IMPLEMENTED')
    }
  }

  const RedeemNFTComponent = () => {
    return (
      <$Vertical spacing={4}>
        {hasBountyToRedeem && (
          <$StepSubheading>
            ✅{' '}
            <FormattedMessage
              id="bounty.redeem.promptText"
              defaultMessage="You have a free NFT available to redeem. Click the button 👇 to redeem!"
              description="Text displayed when user has a free NFT to redeem"
            />
          </$StepSubheading>
        )}

        {redeemState.status === 'signature' && !hasBountyToRedeem && (
          <$StepSubheading>
            ⚠️{' '}
            <FormattedMessage
              id="bounty.redeem.checkForBountiesText"
              defaultMessage="Check for Redeemable NFTs using your MetaMask Wallet!"
              description="Prompt for user to check if they have any NFTs to redeem"
            />
          </$StepSubheading>
        )}

        {redeemState.status === 'success' && !hasBountyToRedeem && (
          <$StepSubheading>
            ❌{' '}
            <FormattedMessage
              id="bounty.redeem.noBountiesText"
              defaultMessage="You do not have any NFTs to redeem. Please check again later."
              description="Text displayed when user has no NFTs to redeem"
            />
          </$StepSubheading>
        )}

        {!!redeemState.error && <$StepSubheading>❌ {redeemState.error}</$StepSubheading>}

        {!snapUserState.currentAccount ? (
          <WalletButton />
        ) : isWrongChain ? (
          <$RedeemNFTButton themeColor={COLORS.warningBackground} onClick={() => addCustomEVMChain(chainIdHex)}>
            {words.switchNetwork}
          </$RedeemNFTButton>
        ) : (
          <$RedeemNFTButton
            themeColor={
              redeemState.status === 'error'
                ? COLORS.dangerBackground
                : redeemState.status === 'signature'
                ? COLORS.warningBackground
                : noBountiesToRedeem
                ? COLORS.dangerBackground
                : network.themeColor
            }
            onClick={handlePrimaryClick}
            disabled={isLoadingState}
          >
            {redeemState.status === 'error'
              ? errorRetryText
              : redeemState.status === 'signature'
              ? checkForRedeemableNFTsText
              : isLoadingState
              ? `${words.loading}...`
              : noBountiesToRedeem
              ? noNFTsRetry
              : hasBountyToRedeem
              ? words.redeemNFTText
              : redeemState.status === 'success'
              ? `✅ ${bountyRedeemedMessage}`
              : words.redeemNFTText}
          </$RedeemNFTButton>
        )}
      </$Vertical>
    )
  }

  return (
    <$Vertical spacing={4}>
      <$StepCard screen={screen} themeColor={network.themeColor} style={{ margin: '0 auto' }}>
        <$Vertical spacing={4}>
          <$Horizontal spacing={4} width="100%" flexWrap={screen === 'mobile'}>
            <$Vertical
              width={screen === 'mobile' ? '100%' : '65%'}
              spacing={4}
              style={{
                ...(screen === 'mobile' && {
                  marginRight: '0px',
                }),
              }}
            >
              <$Horizontal>
                <$ManageLootboxHeading screen={screen}>
                  <FormattedMessage
                    id="bounty.redeem.title"
                    defaultMessage="Redeem Free NFT"
                    description="Title for the redeem NFT screen"
                  />
                </$ManageLootboxHeading>
                <HelpIcon tipID="partyBasket" />
                <ReactTooltip id="partyBasket" place="right" effect="solid">
                  <FormattedMessage
                    id="bounty.redeem.partyBasketTooltip"
                    defaultMessage="You can redeem FREE profit sharing NFTs if the Party Basket issuer has permitted you to do so. If you believe you are entitled to redeem an NFT, please contact the Party Basket issuer."
                    description="Tooltip that explains how bounty redeeming works."
                  />
                </ReactTooltip>
              </$Horizontal>
              <$StepSubheading>{`${lootboxName ? lootboxName + ', ' : ''}${
                partyBasketName || words.partyBasket
              }`}</$StepSubheading>

              <$StepSubheading>
                {lootboxDescription && lootboxDescription?.length > 190
                  ? `${lootboxDescription?.slice(0, 190)}...`
                  : lootboxDescription || redeemFromLootboxText}
              </$StepSubheading>

              {isMobile && <RedeemNFTComponent />}

              <$Vertical spacing={2}>
                <$Horizontal spacing={2} justifyContent="space-between">
                  <$Horizontal verticalCenter>
                    <$StepSubheading>Max Earnings</$StepSubheading>
                    <HelpIcon tipID="maxEarnings" />
                    <ReactTooltip id="maxEarnings" place="right" effect="solid">
                      {!!nftBountyValue ? (
                        <FormattedMessage
                          id="bounty.redeem.bountyValueTooltip"
                          defaultMessage='The NFT you redeem has the chance of earning "{bountyValue}" according to the Party Basket issuer. There is no guarantee of a profit and please contact the Party Basket issuer if you have questions.'
                          description="Indicates how much money the user can get from a Lootbox NFT"
                          values={{
                            bountyValue: nftBountyValue,
                          }}
                        />
                      ) : (
                        <FormattedMessage
                          id="bounty.redeem.bountyValueTooltipNoValue"
                          defaultMessage="The Party Basket issuer has not stated a maximum earnings value for this NFT. Please contact the Party Basket issuer if you have questions."
                          description="Message indicating that the user does not know how much potential winnings they can make by using the Lootbox NFT bounty."
                        />
                      )}
                    </ReactTooltip>
                  </$Horizontal>

                  <$StepSubheading style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                    <FormattedMessage
                      id="bounty.redeem.nftsAvailable"
                      defaultMessage="NFTs Available"
                      description="Text indicating that user has NFTs avaioable to redeem"
                    />
                  </$StepSubheading>
                </$Horizontal>
                <$EarningsContainer>
                  <$Light style={{ marginBottom: '0px' }}>
                    <FormattedMessage
                      id="bounty.redeem.upTo"
                      defaultMessage="Win up to..."
                      description="Text indicating maximum amount that can be won, i.e. you can win up to 20 dollars"
                    />
                  </$Light>
                  <$EarningsText>{!!nftBountyValue ? nftBountyValue : unknownEarningText}</$EarningsText>
                </$EarningsContainer>
              </$Vertical>
            </$Vertical>
            <$Vertical
              spacing={3}
              width={screen === 'mobile' ? '100%' : '35%'}
              style={{
                ...(screen === 'mobile' && {
                  marginTop: '24px',
                }),
              }}
            >
              <div>
                {!!snapUserState?.currentAccount ? <NetworkText /> : <WalletButton style={{ width: '100%' }} />}
              </div>
              <$LootboxStampImage src={lootboxSnapshot?.stampImage || TEMPLATE_LOOTBOX_STAMP} />
              <$BasketLink
                screen={screen}
                themeColor="#373737"
                style={{ borderColor: '#37373715' }}
                href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxSnapshot?.address}`}
                target="_blank"
              >
                {words.view} Lootbox
              </$BasketLink>
            </$Vertical>
          </$Horizontal>
          <br />
          {!isMobile && <RedeemNFTComponent />}
        </$Vertical>
      </$StepCard>
      <$Horizontal style={{ marginTop: '50px' }}>
        <$ManageLootboxHeading screen={screen} style={{ fontFamily: TYPOGRAPHY.fontFamily.regular }}>
          <FormattedMessage
            id="bounty.myNFTs.title"
            defaultMessage="Your NFTs"
            description="Title for the My NFTs screen"
          />
        </$ManageLootboxHeading>
        <HelpIcon tipID="yourNfts" />
        <ReactTooltip id="yourNfts" place="right" effect="solid">
          <FormattedMessage
            id="bounty.myNFTs.tooltip"
            defaultMessage="These are the NFTs your wallet {walletAddress} owns from this lootbox {lootboxAddress}."
            description="Tooltip that explains how My NFTs works."
            values={{
              lootboxAddress: lootboxAddress ? `(${truncateAddress(lootboxAddress as Address)})` : '',
              walletAddress: snapUserState.currentAccount ? `(${truncateAddress(snapUserState.currentAccount)})` : '',
            }}
          />
        </ReactTooltip>
      </$Horizontal>
      {userTicketStatus === 'success' ? (
        <UserTicketsSimple lootboxAddress={lootboxAddress as Address | undefined} />
      ) : (
        <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} size="50px" />
      )}
    </$Vertical>
  )
}

const RedeemBountyPage = () => {
  const [partyBasketAddress, setPartyBasketAddress] = useState<Address | undefined>()

  useEffect(() => {
    const partyBasketAddress = parseUrlParams('basket') as Address
    setPartyBasketAddress(partyBasketAddress)
    onLoad(partyBasketAddress)
  }, [])

  if (!partyBasketAddress) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  }

  return <RedeemBounty basketAddress={partyBasketAddress} />
}

export const onLoad = async (partyBasketAddress: Address) => {
  initLogging()
  try {
    //   await initDApp(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
    await initDApp()
  } catch (err) {
    LogRocket.captureException(err)
  }
}

const $StepCard = styled.div<{
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

const $BasketLink = styled.a<{
  themeColor: string
  screen: ScreenSize
}>`
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  line-height: 62px;
  max-width: 420px;
  text-decoration: none;

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  color: ${(props) => props.themeColor};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
  display: inline;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const $BasketButton = styled.div<{
  themeColor: string
  screen: ScreenSize
}>`
  box-sizing: border-box;
  width: 100%;
  height: 62px;
  line-height: 62px;
  max-width: 420px;

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  font-size: ${(props) => (props.screen === 'mobile' ? TYPOGRAPHY.fontSize.large : TYPOGRAPHY.fontSize.xlarge)};
  color: ${(props) => props.themeColor};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  text-align: center;
  display: inline;
`

const $LootboxStampImage = styled.img<{}>`
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 10px;
`

const $EarningsContainer = styled.div<{}>`
  width: 100%;
  max-width: 418px;
  height: 184px;

  background: #f5f5f5;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`

const $EarningsText = styled.p<{}>`
  margin-top: 5px;
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.surpressedFontColor};
`

const $Light = styled.p<{}>`
  text-align: center;
  font-style: italic;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  text-transform: lowercase;
`

const $RedeemNFTButton = styled.button<{ themeColor?: string; disabled?: boolean }>`
  background-color: ${(props) => (!props.disabled ? props.themeColor : `${props.themeColor}e0`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${(props) => (!props.disabled ? 'pointer' : 'not-allowed')};
  color: ${COLORS.white};
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  padding: 20px;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
`

export default RedeemBountyPage
