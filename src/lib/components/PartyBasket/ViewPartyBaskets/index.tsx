import { useQuery } from '@apollo/client'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { PartyBasket, GetLootboxByAddressResponse, LootboxResponseSuccess } from 'lib/api/graphql/generated/types'
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
import CreatePartyBasket from '../CreatePartyBasket'
import { truncateAddress } from 'lib/api/helpers'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import { useState } from 'react'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'

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
  const words = useWords()
  const intl = useIntl()

  const youDoNotHaveAnyPartyBaskets = intl.formatMessage({
    id: 'lootbox.manage.viewPartyBaskets.youDoNotHaveAnyPartyBaskets',
    defaultMessage: 'You do not have any Party Baskets',
    description: 'Message shown when a user has not created a Party Basket yet',
  })

  const Baskets = ({ baskets }: { baskets: PartyBasket[] }) => {
    return (
      <$Vertical spacing={2}>
        {baskets.length === 0 && <Oopsies title={youDoNotHaveAnyPartyBaskets} icon="🧐" />}
        {baskets.map((basket) => (
          <$BasketButton key={basket.id} themeColor={themeColor} screen={screen}>
            <$Horizontal
              spacing={2}
              width="100%"
              justifyContent="space-between"
              // flexWrap={screen === 'mobile'}
              //   padding={screen === 'mobile' ? '20px auto' : 'auto'}
            >
              <$PartyBasketTitle
                themeColor={themeColor}
                screen={screen}
                href={`${manifest.microfrontends.webflow.basketManagePage}?basket=${basket.address}`}
              >
                {basket.name}
              </$PartyBasketTitle>
              <$Horizontal style={{ cursor: 'pointer' }}>
                <$ManageLootboxHeading
                  screen={screen}
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    fontSize: TYPOGRAPHY.fontSize.medium,
                    color: `${COLORS.surpressedFontColor}c5`,
                    fontWeight: TYPOGRAPHY.fontWeight.regular,
                    margin: 'auto 0px',
                  }}
                >
                  {truncateAddress(
                    basket.address as Address,
                    screen === 'mobile' ? { suffixLength: 3, prefixLength: 3 } : undefined
                  )}
                </$ManageLootboxHeading>
                <div style={{ margin: 'auto 0px' }}>
                  <CopyIcon text={basket.address} smallWidth={30} />
                </div>
              </$Horizontal>
            </$Horizontal>
          </$BasketButton>
        ))}
      </$Vertical>
    )
  }

  if (loading) {
    return <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} />
  } else if (error) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.getLootboxByAddress?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.getLootboxByAddress?.error?.message || ''} icon="🤕" />
  }

  return (
    <$Vertical spacing={2}>
      <$Horizontal>
        <$StepSubheading>
          <FormattedMessage
            id="lootbox.manage.viewPartyBaskets.clickToVisit"
            defaultMessage="Click to visit Party Basket"
            description="Button text asking user to click to visit the Party Basket page"
          />
          <HelpIcon tipID="visitBasket" />
          <ReactTooltip id="visitBasket" place="right" effect="solid">
            <FormattedMessage
              id="lootbox.manage.viewPartyBaskets.clickToVisit.tooltip"
              defaultMessage="Party Baskets allow your community to redeem NFT bounties on their own, so you don't need to send it to them! You can bulk whitelist addresses for a Party Basket by clicking here."
              description="Tooltip explaining what a Party Basket does"
            />
          </ReactTooltip>
        </$StepSubheading>
      </$Horizontal>
      <Baskets baskets={(data?.getLootboxByAddress as LootboxResponseSuccess)?.lootbox?.partyBaskets || []} />
    </$Vertical>
  )
}

const ViewPartyBaskets = (props: ViewPartyBasketProps) => {
  const words = useWords()
  const { screen } = useWindowSize()

  const [isCreatePartyBasketVisible, setIsCreatePartyBasketVisible] = useState(false)

  return (
    <$ViewPartyBaskets>
      <$StepCard screen={screen} themeColor={props.network.themeColor}>
        <$Vertical spacing={4} width="100%">
          <$Horizontal width="100%">
            <$Vertical flex={4} width="100%">
              <$Horizontal verticalCenter>
                <$ManageLootboxHeading screen={screen} style={{ textTransform: 'capitalize' }}>
                  {words.partyBaskets}
                </$ManageLootboxHeading>
                <HelpIcon tipID="partyBaskets" />
                <ReactTooltip id="partyBaskets" place="right" effect="solid">
                  <FormattedMessage
                    id="lootbox.manage.viewPartyBaskets.partyBaskets.tooltip"
                    defaultMessage="If you would like access to this Party Basket feature, email us at support@lootbox.fund"
                    description="Tooltip explaining what a Party Basket is"
                  />
                </ReactTooltip>
              </$Horizontal>
              <br />
              <$StepSubheading>
                These are your Party Baskets for this Lootbox. Party Baskets hold onto Lootbox NFTs and allow you to
                "whitelist" specific wallets, giving them special permission to redeem one of the NFTs from the Party
                Basket for free.
                <br />
                <br />
                This is an advanced feature. We recommend watching the tutorial video about it{' '}
                <a
                  style={{ textDecoration: 'none', display: 'contents' }}
                  href="https://www.youtube.com/playlist?list=PL9j6Okee96W4rEGvlTjAQ-DdW9gJZ1wjC"
                  target="_blank"
                >
                  here.
                </a>
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

          <$StepSubheading
            style={{
              textAlign: 'left',
              fontStyle: 'italic',
              cursor: 'pointer',
              display: 'inline-block',
            }}
            onClick={() => {
              setIsCreatePartyBasketVisible(!isCreatePartyBasketVisible)
            }}
          >
            {`👉 ${words.createAPartyBasket}`}
            <HelpIcon tipID="createPartyBasket" />
            <ReactTooltip id="createPartyBasket" place="right" effect="solid">
              {words.partyBasketInformation}
            </ReactTooltip>
          </$StepSubheading>

          {isCreatePartyBasketVisible && (
            <$CreatePartyBasketContainer themeColor={props.network.themeColor} screen={screen}>
              <AuthGuard loginTitle={words.loginToMakePartyBasket}>
                <CreatePartyBasket lootboxAddress={props.lootboxAddress} network={props.network} />
              </AuthGuard>
            </$CreatePartyBasketContainer>
          )}
        </$Vertical>
      </$StepCard>
    </$ViewPartyBaskets>
  )
}

const $ViewPartyBaskets = styled.div`
  width: 100%;
`

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

const $CreatePartyBasketContainer = styled.div<{ themeColor: string; screen: ScreenSize }>`
  background-color: ${(props) => `${props.themeColor}30`};
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
  border-radius: 10px;
  padding: 20px;
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
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
`

const $PartyBasketTitle = styled.a<{
  themeColor: string
  screen: ScreenSize
}>`
  color: ${(props) => props.themeColor};
  margin: auto 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15rem;
  width: 10%;
  cursor: pointer;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  width: 100%;
  text-decoration: none;
`

// export default <AuthGuard children={<ViewPartyBaskets />} />
export default ViewPartyBaskets
