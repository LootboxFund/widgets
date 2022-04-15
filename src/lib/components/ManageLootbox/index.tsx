import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { initLogging } from 'lib/api/logrocket'
import LogRocket from 'logrocket'
import { COLORS, ITicketMetadata, ContractAddress, TicketID } from '@wormgraph/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { readTicketMetadata } from 'lib/api/storage'
import TicketCardUI from '../TicketCard/TicketCardUI'
import NetworkText from 'lib/components/NetworkText'
import GiftIcon from 'lib/theme/icons/Gift.icon'
import SeedlingIcon from '../../theme/icons/Seedling.icon'
import CardsIcon from '../../theme/icons/Cards.icon'
import { NetworkOption } from 'lib/api/network'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import $Button from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $StepSubheading } from '../CreateLootbox/StepCard'
import { $InputWrapper } from '../CreateLootbox/StepChooseFunding'
import $Input from 'lib/components/Generics/Input'

export interface ManageLootboxProps {
  themeColor: string
  lootboxAddress: ContractAddress
  ticketID: TicketID
}
const ManageLootbox = (props: ManageLootboxProps) => {
  const [ticketMetadata, setTicketMetadata] = useState<ITicketMetadata>()
  const [network, setNetwork] = useState<NetworkOption>()
  const { screen } = useWindowSize()
  useEffect(() => {
    initLogging()
    if (window.ethereum) {
      initDApp()
        .then(() => {
          // return readTicketMetadata(props.lootboxAddress, props.ticketID)
          // ------- Temp
          setTicketMetadata({
            address: '0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress,
            name: 'Genesis Hamster',
            description:
              'Your Lootbox fundraises money by selling NFT tickets to investors, who enjoy profit sharing when you deposit earnings back into the Lootbox.',
            image:
              'https://firebasestorage.googleapis.com/v0/b/lootbox-fund-prod.appspot.com/o/assets%2Flootbox%2F3b099ea2-6af8-4aa2-b9c9-91d59c2b3041%2Flogo.jpeg?alt=media&token=3bcf700f-2cdd-4251-85aa-9b31bab79b3a',
            backgroundColor: '#DFDFDF',
            backgroundImage:
              'https://firebasestorage.googleapis.com/v0/b/lootbox-fund-prod.appspot.com/o/assets%2Flootbox%2F3b099ea2-6af8-4aa2-b9c9-91d59c2b3041%2Fcover.jpeg?alt=media&token=2a314850-496c-44a2-aa66-3d0a34d47685',
            badgeImage: '',
            lootbox: {
              address: '0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress,
              transactionHash: '0xcabb31ad8063f85dedb6ac25cb9f8149b8041c243fb6fc847655fa6244b1d84e',
              blockNumber: '0x1021d29',
              chainIdHex: '0x38',
              chainIdDecimal: '56',
              chainName: 'Binance Smart Chain',
              targetPaybackDate: 1652400000000,
              createdAt: 1649870325537,
              fundraisingTarget: 'de0b6b3a7640000',
              fundraisingTargetMax: 'f43fc2c04ee0000',
              basisPointsReturnTarget: '10',
              returnAmountTarget: '10',
              pricePerShare: '0.05',
              lootboxThemeColor: '#DFDFDF',
            },
            socials: {
              twitter: '',
              email: '123@123.com',
              instagram: '',
              tiktok: '',
              facebook: '',
              discord: '',
              youtube: '',
              snapchat: '',
              twitch: '',
              web: '',
            },
          })
          setNetwork({
            name: 'Binance',
            symbol: 'BNB',
            themeColor: '#F0B90B',
            chainIdHex: '0x61',
            chainIdDecimal: '97',
            isAvailable: true,
            isTestnet: true,
            icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
            priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
            faucetUrl: 'https://testnet.binance.org/faucet-smart',
          })
          // ------- Temp
        })
        .then((metadata) => {
          // setTicketMetadata(metadata)
        })
        .catch((err) => LogRocket.captureException(err))
    } else {
      window.addEventListener('ethereum#initialized', initDApp, {
        once: true,
      })
      setTimeout(() => {
        if (!window.ethereum) {
          alert('Please install MetaMask to use this app. Use the Chrome extension or Metamask mobile app')
        } else {
          initDApp().catch((err) => LogRocket.captureException(err))
        }
      }, 3000) // 3 seconds
    }
  }, [])

  return (
    <$StepCard themeColor={props.themeColor}>
      <$Horizontal justifyContent="space-between">
        <$Horizontal>
          <span>62% Funded</span>
          <span>2.1246 MATIC</span>
        </$Horizontal>
        <span>3 MATIC GOAL</span>
      </$Horizontal>
      <$Horizontal>
        <$Vertical flex={2}>
          <$Horizontal verticalCenter>
            <h1>Moss Land Vikings</h1>
            <HelpIcon tipID="lootboxTitle" />
            <ReactTooltip id="lootboxTitle" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
          </$Horizontal>
          <span>Created 49 days ago (Feb 15th 2022)</span>
          <span>
            This is the public control panel for Lootbox 0x24...5398. It is made for the Lootbox creator but anyone can
            use it. Watch this Youtube Tutorial to learn how.
          </span>
          <$Vertical>
            <br />
            <$Horizontal>
              <span>✅</span>
              <$Vertical>
                <$Horizontal>
                  <b>1. Create Lootbox</b>
                  <HelpIcon tipID="createLootbox" />
                  <ReactTooltip id="createLootbox" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <span>Lorem Ipsum solar descripcom elevair no pointer partoustoura</span>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>Create Another</$Button>
                  <HelpIcon tipID="createAnother" />
                  <ReactTooltip id="createAnother" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical>
            <br />
            <$Horizontal>
              <span>✅</span>
              <$Vertical>
                <$Horizontal>
                  <b>2. Actively Promoting</b>
                  <HelpIcon tipID="activelyPromote" />
                  <ReactTooltip id="activelyPromote" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <span>Lorem Ipsum solar descripcom elevair no pointer partoustoura</span>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>Open & Share Lootbox</$Button>
                  <HelpIcon tipID="shareLootbox" />
                  <ReactTooltip id="shareLootbox" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical>
            <br />
            <$Horizontal>
              <span>☑️</span>
              <$Vertical>
                <$Horizontal>
                  <b>3. Finish Fundraising</b>
                  <HelpIcon tipID="finishFundraising" />
                  <ReactTooltip id="finishFundraising" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <span>Lorem Ipsum solar descripcom elevair no pointer partoustoura</span>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>End Fundraising</$Button>
                  <HelpIcon tipID="endFundraising" />
                  <ReactTooltip id="endFundraising" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>Refund Sponsors</$Button>
                  <HelpIcon tipID="refundSponsors" />
                  <ReactTooltip id="refundSponsors" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical>
            <br />
            <$Horizontal>
              <span>☑️</span>
              <$Vertical>
                <$Horizontal>
                  <b>4. Play & Earn</b>
                  <HelpIcon tipID="playAndEarn" />
                  <ReactTooltip id="playAndEarn" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <span>Lorem Ipsum solar descripcom elevair no pointer partoustoura</span>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>Tweet to Sponsors</$Button>
                  <HelpIcon tipID="tweetSponsors" />
                  <ReactTooltip id="tweetSponsors" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical>
            <br />
            <$Horizontal>
              <span>☑️</span>
              <$Vertical>
                <$Horizontal>
                  <b>5. Reward Sponsors</b>
                  <HelpIcon tipID="rewardSponsors" />
                  <ReactTooltip id="rewardSponsors" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <span>Lorem Ipsum solar descripcom elevair no pointer partoustoura</span>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>Deposit Earnings</$Button>
                  <HelpIcon tipID="depositEarnings" />
                  <ReactTooltip id="depositEarnings" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$Horizontal verticalCenter>
                  <$Button screen={screen}>View Deposit History</$Button>
                  <HelpIcon tipID="viewDepositHistory" />
                  <ReactTooltip id="viewDepositHistory" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
        </$Vertical>
        <$Vertical flex={1}>
          <NetworkText />
          {ticketMetadata && (
            <TicketCardUI
              backgroundImage={ticketMetadata.backgroundImage as string}
              logoImage={ticketMetadata.image as string}
              backgroundColor={ticketMetadata.backgroundColor as string}
              name={ticketMetadata.name as string}
              ticketId={'0' as TicketID}
            ></TicketCardUI>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <TicketsMinted fill={props.themeColor} />
            {network?.icon && <TotalFunded chainLogo={network?.icon} />}
            <PayoutsMade fill={props.themeColor} />
            <LootboxType fill={props.themeColor} />
          </div>
        </$Vertical>
      </$Horizontal>
      <$Vertical>
        <$StepSubheading>
          Lootbox Address
          <HelpIcon tipID="lootboxAddress" />
          <ReactTooltip id="lootboxAddress" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
        </$InputWrapper>
      </$Vertical>
      <$Vertical>
        <$StepSubheading>
          Treasury Address
          <HelpIcon tipID="treasuryAddress" />
          <ReactTooltip id="treasuryAddress" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
        </$InputWrapper>
      </$Vertical>
      <$Vertical>
        <$StepSubheading>
          Reputation Address
          <HelpIcon tipID="reputationAddress" />
          <ReactTooltip id="reputationAddress" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
        </$InputWrapper>
      </$Vertical>
      <$Vertical>
        <$StepSubheading>
          Advanced Settings
          <HelpIcon tipID="advancedSettings" />
          <ReactTooltip id="advancedSettings" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$Button screen={screen}>Launch OZ Defender</$Button>
      </$Vertical>
    </$StepCard>
  )
}

const $Spacer = styled.div<{}>`
  width: 100%;
  height: 100px;
`

const $StepCard = styled.div<{
  themeColor: string
  boxShadow?: string
}>`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => `0px 3px 20px ${props.themeColor}`};
  border: ${(props) => `3px solid ${props.themeColor}`};
  border-radius: 20px;
  padding: 20px;
  max-width: 1000px;
`
const $StepButton = styled.button<{
  backgroundColor: string
  borderColor: string
  clickable?: boolean
}>`
  background-color: ${(props) => props.backgroundColor};
  border: 3px solid ${(props) => props.borderColor};
  min-height: 50px;
  border-radius: 0px 0px 15px 15px;
  flex: 1;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  color: ${COLORS.white};
  margin-left: 0px;
  font-weight: 400;
  font-size: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 40px;
  text-align: left;
`

const TotalFunded = ({ chainLogo }: { chainLogo: string }) => {
  return (
    <$Horizontal>
      <$Vertical>
        <span>2.51 BNB</span>
        <$Horizontal>
          <span>Total Funded</span>
          <HelpIcon tipID="totalFunded" />
          <ReactTooltip id="totalFunded" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <img src={chainLogo} />
    </$Horizontal>
  )
}

const TicketsMinted = ({ fill }: { fill: string }) => {
  return (
    <$Horizontal>
      <$Vertical>
        <span>18 Minted</span>
        <$Horizontal>
          <span>Sold NFT Tickets</span>
          <HelpIcon tipID="soldNFTTickets" />
          <ReactTooltip id="soldNFTTickets" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <CardsIcon fill={fill} />
    </$Horizontal>
  )
}

const PayoutsMade = ({ fill }: { fill: string }) => {
  return (
    <$Horizontal>
      <$Vertical>
        <span>2 Payouts Made</span>
        <$Horizontal>
          <span>Deposits Made</span>
          <HelpIcon tipID="depositsMade" />
          <ReactTooltip id="depositsMade" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <SeedlingIcon fill={fill} />
    </$Horizontal>
  )
}

const LootboxType = ({ fill }: { fill: string }) => {
  return (
    <$Horizontal>
      <$Vertical>
        <span>Escrow</span>
        <$Horizontal>
          <span>Lootbox Type</span>
          <HelpIcon tipID="lootboxType" />
          <ReactTooltip id="lootboxType" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <GiftIcon fill={fill} />
    </$Horizontal>
  )
}

export default ManageLootbox
