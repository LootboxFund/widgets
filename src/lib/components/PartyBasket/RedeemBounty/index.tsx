import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import Spinner from 'lib/components/Generics/Spinner'
import { getProvider, initDApp, useProvider } from 'lib/hooks/useWeb3Api'
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
import { getWhitelistQuerySignature } from 'lib/utils/signatureMessage'
import { redeemNFT } from 'lib/api/redeemNFT'

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
  const [provider] = useProvider()
  const { screen } = useWindowSize()
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
  // This is a mutation because it write a nonce to the database to avoid replay attacks
  const [getSignatures, { data: signatureData, loading: loadingSignatures }] = useMutation<
    { getWhitelistSignatures: GetPartyBasketResponse },
    MutationGetWhitelistSignaturesArgs
  >(MUTATION_GET_WHITELIST_SIGNATURES)

  const [redeemSignature, { loading: loadingRedeemSignature }] = useMutation<
    { redeemSignature: RedeemSignatureResponse },
    MutationRedeemSignatureArgs
  >(MUTATION_REDEEM_SIGNATURE)

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} />
  } else if (error) {
    return <Oopsies title="Error loading Party Basket" message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Party Basket" message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
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

  const { name: lootboxName } = lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((net) => net.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  const hasBountyToRedeem = !!authSignature && validSignatures != undefined && validSignatures.length > 0
  const noBountiesToRedeem = validSignatures != undefined && validSignatures.length === 0

  const isLoadingState = loadingSignatures || loadingRedeemSignature || redeemState.status === 'loading'

  const handlePrimaryClick = async () => {
    if (redeemState.status === 'error') {
      setRedeemState({ status: 'signature', error: undefined })
    } else if (redeemState.status === 'signature' || noBountiesToRedeem) {
      try {
        const { metamask } = await getProvider()

        // First get user signature
        const { message, signature } = await getWhitelistQuerySignature({
          partyBasketAddress: props.basketAddress,
          currentAccount: snapUserState.currentAccount as Address,
          metamask,
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
          throw new Error('An error occured!')
        } else if (data?.getWhitelistSignatures?.__typename === 'ResponseError') {
          throw new Error(data?.getWhitelistSignatures.error?.message)
        }

        setRedeemState({ status: 'success', error: undefined })
      } catch (err) {
        LogRocket.captureException(err)
        setRedeemState({ status: 'signature', error: err?.message || 'An error occured!' })
      }
    } else if (hasBountyToRedeem && !!authSignature) {
      const signature = validSignatures?.[0]
      setRedeemState({ status: 'loading' })
      try {
        if (!signature) {
          throw new Error('You have no NFTs to redeem')
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
          throw new Error('An error occured!')
        } else if (data?.redeemSignature?.__typename === 'ResponseError') {
          throw new Error(data?.redeemSignature.error?.message)
        }

        setRedeemState({ status: 'success' })
        setAuthSignature(undefined)
      } catch (err) {
        LogRocket.captureException(err)
        setRedeemState({ status: 'error', error: err?.data?.message || err?.message || 'An error occured!' })
      }
    } else {
      console.error('NOT IMPLEMENTED')
    }
  }

  return (
    <$RedeemBountyContainer>
      <$StepCard screen={screen} themeColor={network.themeColor}>
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
                <$ManageLootboxHeading screen={screen}>Redeem Free NFT</$ManageLootboxHeading>
                <HelpIcon tipID="partyBasket" />
                <ReactTooltip id="partyBasket" place="right" effect="solid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </ReactTooltip>
              </$Horizontal>
              <$StepSubheading>{`${lootboxName ? lootboxName + ', ' : ''}${
                partyBasketName || 'Party Basket'
              }`}</$StepSubheading>

              <$StepSubheading>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </$StepSubheading>

              <$Vertical spacing={2}>
                <$Horizontal spacing={2} justifyContent="space-between">
                  <$Horizontal verticalCenter>
                    <$StepSubheading>Max Earnings</$StepSubheading>
                    <HelpIcon tipID="maxEarnings" />
                    <ReactTooltip id="maxEarnings" place="right" effect="solid">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </ReactTooltip>
                  </$Horizontal>

                  <$StepSubheading style={{ width: 'auto', whiteSpace: 'nowrap' }}>NFTs Available</$StepSubheading>
                </$Horizontal>
                <$EarningsContainer>
                  <$EarningsText>{!!nftBountyValue ? nftBountyValue : 'Mystery Earnings'}</$EarningsText>
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
              <$BasketButton screen={screen} themeColor="#373737" style={{ borderColor: '#37373715' }}>
                View Lootbox
              </$BasketButton>
            </$Vertical>
          </$Horizontal>
          <br />

          {hasBountyToRedeem && (
            <$StepSubheading>
              ✅ You have a free NFT available to redeem. Click the button 👇 to redeem!
            </$StepSubheading>
          )}

          {redeemState.status === 'signature' && !hasBountyToRedeem && (
            <$StepSubheading>⚠️ Check for Redeemable NFTs using your MetaMask Wallet!</$StepSubheading>
          )}

          {redeemState.status === 'success' && !hasBountyToRedeem && (
            <$StepSubheading>❌ You do not have any NFTs to redeem. Please check again later.</$StepSubheading>
          )}

          {!!redeemState.error && <$StepSubheading>❌ {redeemState.error}</$StepSubheading>}

          {!snapUserState.currentAccount ? (
            <WalletButton />
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
                ? 'Error Occured, retry?'
                : redeemState.status === 'signature'
                ? 'Check for Redeemable NFTs'
                : isLoadingState
                ? 'Loading...'
                : noBountiesToRedeem
                ? 'No NFTs to redeem, retry?'
                : hasBountyToRedeem
                ? 'Redeem NFT'
                : redeemState.status === 'success'
                ? '✅ Bounty Redeemed'
                : 'Redeem NFT'}
            </$RedeemNFTButton>
          )}
        </$Vertical>
      </$StepCard>
    </$RedeemBountyContainer>
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

const $RedeemBountyContainer = styled.div``

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
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.surpressedFontColor};
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
