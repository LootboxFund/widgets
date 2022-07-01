import AuthGuard from 'lib/components/AuthGuard'
import LogRocket from 'logrocket'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import parseUrlParams from 'lib/utils/parseUrlParams'
import Spinner from 'lib/components/Generics/Spinner'
import { useMutation, useQuery } from '@apollo/client'
import { BULK_WHITELIST_MUTATION, GET_PARTY_BASKET } from './api.gql'
import {
  BulkWhitelistPayload,
  BulkWhitelistResponse,
  GetLootboxByAddressResponse,
  GetPartyBasketResponse,
  GetPartyBasketResponseSuccess,
  MutationBulkWhitelistArgs,
} from 'lib/api/graphql/generated/types'
import { Oopsies } from 'lib/components/Profile/common'
import styled from 'styled-components'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ManageLootboxHeading } from 'lib/components/ManageLootbox'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import NetworkText from 'lib/components/NetworkText'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { $InputWrapper } from 'lib/components/CreateLootbox/StepChooseFunding'
import $Input from 'lib/components/Generics/Input'
import WalletButton from 'lib/components/WalletButton'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { $ErrorText } from 'lib/components/BuyShares/PurchaseComplete'
import { ethers } from 'ethers'
import { $InputMedium } from 'lib/components/Authentication/Shared'
import CopyIcon from 'lib/theme/icons/Copy.icon'

interface ManagePartyBasketProps {
  partyBasketAddress: Address
}

interface SingleWhitelistState {
  status: 'pending' | 'success' | 'error'
  error?: string
}

