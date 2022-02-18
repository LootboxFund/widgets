import react, { useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon } from '../StepChooseNetwork';

export interface NetworkOption {
  name: string;
  icon: string;
  symbol: string;
  themeColor: string;
  chainIdHex: ChainIDHex,
  chainIdDecimal: ChainIDDecimal,
  isAvailable: boolean;
}

export interface StepChooseFundingProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  fundraisingTarget: string;
  setFundraisingTarget: (amount: string) => void;
  receivingWallet: string;
  setReceivingWallet: (addr: string) => void
  onNext: () => void;
}
const StepChooseFunding = (props: StepChooseFundingProps) => {
  const { screen } = useWindowSize()
  const renderInputFundraisingTarget = () => {
    const calculateInputWidth = () => {
      const projectedWidth = props.fundraisingTarget.length * 20;
      const width = projectedWidth > 200 ? 200 : projectedWidth;
      return `${props.fundraisingTarget ? width : 50}px`
    }
    return (
      <$Vertical>
        <$StepSubheading>Fundraising Target</$StepSubheading>
        <$InputWrapper>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <div style={{ flex: 9, width: 'auto', maxWidth: '200px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              {
                props.selectedNetwork && <$NetworkIcon size="medium" src={props.selectedNetwork.icon} />
              }
              <$Input type="number" value={props.fundraisingTarget} onChange={(e) => props.setFundraisingTarget(e.target.value)} placeholder="0.01" screen={screen} width={calculateInputWidth()} />
              <$InputTranslationLight>{props.selectedNetwork?.symbol}</$InputTranslationLight>
            </div>
            <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
              <$InputTranslationHeavy>$10,000 USD</$InputTranslationHeavy>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }
  const renderInputReceivingWallet = () => {
    return (
      <$Vertical>
        <$StepSubheading>Receiving Wallet</$StepSubheading>
        <$InputWrapper>
          <$Input value={props.receivingWallet} placeholder="0xAutodetectYourWallet" screen={'mobile'} fontWeight="200" onChange={(e) => props.setReceivingWallet(e.target.value)} />
        </$InputWrapper>
      </$Vertical>
    )
  }
	return (
		<$StepChooseFunding>
      <StepCard primaryColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}>
        <$Horizontal flex={1}>
          <$Vertical flex={3}>
            <$StepHeading>2. How much money do you need?</$StepHeading>
            <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
            <br /><br />
            {renderInputFundraisingTarget()}
            <br />
            {renderInputReceivingWallet()}
          </$Vertical>
          <$Vertical flex={1}>
            <img style={{ width: '150px', marginTop: '50px' }} src={"https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FFundingScales.png?alt=media"} />
          </$Vertical>
        </$Horizontal>
      </StepCard>
		</$StepChooseFunding>
	)
}

const $InputWrapper = styled.div`
  background-color: #F1F1F1;
  display: flex;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-right: 50px;
`

const $StepChooseFunding = styled.section<{}>`
  font-family: sans-serif;
`

const $InputTranslationLight = styled.span`
  font-weight: 200;
  color: ${COLORS.surpressedFontColor};
`

const $InputTranslationHeavy = styled.span`
  font-weight: 600;
  color: ${COLORS.surpressedFontColor};
`

export default StepChooseFunding;