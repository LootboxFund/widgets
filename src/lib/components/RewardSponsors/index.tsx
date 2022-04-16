import { Address, ContractAddress } from '@wormgraph/helpers'
import { NetworkOption } from 'lib/api/network'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import NetworkText from '../NetworkText'
import { $ManageLootboxHeading } from '../ManageLootbox'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $StepSubheading } from '../CreateLootbox/StepCard'
import $SmallerButton from '../Generics/SmallerButton/SmallerButton'
import { $NetworkIcon } from '../CreateLootbox/StepChooseNetwork'
import { COLORS } from '../../theme/index'
import BigNumber from 'bignumber.js'
import { $InputTranslationHeavy, $InputTranslationLight, $InputWrapper } from '../CreateLootbox/StepChooseFunding'
import $Input from '../Generics/Input'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { $TextAreaMedium } from '../CreateLootbox/StepCustomize'
import WalletStatus from 'lib/components/WalletStatus'

const calculateEquivalentUSDPrice = (amount: BigNumber) => `10,000`

type RewardMethod = 'native' | 'erc20'
export interface RewardSponsorsProps {
  lootboxAddress: ContractAddress
}
const RewardSponsors = (props: RewardSponsorsProps) => {
  const web3Utils = useWeb3Utils()
  const [network, setNetwork] = useState<NetworkOption>()
  const [rewardMethod, setRewardMethod] = useState<RewardMethod>('native')
  const [erc20Address, setErc20Address] = useState<ContractAddress>()
  const [targetLootboxAddress, setTargetLootboxAddress] = useState<ContractAddress>(props.lootboxAddress)
  const [reputationAddress, setReputationAddress] = useState<Address>()
  const [nativeRewardAmount, setNativeRewardAmount] = useState(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
  const [erc20RewardAmount, setErc20RewardAmount] = useState(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
  const [transactionNote, setTransactionNote] = useState('')
  const { screen } = useWindowSize()
  // TEMP
  useEffect(() => {
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
  }, [])
  // TEMP
  const calculateInputWidth = (amount: BigNumber) => {
    const projectedWidth = web3Utils.fromWei(amount || '0').toString().length * 20
    const width = projectedWidth > 200 ? 200 : projectedWidth
    return `${amount ? width : 100}px`
  }
  const renderNativeRewardMethod = () => {
    return (
      <$Vertical>
        <$StepSubheading>
          Reward with Native Token
          <HelpIcon tipID="withNativeToken" />
          <ReactTooltip id="withNativeToken" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <div
              style={{
                flex: 9,
                width: 'auto',
                maxWidth: '200px',
                paddingLeft: '10px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              {network && <$NetworkIcon size="medium" src={network.icon} />}
              <$Input
                type="number"
                value={web3Utils.fromWei(nativeRewardAmount).toString()}
                min="0"
                onChange={(e) => setNativeRewardAmount(web3Utils.toBN(web3Utils.toWei(e.target.value || '0')))}
                placeholder="0.01"
                screen={screen}
                width={calculateInputWidth(nativeRewardAmount)}
              />
              <$InputTranslationLight>{network?.symbol}</$InputTranslationLight>
            </div>
            <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
              <$InputTranslationHeavy>{`$${calculateEquivalentUSDPrice(
                nativeRewardAmount
              )} USD`}</$InputTranslationHeavy>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }

  const renderErc20RewardMethod = () => {
    return (
      <$Vertical>
        <$StepSubheading>
          ERC20 Contract Address
          <HelpIcon tipID="withErc20Token" />
          <ReactTooltip id="withErc20Token" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
          <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <$Input
            value={erc20Address}
            min="0"
            onChange={(e) => setErc20Address(e.target.value as ContractAddress)}
            placeholder="0x000..."
            screen={screen}
          />
        </$InputWrapper>
        <br />
        <$StepSubheading>
          Amount of ERC20 Token
          <HelpIcon tipID="withNativeToken" />
          <ReactTooltip id="withNativeToken" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <div
              style={{
                flex: 9,
                width: 'auto',
                maxWidth: '200px',
                paddingLeft: '10px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              {network && <$NetworkIcon size="medium" src={network.icon} />}
              <$Input
                type="number"
                value={web3Utils.fromWei(erc20RewardAmount).toString()}
                min="0"
                onChange={(e) => setErc20RewardAmount(web3Utils.toBN(web3Utils.toWei(e.target.value || '0')))}
                placeholder="0.01"
                screen={screen}
                width={calculateInputWidth(erc20RewardAmount)}
              />
              <$InputTranslationLight>{`VIS`}</$InputTranslationLight>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }

  if (!network) {
    return null
  }

  const allConditionsMet = false

  return (
    <$StepCard themeColor={network.themeColor}>
      <$Horizontal>
        <$Vertical flex={2}>
          <$Horizontal verticalCenter style={{ marginBottom: '20px' }}>
            <$ManageLootboxHeading>Reward Sponsors</$ManageLootboxHeading>
            <HelpIcon tipID="rewardSponsors" />
            <ReactTooltip id="rewardSponsors" place="right" effect="solid">
              Lorem Ipsum
            </ReactTooltip>
          </$Horizontal>
          <$StepSubheading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod.
          </$StepSubheading>
        </$Vertical>
        <$Horizontal flex={1} justifyContent="flex-end">
          <WalletStatus />
        </$Horizontal>
      </$Horizontal>
      <$Vertical style={{ marginTop: '40px' }}>
        <$StepSubheading>
          Pick Reward Method
          <HelpIcon tipID="rewardMethod" />
          <ReactTooltip id="rewardMethod" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
        </$StepSubheading>
        {network?.icon && network?.symbol && (
          <$SmallerButton
            onClick={() => setRewardMethod('native')}
            screen={screen}
            themeColor={rewardMethod === 'native' ? network?.themeColor : '#ffffff'}
            style={{
              color: rewardMethod === 'native' ? COLORS.white : COLORS.surpressedFontColor,
              position: 'relative',
            }}
          >
            <$NetworkIcon src={network.icon} style={{ left: '10px', position: 'absolute' }} />
            {network.symbol}
          </$SmallerButton>
        )}
        <$SmallerButton
          onClick={() => setRewardMethod('erc20')}
          screen={screen}
          themeColor={rewardMethod === 'erc20' ? network?.themeColor : '#ffffff'}
          style={{ color: rewardMethod === 'erc20' ? COLORS.white : COLORS.surpressedFontColor, position: 'relative' }}
        >
          <span style={{ left: '10px', position: 'absolute', fontSize: '1.3rem' }}>💎</span>
          ERC20
        </$SmallerButton>
      </$Vertical>
      <$Vertical style={{ marginTop: '40px' }}>
        {rewardMethod === 'native' ? renderNativeRewardMethod() : renderErc20RewardMethod()}
      </$Vertical>
      <$Vertical style={{ marginTop: '20px' }}>
        <$StepSubheading>
          Lootbox Address
          <HelpIcon tipID="lootboxAddress" />
          <ReactTooltip id="lootboxAddress" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
          <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input
              type="number"
              value={targetLootboxAddress}
              min="0"
              onChange={(e) => setTargetLootboxAddress(e.target.value as ContractAddress)}
              screen={screen}
            />
          </div>
        </$InputWrapper>
        <br />
        <$StepSubheading>
          <span>Optional Note</span>
          <HelpIcon tipID="ticketBiography" />
          <ReactTooltip id="ticketBiography" place="right" effect="solid">
            Write a 3-5 sentence introduction of yourself and what you plan to use the investment money for.
          </ReactTooltip>
        </$StepSubheading>
        <$TextAreaMedium
          onChange={(e) => setTransactionNote(e.target.value)}
          value={transactionNote}
          rows={6}
          maxLength={500}
          style={{ maxWidth: '90%' }}
        />
        <br />
        <$StepSubheading>
          Reputation Address
          <HelpIcon tipID="reputationAddress" />
          <ReactTooltip id="reputationAddress" place="right" effect="solid">
            Lorem Ipsum
          </ReactTooltip>
          <span style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}>Copy</span>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <$Input type="number" value={reputationAddress} screen={screen} />
          </div>
        </$InputWrapper>
      </$Vertical>
      <$Vertical style={{ marginTop: '40px' }}>
        <$RewardSponsorsButton
          disabled={!allConditionsMet}
          allConditionsMet={allConditionsMet}
          onClick={() => {}}
          themeColor={network.themeColor}
        >
          REWARD SPONSORS
        </$RewardSponsorsButton>
      </$Vertical>
    </$StepCard>
  )
}

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
  padding: 40px;
  max-width: 800px;
  font-family: sans-serif;
`

const $RewardSponsorsButton = styled.button<{ themeColor?: string; allConditionsMet: boolean }>`
  background-color: ${(props) => (props.allConditionsMet ? props.themeColor : `${props.themeColor}30`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${(props) => (props.allConditionsMet ? 'pointer' : 'not-allowed')};
  color: ${(props) => (props.allConditionsMet ? COLORS.white : `${props.themeColor}40`)};
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  padding: 20px;
`

export default RewardSponsors
