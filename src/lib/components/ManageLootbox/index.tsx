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
import WalletStatus from 'lib/components/WalletStatus'
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

  const [fundedAmountNative, setFundedAmountNative] = useState()
  const [fundedAmountUSD, setFundedAmountUSD] = useState()
  const [fundedAmountShares, setFundedAmountShares] = useState()
  const [targetAmountNative, setTargetAmountNative] = useState()
  const [targetAmountUSD, setTargetAmountUSD] = useState()
  const [targetAmountShares, setTargetAmountShares] = useState()
  const [maxAmountNative, setMaxAmountNative] = useState()
  const [maxAmountUSD, setMaxAmountUSD] = useState()
  const [maxAmountShares, setMaxAmountShares] = useState()
  const [isActivelyFundraising, setIsActivelyFundraising] = useState()
  const [mintedCount, setMintedCount] = useState(0)
  const [payoutsMade, setPayoutsMade] = useState(0)
  const [semver, setSemver] = useState('undefined')
  const [deploymentDate, setDeploymentDate] = useState()
  const [treasuryAddress, setTreasuryAddress] = useState()
  const [reputationAddress, setReputationAddress] = useState()
  const [percentageFunded, setPercentageFunded] = useState()

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
        _targetAmountNative,
        _targetAmountUSD,
        _targetAmountShares,
        _maxAmountNative,
        _maxAmountUSD,
        _maxAmountShares,
        _isActivelyFundraising,
        _mintedCount,
        _payoutsMade,
        _deploymentDate,
        _treasuryAddress,
        _reputationAddress,
        _percentageFunded,
        _semver
      ] = await getLootboxEscrowManagementDetails(props.lootboxAddress, props.network.priceFeed as ContractAddress)
      setFundedAmountNative(_fundedAmountNative)
      setFundedAmountUSD(_fundedAmountUSD)
      setFundedAmountShares(_fundedAmountShares)
      setTargetAmountNative(_targetAmountNative)
      setTargetAmountUSD(_targetAmountUSD)
      setTargetAmountShares(_targetAmountShares)
      setMaxAmountNative(_maxAmountNative)
      setMaxAmountUSD(_maxAmountUSD)
      setMaxAmountShares(_maxAmountShares)
      setIsActivelyFundraising(_isActivelyFundraising)
      setMintedCount(_mintedCount)
      setPayoutsMade(_payoutsMade)
      setDeploymentDate(_deploymentDate)
      setTreasuryAddress(_treasuryAddress)
      setReputationAddress(_reputationAddress)
      setPercentageFunded(_percentageFunded)
      setSemver(_semver)
    } else if (props.lootboxType === 'Instant' && props.network.priceFeed) {
      const [
        _fundedAmountNative,
        _fundedAmountUSD,
        _fundedAmountShares,
        _targetAmountNative,
        _targetAmountUSD,
        _targetAmountShares,
        _maxAmountNative,
        _maxAmountUSD,
        _maxAmountShares,
        _isActivelyFundraising,
        _mintedCount,
        _payoutsMade,
        _deploymentDate,
        _treasuryAddress,
        _reputationAddress,
        _percentageFunded,
        _semver
      ] = await getLootboxInstantManagementDetails(props.lootboxAddress, props.network.priceFeed as ContractAddress)
      setFundedAmountNative(_fundedAmountNative)
      setFundedAmountUSD(_fundedAmountUSD)
      setFundedAmountShares(_fundedAmountShares)
      setTargetAmountNative(_targetAmountNative)
      setTargetAmountUSD(_targetAmountUSD)
      setTargetAmountShares(_targetAmountShares)
      setMaxAmountNative(_maxAmountNative)
      setMaxAmountUSD(_maxAmountUSD)
      setMaxAmountShares(_maxAmountShares)
      setIsActivelyFundraising(_isActivelyFundraising)
      setMintedCount(_mintedCount)
      setPayoutsMade(_payoutsMade)
      setDeploymentDate(_deploymentDate)
      setTreasuryAddress(_treasuryAddress)
      setReputationAddress(_reputationAddress)
      setPercentageFunded(_percentageFunded)
      setSemver(_semver)
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
      setEndFundraisingButtonMessage('Fundraising period successfully ended. You may now reward sponsors.')
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

  if (
    !props.network.themeColor ||
    !fundedAmountNative ||
    !fundedAmountUSD ||
    !fundedAmountShares ||
    !targetAmountNative ||
    !targetAmountUSD ||
    !targetAmountShares ||
    !maxAmountNative ||
    !maxAmountUSD ||
    !maxAmountShares ||
    !deploymentDate ||
    !treasuryAddress ||
    !reputationAddress
  ) {
    return null
  }

  const daysAgo = parseInt(calculateDaysBetween(deploymentDate).toFixed(0))

  return (
    <$StepCard themeColor={props.network.themeColor}>
      <$Vertical>
        <$Horizontal justifyContent="space-between">
          <$Horizontal verticalCenter>
            <span
              style={{ fontSize: '1.3rem', color: COLORS.surpressedFontColor, fontWeight: 'bold', marginRight: '10px' }}
            >
              {`${percentageFunded}% Funded`}
            </span>
            <span
              style={{
                fontSize: '1rem',
                color: COLORS.surpressedFontColor,
                fontWeight: 'lighter',
                marginRight: '10px',
              }}
            >
              {`${fundedAmountNative} ${props.network.symbol}`}
            </span>
          </$Horizontal>
          <$Horizontal>
            <span style={{ fontSize: '1.3rem', color: COLORS.surpressedFontColor, fontWeight: 'bold' }}>
              {`${targetAmountNative} ${props.network.symbol} Goal`}
            </span>
            <HelpIcon tipID="fundingGoal" />
            <ReactTooltip id="fundingGoal" place="right" effect="solid">
              Max 10 MATIC
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
      <$Horizontal style={{ marginTop: '30px' }}>
        <$Vertical flex={2}>
          <$Horizontal verticalCenter>
            <$ManageLootboxHeading>{props.ticketMetadata.name}</$ManageLootboxHeading>
            <HelpIcon tipID="lootboxTitle" />
            <ReactTooltip id="lootboxTitle" place="right" effect="solid">
              Lorem Ipsum
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
                onClick={() => window.open(`${props.network.blockExplorerUrl}address/${props.lootboxAddress}`, '_blank')}
                style={{ textDecoration: 'underline', fontStyle: 'italic', cursor: 'pointer' }}
              >{`${truncateAddress(props.lootboxAddress)}`}</span>
              <span>
                . It is made for the Lootbox creator but anyone can use it. Watch this Youtube Tutorial to learn how.
              </span>
            </div>
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
                  {`Publish your Lootbox to ${props.network.name}${props.network.isTestnet && ' Testnet'}. You cannot change your funding goal after publishing.`}
                </$StepSubheading>
                <$Horizontal verticalCenter>
                  <$SmallerButton onClick={() => {
                    window.open(manifest.microfrontends.webflow.createPage, '_blank')
                  }} screen={screen}>
                    Create Another
                  </$SmallerButton>
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
                  <$SmallerButton
                    onClick={() => window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${props.lootboxAddress}`, '_blank')}
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
            <$Horizontal>
              <$Checkmark>{isActivelyFundraising ? '☑️' : '✅'}</$Checkmark>
              <$Vertical>
                <$Horizontal>
                  <$NextStepTitle>{isActivelyFundraising ? `3. Finish Fundraising` : `3. Finished Fundraising`}</$NextStepTitle>
                  <HelpIcon tipID="finishFundraising" />
                  <ReactTooltip id="finishFundraising" place="right" effect="solid">
                    Lorem Ipsum
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ margin: '5px 0px 10px 0px' }}>
                  Only collect the money if the funding target is hit. Otherwise refund the sponsors.
                </$StepSubheading>
                <$Vertical style={ isActivelyFundraising ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
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
                  {
                    endFundraisingButtonMessage && <$ErrorMessageMgmtPage status={endFundraisingButtonState}>{endFundraisingButtonMessage}</$ErrorMessageMgmtPage>
                  }
                </$Vertical>
                <$Vertical style={ isActivelyFundraising ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
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
                    {
                      refundButtonMessage && <$ErrorMessageMgmtPage status={refundButtonState}>{refundButtonMessage}</$ErrorMessageMgmtPage>
                    }
                  </div>
                </$Vertical>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
          <div style={isActivelyFundraising ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
            <$Vertical style={{ marginTop: '20px' }}>
              <br />
              <$Horizontal>
                <$Checkmark>{payoutsMade > 0 ? '✅' : '☑️'}</$Checkmark>
                <$Vertical>
                  <$Horizontal>
                    <$NextStepTitle>4. Play & Earn</$NextStepTitle>
                    <HelpIcon tipID="playAndEarn" />
                    <ReactTooltip id="playAndEarn" place="right" effect="solid">
                      Lorem Ipsum
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
              <$Horizontal>
                <$Checkmark>{payoutsMade > 0 ? '✅' : '☑️'}</$Checkmark>
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
                    <$SmallerButton onClick={() => props.scrollToRewardSponsors()} screen={screen} themeColor={props.network?.themeColor}>
                      Deposit Earnings
                    </$SmallerButton>
                  </$Horizontal>
                  <$Horizontal verticalCenter>
                    <$SmallerButton
                      onClick={() => window.open(`${props.network.blockExplorerUrl}address/${props.lootboxAddress}`, '_blank')}
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
          {props.ticketMetadata && (
            <div style={{ height: 'auto', marginBottom: '20px' }}>
              <TicketCardUI
                backgroundImage={props.ticketMetadata.backgroundImage as string}
                logoImage={props.ticketMetadata.image as string}
                backgroundColor={props.ticketMetadata.backgroundColor as string}
                name={props.ticketMetadata.name as string}
                ticketId={'0' as TicketID}
              ></TicketCardUI>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '50px' }}>
            <TicketsMinted fill={props.themeColor} mintedCount={parseInt(mintedCount.toString())} />
            {props.network?.icon && (
              <TotalFunded
                chainLogo={props.network?.icon}
                networkSymbol={props.network?.symbol}
                fundedAmountNative={fundedAmountNative}
                fundedAmountUSD={fundedAmountUSD}
                fundedAmountShares={fundedAmountShares}
                targetAmountNative={targetAmountNative}
                targetAmountUSD={targetAmountUSD}
                targetAmountShares={targetAmountShares}
                maxAmountNative={maxAmountNative}
                maxAmountUSD={maxAmountUSD}
                maxAmountShares={maxAmountShares}
              />
            )}
            <PayoutsMade fill={props.themeColor} payoutsMade={parseInt(payoutsMade.toString())} />
            <LootboxTypeStat fill={props.themeColor} lootboxType={props.lootboxType} />
            <SemverStat fill={props.themeColor} semver={semver} />
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
            <span
              onClick={() => navigator.clipboard.writeText(props.lootboxAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
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
            Treasury Address
            <HelpIcon tipID="treasuryAddress" />
            <ReactTooltip id="treasuryAddress" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(treasuryAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
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
              Lorem Ipsum
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(reputationAddress)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
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
              Lorem Ipsum
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

export const $ErrorMessageMgmtPage = styled.span<{ status: ManagementButtonState }>`
  font-size: 1rem;
  color: ${props => props.status === 'success' ? 'green' : 'red' };
  padding: 0px 0px 10px 0px;
`

const TotalFunded = ({
  chainLogo,
  networkSymbol,
  fundedAmountNative,
  fundedAmountUSD,
  fundedAmountShares,
  targetAmountNative,
  targetAmountUSD,
  targetAmountShares,
  maxAmountNative,
  maxAmountUSD,
  maxAmountShares,
}: {
  chainLogo: string
  networkSymbol: string
  fundedAmountNative: string
  fundedAmountUSD: string
  fundedAmountShares: string
  targetAmountNative: string
  targetAmountUSD: string
  targetAmountShares: string
  maxAmountNative: string
  maxAmountUSD: string
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
            Lorem Ipsum
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
            Lorem Ipsum
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
        <$Horizontal verticalCenter justifyContent='flex-end'>
          <$Datestamp style={{ margin: '5px 0px' }}>Version</$Datestamp>
          <HelpIcon tipID="depositsMade" />
          <ReactTooltip id="depositsMade" place="right" effect="solid">
            Lorem Ipsum
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
