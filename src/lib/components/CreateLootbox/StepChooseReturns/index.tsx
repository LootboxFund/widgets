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

export interface StepChooseReturnsProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  returnTarget: number | undefined;
  setReturnTarget: (amount: number) => void;
  paybackDate: Date | undefined;
  setPaybackDate: (date: Date | null) => void;
  onNext: () => void;
}
const StepChooseReturns = (props: StepChooseReturnsProps) => {
  const { screen } = useWindowSize()
  const renderTargetReturn = () => {
    const calculateInputWidth = () => {
      const projectedWidth = ((props.returnTarget)?.toString() || "").length * 20;
      const width = projectedWidth > 200 ? 200 : projectedWidth;
      return `${props.returnTarget ? width : 30}px`
    }
    return (
      <$Horizontal alignItems='flex-end'>
        <$BigIcon>🌓</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$StepSubheading>Target Return on Investment</$StepSubheading>
          <$InputWrapper>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <div style={{ flex: 9, width: 'auto', maxWidth: '200px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <$Input type="number" value={props.returnTarget} onChange={(e) => props.setReturnTarget(e.target.valueAsNumber)} placeholder="10" screen={screen} width={calculateInputWidth()} />
                <$InputTranslationLight>%</$InputTranslationLight>
              </div>
              <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
                <$InputTranslationHeavy>$10,000 USD</$InputTranslationHeavy>
              </div>
            </div>
          </$InputWrapper>
        </div>
      </$Horizontal>
    )
  }
  const renderTargetPayback = () => {
    return (
      <$Horizontal alignItems='flex-end'>
        <$BigIcon>⏳</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$StepSubheading>Payback in 34 Days</$StepSubheading>
          <$InputWrapper>
            <$Input value={props.paybackDate?.getTime()} type="date" placeholder="March 16th 2022" screen={'mobile'} fontWeight="200" onChange={(e) => props.setPaybackDate(e.target.valueAsDate)} />
          </$InputWrapper>
        </div>
      </$Horizontal>
    )
  }
	return (
		<$StepChooseReturns>
      <StepCard primaryColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}>
        <$Horizontal flex={1}>
          <$Vertical flex={3}>
            <$StepHeading>3. How will your reward your investors?</$StepHeading>
            <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
            <br /><br />
            {renderTargetReturn()}
            <br />
            {renderTargetPayback()}
          </$Vertical>
          <$Vertical flex={1}>
            <img style={{ width: '150px', marginTop: '50px' }} src={"https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FReturnScales.png?alt=media"} />
          </$Vertical>
        </$Horizontal>
      </StepCard>
		</$StepChooseReturns>
	)
}

const $BigIcon = styled.span`
  font-size: 2.2rem;
  padding-bottom: 10px;
  padding-right: 10px;
`

const $InputWrapper = styled.div`
  background-color: #F1F1F1;
  display: flex;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-right: 50px;
`

const $StepChooseReturns = styled.section<{}>`
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

export default StepChooseReturns;