const ManagePartyBasket = (props: ManagePartyBasketProps) => {
  const [whitelistAddress, setWhitelistAddress] = useState<Address | undefined>()
  const [singleWhitelistState, setSingleWhitelistState] = useState<SingleWhitelistState>()
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{
    getPartyBasket: GetPartyBasketResponse
  }>(GET_PARTY_BASKET, {
    variables: {
      partyBasketAddress: props.partyBasketAddress,
    },
  })
  //   const [createPartyBasketMutation] = useMutation(CREATE_PARTY_BASKET, {
  //     refetchQueries: [{ query: GET_MY_PARTY_BASKETS, variables: { address: props.lootboxAddress } }],
  //   })
  const [bulkWhitelistMutation, { loading: bulkWhitelistLoading }] = useMutation<
    {
      bulkWhitelist: BulkWhitelistResponse
    },
    { payload: BulkWhitelistPayload }
  >(BULK_WHITELIST_MUTATION)

  const singleWhitelistAction = async () => {
    try {
      if (!whitelistAddress) {
        throw new Error('Please enter an address')
      }

      if (!ethers.utils.isAddress(whitelistAddress)) {
        throw new Error('Please enter a valid address')
      }

      const res = await bulkWhitelistMutation({
        variables: {
          payload: {
            partyBasketAddress: props.partyBasketAddress,
            whitelistAddresses: [whitelistAddress],
          },
        },
      })

      if (res.data?.bulkWhitelist?.__typename === 'ResponseError') {
        throw new Error(res.data.bulkWhitelist.error?.message)
      }
      setSingleWhitelistState({ status: 'success', error: undefined })
      setTimeout(() => {
        setSingleWhitelistState({ status: 'pending' })
      }, 2000)
    } catch (err) {
      console.error(err)
      setSingleWhitelistState({ status: 'error', error: err?.message || 'An error occured!' })
    }
  }

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} />
  } else if (error) {
    return <Oopsies title="Error loading Party Basket" message={error?.message || ''} icon="🤕" />
  } else if (data?.getPartyBasket?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Party Basket" message={data?.getPartyBasket?.error?.message || ''} icon="🤕" />
  }

  const {
    name: partyBasketName,
    chainIdHex,
    lootboxSnapshot,
  } = (data?.getPartyBasket as GetPartyBasketResponseSuccess)?.partyBasket

  const chain = NETWORK_OPTIONS.find((c) => c.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  const { name: lootboxName } = lootboxSnapshot || {}

  const network = NETWORK_OPTIONS.find((network) => network.chainIdHex === chainIdHex) || NETWORK_OPTIONS[0]

  return (
    <$ManagePartyBasket>
      <$StepCard screen={screen} themeColor={network.themeColor}>
        <$Vertical spacing={4}>
          <$Vertical spacing={2}>
            {lootboxName && (
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen}>{lootboxName}</$ManageLootboxHeading>
                <HelpIcon tipID="partyBasket" />
                <ReactTooltip id="partyBasket" place="right" effect="solid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </ReactTooltip>
              </$Horizontal>
            )}
            {partyBasketName && (
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen}>{partyBasketName || 'Party Basket'}</$ManageLootboxHeading>
              </$Horizontal>
            )}
          </$Vertical>

          <$StepSubheading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
            <br />
            <br />
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate
          </$StepSubheading>
          <$Vertical spacing={3}>
            <$Vertical>
              <span>
                <$StepSubheading>
                  Whitelist Address <HelpIcon tipID="whitelistAddress" />
                  <ReactTooltip id="whitelistAddress" place="right" effect="solid">
                    Whitelisting is a feature that allows give away an NFT for free. The address you specify will be
                    able to redeem this ONE TIME, and your Lootbox Bounty NFT will be transfered to them when they
                    redeem it.
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$Horizontal spacing={2} flexWrap={screen === 'mobile'}>
                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <$Input
                      type="text"
                      value={whitelistAddress}
                      onChange={(e) => setWhitelistAddress(e?.target?.value as Address | undefined)}
                      min="0"
                      placeholder="e.g. 0x12345..."
                      screen={screen}
                      style={{ fontWeight: 'lighter' }}
                    />
                  </div>
                </$InputWrapper>
                <$AddWhitelistButton
                  themeColor={network.themeColor}
                  onClick={singleWhitelistAction}
                  disabled={bulkWhitelistLoading}
                  screen={screen}
                >
                  <$ManageLootboxHeading
                    screen={screen}
                    style={{
                      color: '#ffffff',
                      margin: 'auto 0px',
                      fontSize: '1.5rem',
                    }}
                  >
                    {bulkWhitelistLoading ? 'LOADING' : 'ADD'}
                  </$ManageLootboxHeading>
                </$AddWhitelistButton>
              </$Horizontal>
            </$Vertical>

            {singleWhitelistState?.status === 'error' && singleWhitelistState?.error && (
              <$ErrorText>{singleWhitelistState.error}</$ErrorText>
            )}
            {singleWhitelistState?.status === 'success' && (
              <$StepSubheading style={{ textAlign: 'center', display: 'inline' }}>
                ✅ Successfully whitelisted!
              </$StepSubheading>
            )}

            <$BasketButton themeColor={chain.themeColor} screen={screen}>
              Share Link to Redeem
            </$BasketButton>
            <$BasketButton themeColor={chain.themeColor} screen={screen}>
              View Original Lootbox
            </$BasketButton>
            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  Bulk Whitelist Address <HelpIcon tipID="bulkWhitelist" />
                  <ReactTooltip id="bulkWhitelist" place="right" effect="solid">
                    Upload a ".csv" file of addresses to whitelist.{' '}
                    <span style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
                      The CSV file needs a column titled "address".
                    </span>{' '}
                    These addresses will get whitelisted which will allow each address to pick up their own NFT (without
                    requiring you to send it to them). Whitelisting an addThis will allow yWhitelisting is a feature
                    that allows give away an NFT for free. The address you specify will be able to redeem this ONE TIME,
                    and your Lootbox Bounty NFT will be transfered to them when they redeem it.
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$BasketButton themeColor={chain.themeColor} screen={screen}>
                Upload CSV
              </$BasketButton>
            </$Vertical>
            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  View All Whitelisted Wallets <HelpIcon tipID="allWhite" />
                  <ReactTooltip id="allWhite" place="right" effect="solid">
                    Download a .csv file that contains a list of all the whitelisted addresses for this Party Box.
                  </ReactTooltip>
                </$StepSubheading>
              </span>
              <$BasketButton themeColor={chain.themeColor} screen={screen}>
                Download Full List
              </$BasketButton>
            </$Vertical>
            <br />
            <$Vertical>
              <span>
                <$StepSubheading>
                  Party Basket Address <HelpIcon tipID="pbAddr" />
                  <ReactTooltip id="pbAddr" place="right" effect="solid">
                    The smart contract address for your Party Basket.
                  </ReactTooltip>
                </$StepSubheading>
              </span>

              <$Horizontal spacing={2}>
                <$InputWrapper
                  screen={screen}
                  marginRight="0px"
                  style={{
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <$Input
                      disabled
                      type="text"
                      value={props.partyBasketAddress}
                      placeholder="e.g. 0x12345..."
                      screen={screen}
                      style={{ fontWeight: 'lighter' }}
                    />
                  </div>
                </$InputWrapper>
                <div>
                  <CopyIcon text={props.partyBasketAddress} />
                </div>
              </$Horizontal>
            </$Vertical>
          </$Vertical>
        </$Vertical>
      </$StepCard>
    </$ManagePartyBasket>
  )
}

const ManagePartyBasketPage = () => {
  const [partyBasketAddress, setPartyBasketAddress] = useState<Address | undefined>()

  useEffect(() => {
    const partyBasketAddress = parseUrlParams('basket') as Address
    setPartyBasketAddress(partyBasketAddress)
    onLoad(partyBasketAddress)
  }, [])

  return (
    <AuthGuard>
      {!!partyBasketAddress ? (
        <ManagePartyBasket partyBasketAddress={partyBasketAddress} />
      ) : (
        <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
      )}
    </AuthGuard>
  )
}

export const onLoad = async (partyBasketAddress: Address) => {
  initLogging()
  //   try {
  //     //   await initDApp(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
  //     await initDApp()
  //   } catch (err) {
  //     LogRocket.captureException(err)
  //   }
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

const $ManagePartyBasket = styled.div``

const $AddWhitelistButton = styled.button<{
  themeColor: string
  screen?: ScreenSize
}>`
  background: ${(props) => props.themeColor};
  padding: 0px 20px;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid ${(props) => props.themeColor};
  height: 62px;
  cursor: pointer;
  border-radius: 10px;
  margin: ${(props) => (props.screen === 'mobile' ? '10px 0px auto' : 'auto 0px')};
  width: ${(props) => (props.screen === 'mobile' ? '100%' : 'auto')};
`

const $CopyableInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
`

export default ManagePartyBasketPage
