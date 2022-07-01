import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { initLogging } from 'lib/api/logrocket'
import Spinner from 'lib/components/Generics/Spinner'
import { initDApp } from 'lib/hooks/useWeb3Api'
import parseUrlParams from 'lib/utils/parseUrlParams'
import LogRocket from 'logrocket'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { MUTATION_GET_WHITELIST_SIGNATURES, GET_PARTY_BASKET_FOR_REDEMPTION } from './api.gql'
import styled from 'styled-components'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
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
  QueryGetPartyBasketArgs,
} from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'

interface RedeemBountyProps {
  basketAddress: Address
}

const RedeemBounty = (props: RedeemBountyProps) => {
  const { screen } = useWindowSize()
  const snapUserState = useSnapshot(userState)
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
  const [getSignatures] = useMutation(MUTATION_GET_WHITELIST_SIGNATURES)

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} />
  } else if (error) {
    return <Oopsies title="Error loading Party Basket" message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Party Basket" message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
  }

  const {
    chainIdHex,
    lootboxSnapshot,
    name: partyBasketName,
  } = (data?.getPartyBasket as GetPartyBasketResponseSuccess)?.partyBasket

  const { name: lootboxName } = lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((net) => net.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  return (
    <$RedeemBountyContainer>
      <$StepCard screen={screen} themeColor={network.themeColor}>
        <$Vertical spacing={4}>
          <$Horizontal spacing={2} width="100%" flexWrap={screen === 'mobile'}>
            <$Vertical width={screen === 'mobile' ? '100%' : '65%'} spacing={4}>
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
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              </$StepSubheading>
            </$Vertical>
            <$Vertical spacing={3} width={screen === 'mobile' ? '100%' : '35%'}>
              <div>{!!snapUserState?.currentAccount ? <NetworkText /> : <WalletButton />}</div>
              <$LootboxStampImage src={lootboxSnapshot?.stampImage || TEMPLATE_LOOTBOX_STAMP} />
              <$BasketButton screen={screen} themeColor="#373737" style={{ borderColor: '#37373715' }}>
                View Lootbox
              </$BasketButton>
            </$Vertical>
          </$Horizontal>

          <br />

          <div>Button</div>
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

export default RedeemBountyPage
