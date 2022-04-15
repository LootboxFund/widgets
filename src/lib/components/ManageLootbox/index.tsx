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
import useWindowSize from 'lib/hooks/useScreenSize'
import { $StepSubheading } from '../CreateLootbox/StepCard'
import { $InputWrapper } from '../CreateLootbox/StepChooseFunding'
import $Input from 'lib/components/Generics/Input'
import { ScreenSize } from '../../hooks/useScreenSize/index'
import { $NetworkIcon } from '../CreateLootbox/StepChooseNetwork'
import $SmallerButton from '../Generics/SmallerButton/SmallerButton'

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

  if (!network?.themeColor) {
    return null
  }

  return (
    <$StepCard themeColor={network.themeColor}>
      <$Vertical>
        <$Horizontal justifyContent="space-between">
          <$Horizontal verticalCenter>
            <span
              style={{ fontSize: '1.3rem', color: COLORS.surpressedFontColor, fontWeight: 'bold', marginRight: '10px' }}
            >
              62% Funded
            </span>
            <span
              style={{
                fontSize: '1rem',
                color: COLORS.surpressedFontColor,
                fontWeight: 'lighter',
                marginRight: '10px',
              }}
            >
              2.1246 MATIC
            </span>
          </$Horizontal>
          <$Horizontal>
            <span style={{ fontSize: '1.3rem', color: COLORS.surpressedFontColor, fontWeight: 'bold' }}>
              3 MATIC GOAL
            </span>
            <HelpIcon tipID="fundingGoal" />
            <ReactTooltip id="fundingGoal" place="right" effect="solid">
              Max 10 MATIC
            </ReactTooltip>
          </$Horizontal>
        </$Horizontal>
        {network?.themeColor && <ProgressBar themeColor={network.themeColor} progress={62} />}
      </$Vertical>
      <$Horizontal style={{ marginTop: '30px' }}>
        <$Vertical flex={2}>
          <$Horizontal verticalCenter>
            <$ManageLootboxHeading>Moss Land Vikings</$ManageLootboxHeading>
            <HelpIcon tipID="lootboxTitle" />
            <ReactTooltip id="lootboxTitle" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
          </$Horizontal>
          <$Datestamp>Created 49 days ago (Feb 15th 2022)</$Datestamp>
          <$StepSubheading>
            This is the public control panel for Lootbox 0x24...5398. It is made for the Lootbox creator but anyone can
            use it. Watch this Youtube Tutorial to learn how.
          </$StepSubheading>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal>
              <$Checkmark>✅</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>1. Create Lootbox</$NextStepTitle>
                  <HelpIcon tipID="createLootbox" />
                  <ReactTooltip id="createLootbox" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  {`Publish your Lootbox to ${network.name} Mainnet. You cannot change anything after publishing.`}
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen}>Create Another</$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal>
              <$Checkmark>✅</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>2. Actively Promoting</$NextStepTitle>
                  <HelpIcon tipID="activelyPromote" />
                  <ReactTooltip id="activelyPromote" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Start sharing your Lootbox on social media for sponsors to buy NFTs. Watch the YouTube Tutorial.
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen}>View & Share Lootbox</$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal>
              <$Checkmark>☑️</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>3. Finish Fundraising</$NextStepTitle>
                  <HelpIcon tipID="finishFundraising" />
                  <ReactTooltip id="finishFundraising" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Only collect the money if the funding target is hit. Otherwise refund the sponsors.
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen} style={{ position: 'relative' }} themeColor={network?.themeColor}>
                    {network?.icon && (
                      <$NetworkIcon src={network.icon} style={{ left: '10px', position: 'absolute' }} />
                    )}
                    End Fundraising
                  </$SmallerButton>
                </$Horizontal>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen}>Refund Sponsors</$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal>
              <$Checkmark>☑️</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>4. Play & Earn</$NextStepTitle>
                  <HelpIcon tipID="playAndEarn" />
                  <ReactTooltip id="playAndEarn" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Play the crypto games you fundraised for. Update your sponsors with news if any.
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen}>Tweet to Sponsors</$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal>
              <$Checkmark>☑️</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>5. Reward Sponsors</$NextStepTitle>
                  <HelpIcon tipID="rewardSponsors" />
                  <ReactTooltip id="rewardSponsors" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Share your crypto earnings with sponsors. Anyone can deposit earnings.
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen} themeColor={network?.themeColor}>
                    Deposit Earnings
                  </$SmallerButton>
                </$Horizontal>
                <$Horizontal verticalCenter>
                  <$SmallerButton screen={screen}>View Deposit History</$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
        </$Vertical>
        <$Vertical flex={1} spacing={3}>
          <div
            style={{
              maxHeight: '100px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <NetworkText />
          </div>
          {ticketMetadata && (
            <div style={{ height: 'auto', marginBottom: '20px' }}>
              <TicketCardUI
                backgroundImage={ticketMetadata.backgroundImage as string}
                logoImage={ticketMetadata.image as string}
                backgroundColor={ticketMetadata.backgroundColor as string}
                name={ticketMetadata.name as string}
                ticketId={'0' as TicketID}
              ></TicketCardUI>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '50px' }}>
            <TicketsMinted fill={props.themeColor} />
            {network?.icon && <TotalFunded chainLogo={network?.icon} />}
            <PayoutsMade fill={props.themeColor} />
            <LootboxType fill={props.themeColor} />
          </div>
        </$Vertical>
      </$Horizontal>
      <$Vertical style={{ padding: '40px' }}>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Lootbox Address
            <HelpIcon tipID="lootboxAddress" />
            <ReactTooltip id="lootboxAddress" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
            <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
          </$InputWrapper>
        </$Vertical>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Treasury Address
            <HelpIcon tipID="treasuryAddress" />
            <ReactTooltip id="treasuryAddress" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
            <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
          </$InputWrapper>
        </$Vertical>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Reputation Address
            <HelpIcon tipID="reputationAddress" />
            <ReactTooltip id="reputationAddress" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
            <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input value={''} screen={'mobile'} fontWeight="200" onChange={() => {}} placeholder="placeholder" />
          </$InputWrapper>
        </$Vertical>
        <$Vertical>
          <$StepSubheading style={{ marginBottom: '10px' }}>
            Advanced Settings
            <HelpIcon tipID="advancedSettings" />
            <ReactTooltip id="advancedSettings" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
          </$StepSubheading>
          <$SmallerButton screen={screen}>Launch OZ Defender</$SmallerButton>
        </$Vertical>
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
  padding: 30px;
  max-width: 800px;
  font-family: sans-serif;
`

const $Checkmark = styled.span`
  font-size: 1.5rem;
  padding: 0px 10px;
`

const $NextStepTitle = styled.span`
  font-size: 1rem;
  color: ${COLORS.surpressedFontColor};
  font-weight: bold;
`

const $Datestamp = styled.span`
  font-size: 0.9rem;
  font-weight: lighter;
  font-style: italic;
  color: ${COLORS.surpressedFontColor};
  margin: 10px 0px;
`

export const $ManageLootboxHeading = styled.span`
  font-size: 2.2rem;
  font-weight: bold;
  color: ${COLORS.black};
`

const TotalFunded = ({ chainLogo }: { chainLogo: string }) => {
  return (
    <$Horizontal verticalCenter style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>2.51</$StatFigure>
          <$StatLabel>BNB</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Total Funded</$Datestamp>
          <HelpIcon tipID="totalFunded" />
          <ReactTooltip id="totalFunded" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <img src={chainLogo} width={50} height={50} />
    </$Horizontal>
  )
}

const $StatFigure = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${COLORS.black};
  margin-right: 10px;
`
const $StatLabel = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: ${COLORS.surpressedFontColor};
  text-transform: uppercase;
`

const TicketsMinted = ({ fill }: { fill: string }) => {
  return (
    <$Horizontal verticalCenter style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>18</$StatFigure>
          <$StatLabel>minted</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Sold NFT Tickets</$Datestamp>
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
    <$Horizontal alignItems="flex-end" style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>2</$StatFigure>
          <$StatLabel>Payouts</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Deposits Made</$Datestamp>
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
    <$Horizontal alignItems="flex-end" style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatLabel>Escrow</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Lootbox Type</$Datestamp>
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

const ProgressBar = ({ progress, themeColor }: { progress: number; themeColor: string }) => {
  return (
    <$Horizontal
      style={{
        width: '100%',
        height: '20px',
        marginTop: '10px',
        backgroundColor: `${themeColor}3A`,
        borderRadius: '10px',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <div style={{ height: '100%', width: `${progress}%`, backgroundColor: themeColor, borderRadius: '10px' }}></div>
    </$Horizontal>
  )
}

export default ManageLootbox
