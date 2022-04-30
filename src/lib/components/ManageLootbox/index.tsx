import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, ITicketMetadata, ContractAddress, TicketID } from '@wormgraph/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
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
import { ethers as ethersObj } from 'ethers'
import {
  endFundraisingPeriodCall,
  getLootboxEscrowManagementDetails,
  getLootboxInstantManagementDetails,
  LootboxType,
  refundFundraiserCall,
} from 'lib/hooks/useContract'
import { calculateDaysBetween, truncateAddress } from 'lib/api/helpers'
import { manifest } from 'manifest'
import SemverIcon from 'lib/theme/icons/Semver.icon'

const ethers = window.ethers ? window.ethers : ethersObj

export type ManagementButtonState = 'disabled' | 'enabled' | 'pending' | 'error' | 'success'
export interface ManageLootboxProps {
  themeColor: string
  lootboxAddress: ContractAddress
  ticketID: TicketID
  ticketMetadata: ITicketMetadata
  network: NetworkOption
  lootboxType: LootboxType
  scrollToRewardSponsors: () => void
}
const ManageLootbox = (props: ManageLootboxProps) => {
  const { screen } = useWindowSize()

  const [fundedAmountNative, setFundedAmountNative] = useState('0')
  const [fundedAmountUSD, setFundedAmountUSD] = useState('0')
  const [fundedAmountShares, setFundedAmountShares] = useState('0')
  const [targetAmountNative, setTargetAmountNative] = useState('0')
  const [targetAmountUSD, setTargetAmountUSD] = useState('0')
  const [targetAmountShares, setTargetAmountShares] = useState('0')
  const [maxAmountUSD, setMaxAmountUSD] = useState('0')
  const [maxAmountNative, setMaxAmountNative] = useState('0')
  const [maxAmountShares, setMaxAmountShares] = useState('0')
  const [isActivelyFundraising, setIsActivelyFundraising] = useState()
  const [mintedCount, setMintedCount] = useState(0)
  const [payoutsMade, setPayoutsMade] = useState(0)
  const [semver, setSemver] = useState('undefined')
  const [lootboxSymbol, setLootboxSymbol] = useState('')
  const [deploymentDate, setDeploymentDate] = useState()
  const [treasuryAddress, setTreasuryAddress] = useState()
  const [reputationAddress, setReputationAddress] = useState()
  const [percentageFunded, setPercentageFunded] = useState(0)
  const [sharePriceWei, setSharePriceWei] = useState('0')

  const [endFundraisingButtonState, setEndFundraisingButtonState] = useState<ManagementButtonState>('enabled')
  const [endFundraisingButtonMessage, setEndFundraisingButtonMessage] = useState('')

  const [refundButtonState, setRefundButtonState] = useState<ManagementButtonState>('enabled')
  const [refundButtonMessage, setRefundButtonMessage] = useState('')

  const loadBlockchainData = async () => {
    if (props.lootboxType === 'Instant') {
      setRefundButtonState('disabled')
    }
    if (props.lootboxType === 'Escrow' && props.network.priceFeed) {
      const [
        _fundedAmountNative,
        _fundedAmountUSD,
        _fundedAmountShares,
        _targetAmountShares,
        _targetAmountNative,
        _targetAmountUSD,
        _maxAmountShares,
        _maxAmountNative,
        _maxAmountUSD,
        _isActivelyFundraising,
        _mintedCount,
        _payoutsMade,
        _deploymentDate,
        _treasuryAddress,
        _reputationAddress,
        _percentageFunded,
        _semver,
        _symbol,
        _sharePriceWei,
      ] = await getLootboxEscrowManagementDetails(props.lootboxAddress, props.network.priceFeed as ContractAddress)
      setFundedAmountShares(_fundedAmountShares)
      setFundedAmountNative(_fundedAmountNative)
      setFundedAmountUSD(_fundedAmountUSD)
      setTargetAmountShares(_targetAmountShares)
      setTargetAmountNative(_targetAmountNative.toString())
      setTargetAmountUSD(_targetAmountUSD.toString())
      setMaxAmountShares(_maxAmountShares)
      setMaxAmountNative(_maxAmountNative.toString())
      setMaxAmountUSD(_maxAmountUSD.toString())
      setIsActivelyFundraising(_isActivelyFundraising)
      setMintedCount(_mintedCount)
      setPayoutsMade(_payoutsMade)
      setDeploymentDate(_deploymentDate)
      setTreasuryAddress(_treasuryAddress)
      setReputationAddress(_reputationAddress)
      setPercentageFunded(_percentageFunded)
      setSemver(_semver)
      setLootboxSymbol(_symbol)
      setSharePriceWei(_sharePriceWei)
    } else if (props.lootboxType === 'Instant' && props.network.priceFeed) {
      const [
        _fundedAmountNative,
        _fundedAmountUSD,
        _fundedAmountShares,
        _targetAmountShares,
        _targetAmountNative,
        _targetAmountUSD,
        _maxAmountShares,
        _maxAmountNative,
        _maxAmountUSD,
        _isActivelyFundraising,
        _mintedCount,
        _payoutsMade,
        _deploymentDate,
        _treasuryAddress,
        _reputationAddress,
        _percentageFunded,
        _semver,
        _symbol,
        _sharePriceWei,
      ] = await getLootboxInstantManagementDetails(props.lootboxAddress, props.network.priceFeed as ContractAddress)
      setFundedAmountNative(_fundedAmountNative)
      setFundedAmountUSD(_fundedAmountUSD)
      setFundedAmountShares(_fundedAmountShares)
      setTargetAmountShares(_targetAmountShares)
      setTargetAmountNative(_targetAmountNative.toString())
      setTargetAmountUSD(_targetAmountUSD.toString())
      setMaxAmountShares(_maxAmountShares)
      setMaxAmountNative(_maxAmountNative.toString())
      setMaxAmountUSD(_maxAmountUSD.toString())
      setIsActivelyFundraising(_isActivelyFundraising)
      setMintedCount(_mintedCount)
      setPayoutsMade(_payoutsMade)
      setDeploymentDate(_deploymentDate)
      setTreasuryAddress(_treasuryAddress)
      setReputationAddress(_reputationAddress)
      setPercentageFunded(_percentageFunded)
      setSemver(_semver)
      setLootboxSymbol(_symbol)
      setSharePriceWei(_sharePriceWei)
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const endFundraisingPeriod = async () => {
    setEndFundraisingButtonState('pending')
    setEndFundraisingButtonMessage('')
    try {
      await endFundraisingPeriodCall(props.lootboxAddress, props.lootboxType)
      setEndFundraisingButtonState('success')
      setEndFundraisingButtonMessage(
        'Fundraising period successfully ended. You may now reward sponsors. Please refresh the page.'
      )
    } catch (e) {
      setEndFundraisingButtonState('error')
      setEndFundraisingButtonMessage(e.data.message)
      setTimeout(() => {
        setEndFundraisingButtonState('enabled')
      }, 2000)
    }
  }

  const refundSponsors = async () => {
    setRefundButtonState('pending')
    setRefundButtonMessage('')
    try {
      await refundFundraiserCall(props.lootboxAddress, props.lootboxType)
      setRefundButtonState('success')
      setRefundButtonMessage('Fundraising period successfully ended. You may now reward sponsors.')
    } catch (e) {
      setRefundButtonState('error')
      setRefundButtonMessage(e.data.message)
      setTimeout(() => {
        setRefundButtonState('enabled')
      }, 2000)
    }
  }

  // console.log(`

  // !props.network.themeColor  = ${props.network.themeColor}
  // !fundedAmountNative = ${fundedAmountNative}
  // !fundedAmountUSD    = ${fundedAmountUSD}
  // !fundedAmountShares = ${fundedAmountShares}
  // !targetAmountNative = ${targetAmountNative}
  // !targetAmountUSD    = ${targetAmountUSD}
  // !targetAmountShares = ${targetAmountShares}
  // !maxAmountUSD       = ${maxAmountUSD}
  // !maxAmountShares    = ${maxAmountShares}
  // !deploymentDate     = ${deploymentDate}
  // !treasuryAddress    = ${treasuryAddress}
  // !reputationAddress  = ${reputationAddress}

  // `)

  if (
    !props.network.themeColor ||
    !fundedAmountNative ||
    !fundedAmountUSD ||
    !fundedAmountShares ||
    !targetAmountShares ||
    !maxAmountShares ||
    !deploymentDate ||
    !treasuryAddress ||
    !reputationAddress
  ) {
    return <p>Loading data from Blockchain. This may take up to 1 minute...</p>
  }

  const daysAgo = parseInt(calculateDaysBetween(deploymentDate).toFixed(0))

  return (
    <$StepCard themeColor={props.network.themeColor} screen={screen}>
      <$Vertical>
        <$Horizontal justifyContent="space-between" style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
          <$Horizontal verticalCenter>
            <span
              style={{
                fontSize: screen === 'desktop' ? '1.3rem' : '1rem',
                color: COLORS.surpressedFontColor,
                fontWeight: 'bold',
                marginRight: '10px',
              }}
            >
              {`${percentageFunded}% Funded`}
            </span>
            <span
              style={{
                fontSize: screen === 'desktop' ? '1.3rem' : '0.8rem',
                color: COLORS.surpressedFontColor,
                fontWeight: 'lighter',
                marginRight: '10px',
              }}
            >
              {`${fundedAmountNative} ${props.network.symbol}`}
            </span>
          </$Horizontal>
          <$Horizontal>
            <span
              style={{
                fontSize: screen === 'desktop' ? '1.3rem' : '1rem',
                color: COLORS.surpressedFontColor,
                fontWeight: 'bold',
              }}
            >
              {`${ethers.utils.formatUnits(targetAmountNative, '18')} ${props.network.symbol} Goal`}
            </span>
            <HelpIcon tipID="fundingGoal" />
            <ReactTooltip id="fundingGoal" place="right" effect="solid">
              {`This Lootbox has a goal of selling ${targetAmountShares} shares for a target value of approx ${ethers.utils.formatUnits(
                targetAmountNative,
                '18'
              )} ${
                props.network.symbol
              } equal to $${targetAmountUSD} at todays prices. The max amount of shares for sale is ${maxAmountShares}.`}
            </ReactTooltip>
          </$Horizontal>
        </$Horizontal>
        {props.network?.themeColor && percentageFunded !== undefined && (
          <ProgressBar
            themeColor={props.network.themeColor}
            progress={percentageFunded > 100 ? 100 : percentageFunded}
          />
        )}
      </$Vertical>
      <$Horizontal style={screen === 'desktop' ? { marginTop: '30px' } : { flexDirection: 'column' }}>
        <$Vertical flex={2}>
          <$Horizontal verticalCenter>
            <$ManageLootboxHeading screen={screen}>{props.ticketMetadata.name}</$ManageLootboxHeading>
            <HelpIcon tipID="lootboxTitle" />
            <ReactTooltip id="lootboxTitle" place="right" effect="solid">
              {`This is the human-friendly name of the Lootbox, but the real name is its contract address ${props.lootboxAddress}. When sponsors buy from this Lootbox and receive it in their wallet, it will have the symbol ${lootboxSymbol} with 0 decimals. If sponsors want to transfer their NFT to another wallet, they will need to use OpenZeppelin Defender as Metamask does not support all ERC721 transfers. The tutorial for this can be found on the LootboxFund YouTube channel.`}
            </ReactTooltip>
          </$Horizontal>
          <$Datestamp>{`Created ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago (${new Date(
            deploymentDate
          ).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })})`}</$Datestamp>
          <$StepSubheading>
            <div style={{ display: 'inline-block' }}>
              <span>This is the public control panel for Lootbox </span>
              <span
                onClick={() =>
                  window.open(`${props.network.blockExplorerUrl}address/${props.lootboxAddress}`, '_blank')
                }
                style={{ textDecoration: 'underline', fontStyle: 'italic', cursor: 'pointer' }}
              >{`${truncateAddress(props.lootboxAddress)}`}</span>
              <span>
                . It is made for the Lootbox creator but anyone can use it. Watch this Youtube Tutorial to learn how.
              </span>
            </div>
          </$StepSubheading>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
              <$Checkmark>✅</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>1. Create Lootbox</$NextStepTitle>
                  <HelpIcon tipID="createLootbox" />
                  <ReactTooltip id="createLootbox" place="right" effect="solid">
                    You've already completed this step if you're on this Manage Lootbox page. If you want to create
                    another, click the button below or visit https://lootbox.fund/create
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  {`Publish your Lootbox to ${props.network.name}${
                    props.network.isTestnet && ' Testnet'
                  }. You cannot change your funding goal after publishing.`}
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton
                    onClick={() => {
                      window.open(manifest.microfrontends.webflow.createPage, '_blank')
                    }}
                    screen={screen}
                  >
                    Create Another
                  </$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
              <$Checkmark>✅</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>2. Actively Promoting</$NextStepTitle>
                  <HelpIcon tipID="activelyPromote" />
                  <ReactTooltip id="activelyPromote" place="right" effect="solid">
                    There is no such thing as free money. If you want sponsors, you need to earn their trust and
                    recognition by promoting your Lootbox on social media. If you want to learn how to do proper
                    fundraising, watch our Bootcamp Series on the LootboxFund YouTube channel.
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Start sharing your Lootbox on social media for sponsors to buy NFTs. Watch the YouTube Tutorial.
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton
                    onClick={() =>
                      window.open(
                        `${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${props.lootboxAddress}`,
                        '_blank'
                      )
                    }
                    screen={screen}
                  >
                    View & Share Lootbox
                  </$SmallerButton>
                </$Horizontal>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <$Vertical style={{ marginTop: '20px' }}>
            <br />
            <$Horizontal style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
              <$Checkmark>{isActivelyFundraising ? '☑️' : '✅'}</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>
                    {isActivelyFundraising ? `3. Finish Fundraising` : `3. Finished Fundraising`}
                  </$NextStepTitle>
                  <HelpIcon tipID="finishFundraising" />
                  <ReactTooltip id="finishFundraising" place="right" effect="solid">
                    In an Escrow Lootbox, you may only collect your fundraised amounts if the target funding is hit. You
                    may exceed the target funding, but only up to the max amount of shares available for sale. Click the
                    "End Fundraising" button will send the funds to your receiving wallet. If you can't hit your funding
                    goal, you may refund sponsors, which simply deposits the funds back into the Lootbox for sponsors to
                    redeem (the funds will not automatically be sent to their wallet, you must tell them to redeem it by
                    email or social media). Only the issuer of the Lootbox can offer a refund, but after 30 days anyone
                    can force a refund if the target has not been hit. If you created an Instant Lootbox instead, then
                    the funds get instantly sent to your receiving wallet and there is no refund (you would need to
                    manually deposit funds back). Before you can deposit funds back, you need to end the fundraising.
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Only collect the money if the funding target is hit. Otherwise refund the sponsors.
                </$StepSubheading>
                <$Vertical style={isActivelyFundraising ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
                  <$SmallerButton
                    screen={screen}
                    style={{ position: 'relative' }}
                    themeColor={props.network?.themeColor}
                    onClick={() => endFundraisingPeriod()}
                    disabled={endFundraisingButtonState !== 'enabled'}
                  >
                    {props.network?.icon && (
                      <$NetworkIcon src={props.network.icon} style={{ left: '10px', position: 'absolute' }} />
                    )}
                    {endFundraisingButtonState === 'pending' ? 'Pending...' : `End Fundraising`}
                  </$SmallerButton>
                  {endFundraisingButtonMessage && (
                    <$ErrorMessageMgmtPage status={endFundraisingButtonState}>
                      {endFundraisingButtonMessage}
                    </$ErrorMessageMgmtPage>
                  )}
                </$Vertical>
                <$Vertical style={isActivelyFundraising ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
                  <div style={props.lootboxType === 'Escrow' ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
                    <$SmallerButton
                      onClick={() => {
                        if (props.lootboxType === 'Escrow') {
                          refundSponsors()
                        }
                      }}
                      screen={screen}
                    >
                      {refundButtonState === 'pending' ? 'Pending...' : `Refund Sponsors`}
                    </$SmallerButton>
                    {refundButtonMessage && (
                      <$ErrorMessageMgmtPage status={refundButtonState}>{refundButtonMessage}</$ErrorMessageMgmtPage>
                    )}
                  </div>
                </$Vertical>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <div style={isActivelyFundraising ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
            <$Vertical style={{ marginTop: '20px' }}>
              <br />
              <$Horizontal style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
                <$Checkmark>{payoutsMade > 0 ? '✅' : '☑️'}</$Checkmark>
                <$Vertical>
                  <$Horizontal>
                    <$NextStepTitle>4. Play & Earn</$NextStepTitle>
                    <HelpIcon tipID="playAndEarn" />
                    <ReactTooltip id="playAndEarn" place="right" effect="solid">
                      Now that you've received the funds, you can go play and earn. It is good practice to update your
                      sponsors on social media so that they know what you are doing with the money, and so that other
                      people can see you as a professional. Make sure you also include #LootboxFund or tag us, so that
                      people can understand what is going on. If they do not understand its a Lootbox, you will miss out
                      on future potential sponsors.
                    </ReactTooltip>
                  </$Horizontal>
                  <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                    Play the crypto games you fundraised for. Update your sponsors with news if any. Tag @LootboxFund
                  </$StepSubheading>
                  <$Horizontal verticalCenter>
                    <$SmallerButton
                      onClick={() => window.open('https://twitter.com/LootboxFund', '_blank')}
                      screen={screen}
                    >
                      Tweet Updates to Sponsors
                    </$SmallerButton>
                  </$Horizontal>
                </$Vertical>
              </$Horizontal>
            </$Vertical>
          </div>
          <div style={isActivelyFundraising ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
            <$Vertical style={{ marginTop: '20px' }}>
              <br />
              <$Horizontal style={screen === 'desktop' ? {} : { flexDirection: 'column' }}>
                <$Checkmark>{payoutsMade > 0 ? '✅' : '☑️'}</$Checkmark>
                <$Vertical>
                  <$Horizontal>
                    <$NextStepTitle>5. Reward Sponsors</$NextStepTitle>
                    <HelpIcon tipID="rewardSponsorsMgmt" />
                    <ReactTooltip id="rewardSponsorsMgmt" place="right" effect="solid">
                      If you have earned a profit, you can reward your sponsors by depositing earnings back into your
                      Lootbox for sponsors to redeem. Anyone can deposit into your Lootbox, which allows a friend or
                      stranger to assist you too. Make sure you make a social media post about it so that sponsors and
                      strangers can see your success. This will help you in future fundraising. Be sure to use
                      #LootboxFund or tag us, so that they are not confused and understand what is going on.
                    </ReactTooltip>
                  </$Horizontal>
                  <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                    Share your crypto earnings with sponsors. Anyone can deposit earnings.
                  </$StepSubheading>
                  <$Horizontal verticalCenter>
                    <$SmallerButton
                      onClick={() => props.scrollToRewardSponsors()}
                      screen={screen}
                      themeColor={props.network?.themeColor}
                    >
                      Deposit Earnings
                    </$SmallerButton>
                  </$Horizontal>
                  <$Horizontal verticalCenter>
                    <$SmallerButton
                      onClick={() =>
                        window.open(`${props.network.blockExplorerUrl}address/${props.lootboxAddress}`, '_blank')
                      }
                      screen={screen}
                    >
                      View Deposit History
                    </$SmallerButton>
                  </$Horizontal>
                </$Vertical>
              </$Horizontal>
            </$Vertical>
          </div>
        </$Vertical>
        <$Vertical flex={1} spacing={3}>
          <div
            style={
              screen === 'desktop'
                ? {
                    maxHeight: '100px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }
                : {
                    maxHeight: '100px',
                    marginTop: '30px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }
            }
          >
            <NetworkText />
          </div>
          {props.ticketMetadata && (
            <div style={{ height: 'auto', marginBottom: '20px' }}>
              <TicketCardUI
                backgroundImage={props.ticketMetadata.lootboxCustomSchema?.lootbox.backgroundImage as string}
                logoImage={props.ticketMetadata.lootboxCustomSchema?.lootbox.image as string}
                backgroundColor={props.ticketMetadata.lootboxCustomSchema?.lootbox.backgroundColor as string}
                name={props.ticketMetadata.name as string}
                ticketId={'0' as TicketID}
              ></TicketCardUI>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: screen === 'desktop' ? '50px' : '20px',
            }}
          >
            <TicketsMinted fill={props.network.themeColor} mintedCount={parseInt(mintedCount.toString())} />
            {props.network?.icon && (
              <TotalFunded
                chainLogo={props.network?.icon}
                networkSymbol={props.network?.symbol}
                networkName={props.network.name}
                fundedAmountNative={fundedAmountNative}
                fundedAmountShares={fundedAmountShares}
                targetAmountShares={targetAmountShares}
                maxAmountShares={maxAmountShares}
              />
            )}
            <PayoutsMade fill={props.network.themeColor} payoutsMade={parseInt(payoutsMade.toString())} />
            <LootboxTypeStat fill={props.network.themeColor} lootboxType={props.lootboxType} />
            <SemverStat fill={props.network.themeColor} semver={semver} />
          </div>
        </$Vertical>
      </$Horizontal>
      <$Vertical style={screen === 'desktop' ? { padding: '40px' } : { padding: '0px', marginTop: '80px' }}>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Lootbox Address
            <HelpIcon tipID="lootboxAddress" />
            <ReactTooltip id="lootboxAddress" place="right" effect="solid">
              {`Every Lootbox has its own smart contract address. This Lootbox is on ${props.network.name}${
                props.network.isTestnet && ' Testnet'
              } with contract address ${
                props.lootboxAddress
              }. You can verify all details you see on this UI by viewing it on a Block Explorer.`}
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(props.lootboxAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
            </span>
            <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>{` | `}</span>
            <span
              onClick={() => window.open(`${props.network.blockExplorerUrl}address/${props.lootboxAddress}`, '_blank')}
              style={{ fontStyle: 'italic', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              View on Block Explorer
            </span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input
              value={props.lootboxAddress}
              screen={'mobile'}
              fontWeight="200"
              placeholder={props.lootboxAddress}
            />
          </$InputWrapper>
        </$Vertical>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Receiving Wallet
            <HelpIcon tipID="treasuryAddress" />
            <ReactTooltip id="treasuryAddress" place="right" effect="solid">
              The receiving wallet is where the funds raised by this Lootbox will go. This may be the original issuer's
              wallet, or it may be an ESports Tournament Wallet, or another smart contract destination. Make sure that
              the receiving wallet matches what you expected/intended. Anyone can create a Lootbox and style it to look
              like any other Lootbox, so always check that the receiving wallet is correct.
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(treasuryAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
            </span>
            <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>{` | `}</span>
            <span
              onClick={() => window.open(`${props.network.blockExplorerUrl}address/${treasuryAddress}`, '_blank')}
              style={{ fontStyle: 'italic', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              View on Block Explorer
            </span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input value={treasuryAddress} screen={'mobile'} fontWeight="200" placeholder={treasuryAddress} />
          </$InputWrapper>
        </$Vertical>
        <$Vertical style={{ marginBottom: '20px' }}>
          <$StepSubheading>
            Reputation Address
            <HelpIcon tipID="reputationAddress" />
            <ReactTooltip id="reputationAddress" place="right" effect="solid">
              This is the address that will receive recognition for this Lootbox's performance. If this Lootbox provides
              a good return on investment for sponsors, this reputatioin address will be associated with that good
              on-chain performance. Likewise, this wallet will be associated with bad performance if this Lootbox does
              poorly. But don't worry too much about bad performance, as its more important that there is ample history
              of Lootboxes created by this reputation address. Owning an address with a good reputation is a valuable
              asset that will help you in future fundraising. However, sponsors should not rely solely on on-chain
              performance history, as anyone can just send funds to their own Lootbox to make it look like good
              performance. Always check their social media (off-chain reputation) as well to get the full picture.
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(reputationAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
            </span>
            <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>{` | `}</span>
            <span
              onClick={() => window.open(`${props.network.blockExplorerUrl}address/${reputationAddress}`, '_blank')}
              style={{ fontStyle: 'italic', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              View on Block Explorer
            </span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <$Input value={reputationAddress} screen={'mobile'} fontWeight="200" placeholder={reputationAddress} />
          </$InputWrapper>
        </$Vertical>
        <$Vertical>
          <$StepSubheading style={{ marginBottom: '10px' }}>
            Advanced Settings
            <HelpIcon tipID="advancedSettings" />
            <ReactTooltip id="advancedSettings" place="right" effect="solid">
              This Lootbox management page handles 90% of use cases. If you need access to the full Lootbox controls,
              you will need to import this contract into OpenZeppelin Defender and interact with the blockchain
              directly. The most likely reason why you would need to use Advanced Controls is if you accidentally trap
              tokens in your Lootbox and need to rescue them (tokens get trapped if you just send them to the Lootbox
              address directly. always use the UI to reward sponsors instead of sending tokens directly. trapped tokens
              can be rescued easily but its a hassle). A full tutorial on Advanced Controls can be found on the
              LootboxFund YouTube Channel.
            </ReactTooltip>
          </$StepSubheading>
          <$SmallerButton screen={screen} onClick={() => window.open('https://youtu.be/o2J4M3ESdOo?t=138', '_blank')}>
            Launch OZ Defender
          </$SmallerButton>
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
  screen: ScreenSize
}>`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => `0px 3px 20px ${props.themeColor}`};
  border: ${(props) => `3px solid ${props.themeColor}`};
  border-radius: 20px;
  padding: ${(props) => (props.screen === 'desktop' ? '30px' : '20px')};
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

export const $ManageLootboxHeading = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '2.2rem' : '1.5rem')};
  font-weight: bold;
  color: ${COLORS.black};
`

export const $ErrorMessageMgmtPage = styled.span<{ status: ManagementButtonState }>`
  font-size: 1rem;
  color: ${(props) => (props.status === 'success' ? 'green' : 'red')};
  padding: 0px 0px 10px 0px;
  word-break: break-all;
`

const TotalFunded = ({
  chainLogo,
  networkSymbol,
  networkName,
  fundedAmountNative,
  fundedAmountShares,
  targetAmountShares,
  maxAmountShares,
}: {
  chainLogo: string
  networkSymbol: string
  networkName: string
  fundedAmountNative: string
  fundedAmountShares: string
  targetAmountShares: string
  maxAmountShares: string
}) => {
  return (
    <$Horizontal verticalCenter style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>{fundedAmountNative}</$StatFigure>
          <$StatLabel>{networkSymbol}</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Total Funded</$Datestamp>
          <HelpIcon tipID="totalFunded" />
          <ReactTooltip id="totalFunded" place="right" effect="solid">
            {`This Lootbox has a goal of selling ${targetAmountShares} shares purchased in ${networkSymbol}. So far, ${fundedAmountShares} shares have been sold. The max amount of shares for sale is ${maxAmountShares}.`}
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

const TicketsMinted = ({ fill, mintedCount }: { fill: string; mintedCount: number }) => {
  return (
    <$Horizontal verticalCenter style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>{mintedCount}</$StatFigure>
          <$StatLabel>minted</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Sold NFT Tickets</$Datestamp>
          <HelpIcon tipID="soldNFTTickets" />
          <ReactTooltip id="soldNFTTickets" place="right" effect="solid">
            The number of NFT tickets sold by this Lootbox. One sponsor may own multiple NFT tickets and they may be
            traded to new owners. Each NFT ticket may contain a different number of shares. If you would like to see the
            total number of unique sponsors owned by this Lootbox, import this contract into OpenZeppelin Defender
            (Advanced Settings). A full tutorial can be found on the LootboxFund YouTube Channel.
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <CardsIcon fill={fill} />
    </$Horizontal>
  )
}

const PayoutsMade = ({ fill, payoutsMade }: { fill: string; payoutsMade: number }) => {
  return (
    <$Horizontal alignItems="flex-end" style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure>{payoutsMade}</$StatFigure>
          <$StatLabel>Rewards</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Deposits Made</$Datestamp>
          <HelpIcon tipID="depositsMade" />
          <ReactTooltip id="depositsMade" place="right" effect="solid">
            The number of times a deposit was put into this Lootbox. Each deposit is a payout reward for sponsors to
            redeem. Only sponsors who own an NFT ticket from this Lootbox can redeem their proportinal share of
            deposited rewards. Anyone can deposit into a Lootbox. If you would like to see the total number of unique
            addresses who deposited into this Lootbox, import this contract into OpenZeppelin Defender (Advanced
            Settings). A full tutorial can be found on the LootboxFund YouTube Channel.
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <SeedlingIcon fill={fill} />
    </$Horizontal>
  )
}

const SemverStat = ({ fill, semver }: { fill: string; semver: string }) => {
  return (
    <$Horizontal alignItems="flex-end" style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatFigure></$StatFigure>
          <$StatLabel>{semver}</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter justifyContent="flex-end">
          <$Datestamp style={{ margin: '5px 0px' }}>Version</$Datestamp>
          <HelpIcon tipID="versionSemver" />
          <ReactTooltip id="versionSemver" place="right" effect="solid">
            This is the version of the LootboxFund smart contract which you can use to determine its features available.
            The Lootbox team is continously improving this technology and future Lootboxes will have a different version
            number. While future Lootbox versions are not guaranteed to be backwards compatible, you can always access
            past Lootboxes as we freeze the cloud infrastructure that provides this UI. Furthermore, if this UI ever
            becomes unavailable, you can always use OpenZeppelin Defender to interact with the smart contract directly
            as it is forever available on the blockchain.
          </ReactTooltip>
        </$Horizontal>
      </$Vertical>
      <SemverIcon fill={fill} />
    </$Horizontal>
  )
}

const LootboxTypeStat = ({ fill, lootboxType }: { fill: string; lootboxType: LootboxType }) => {
  return (
    <$Horizontal alignItems="flex-end" style={{ marginTop: '20px' }}>
      <$Vertical style={{ marginRight: '10px' }}>
        <$Horizontal justifyContent="flex-end" alignItems="center" style={{ marginRight: '25px' }}>
          <$StatLabel>{lootboxType}</$StatLabel>
        </$Horizontal>
        <$Horizontal verticalCenter>
          <$Datestamp style={{ margin: '5px 0px' }}>Lootbox Type</$Datestamp>
          <HelpIcon tipID="lootboxType" />
          <ReactTooltip id="lootboxType" place="right" effect="solid">
            There are two types of Lootboxes, Escrow & Instant. Most Lootboxes are Escrow type, which means it has a
            target fundraising amount and the funds can only be accessed when that target is hit, otherwise the money is
            refunded back to sponsors. In comparison, an Instant Lootbox will transfer raised funds immediately to the
            receiving wallet without waiting, and refunds must be done manually by the issuer of the Lootbox (the
            reputation address). For more info, check out the LootboxFund YouTube channel.
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
