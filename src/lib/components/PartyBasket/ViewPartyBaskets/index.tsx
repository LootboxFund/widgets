import { useQuery } from '@apollo/client'
import { Address, COLORS } from '@wormgraph/helpers'
import {
  GetMyProfileResponse,
  PartyBasket,
  GetMyProfileSuccess,
  GetLootboxByAddressResponse,
  LootboxResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { NetworkOption } from 'lib/api/network'
import AuthGuard from 'lib/components/AuthGuard'
import { $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import { $ManageLootboxHeading } from 'lib/components/ManageLootbox'
import NetworkText from 'lib/components/NetworkText'
import { Oopsies } from 'lib/components/Profile/common'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { GET_MY_PARTY_BASKETS } from './api.gql'
import { manifest } from 'manifest'

export interface ViewPartyBasketProps {
  network: NetworkOption
  lootboxAddress: Address
}

const PartyBasketList = ({
  themeColor,
  screen,
  lootboxAddress,
}: {
  themeColor: string
  screen: ScreenSize
  lootboxAddress: Address
}) => {
  const { data, loading, error } = useQuery<{
    getLootboxByAddress: GetLootboxByAddressResponse
  }>(GET_MY_PARTY_BASKETS, {
    variables: {
      address: lootboxAddress,
    },
  })

  const Baskets = ({ baskets }: { baskets: PartyBasket[] }) => {
    return (
      <$Vertical spacing={2}>
        {baskets.length === 0 && <Oopsies title="You do not have any Party Baskets" icon="🧐" />}
        {baskets.map((basket) => (
          <$Horizontal key={basket.id}>
            <$BasketButton
              themeColor={themeColor}
              screen={screen}
              onClick={() => {
                const url = `${manifest.microfrontends.webflow.basketManagePage}?basket=${basket.address}`
                console.log('open', url)
                window.open(url, '_self')
              }}
            >
              <$ManageLootboxHeading
                screen={screen}
                style={{
                  color: themeColor,
                  margin: 'auto 0px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  fontSize: '1.5rem',
                }}
              >
                {basket.name}
              </$ManageLootboxHeading>
            </$BasketButton>
          </$Horizontal>
        ))}
      </$Vertical>
    )
  }

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} />
  } else if (error) {
    return <Oopsies title="Error loading Party Baskets" message={error?.message || ''} icon="🤕" />
  } else if (data?.getLootboxByAddress?.__typename === 'ResponseError') {
    return (
      <Oopsies
        title="Error loading Party Baskets"
        message={data?.getLootboxByAddress?.error?.message || ''}
        icon="🤕"
      />
    )
  }

  return (
    <$Vertical spacing={2}>
      <$Horizontal>
        <$StepSubheading>
          Click to Visit Basket <HelpIcon tipID="visitBasket" />
          <ReactTooltip id="visitBasket" place="right" effect="solid">
            Party Baskets allow your community to redeem NFT bounties on their own, so you don't need to send it to
            them! You can bulk whitelist addresses for a Party Basket by clicking here.
          </ReactTooltip>
        </$StepSubheading>
      </$Horizontal>
      <Baskets baskets={(data?.getLootboxByAddress as LootboxResponseSuccess)?.lootbox?.partyBaskets || []} />
    </$Vertical>
  )
}

const ViewPartyBaskets = (props: ViewPartyBasketProps) => {
  const { screen } = useWindowSize()

  return (
    <$ViewPartyBaskets>
      <$StepCard screen={screen} themeColor={props.network.themeColor}>
        <$Horizontal>
          <$Vertical flex={4}>
            <$Horizontal verticalCenter>
              <$ManageLootboxHeading screen={screen}>Party Baskets</$ManageLootboxHeading>
              <HelpIcon tipID="partyBaskets" />
              <ReactTooltip id="partyBaskets" place="right" effect="solid">
                If you would like access to this Party Basket feature, email us at support@lootbox.fund
              </ReactTooltip>
            </$Horizontal>
            <br />
            <$StepSubheading>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
              <br />
              <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
            </$StepSubheading>
            <br />
            <AuthGuard loginTitle="Login to View Party Baskets">
              <PartyBasketList
                themeColor={props.network.themeColor}
                screen={screen}
                lootboxAddress={props.lootboxAddress}
              />
            </AuthGuard>
          </$Vertical>
          {screen === 'desktop' && (
            <$Horizontal flex={1} justifyContent="flex-end">
              <NetworkText />
            </$Horizontal>
          )}
        </$Horizontal>
      </$StepCard>
    </$ViewPartyBaskets>
  )
}

const $ViewPartyBaskets = styled.div``

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

  background: #ffffff;
  border: 1px solid ${(props) => props.themeColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 20px;
  cursor: pointer;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
`

// export default <AuthGuard children={<ViewPartyBaskets />} />
export default ViewPartyBaskets
