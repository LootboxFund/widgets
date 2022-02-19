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
import { $NetworkIcon, NetworkOption } from '../StepChooseNetwork';

interface Errors {
  returnTarget: string;
  paybackDate: string;
}
export interface StepChooseReturnsProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  returnTarget: number | undefined;
  setReturnTarget: (amount: number) => void;
  paybackDate: string | undefined;
  setPaybackDate: (date: string) => void;
  setValidity: (bool: boolean) => void;
  onNext: () => void;
}
const StepChooseReturns = (props: StepChooseReturnsProps) => {
  const { screen } = useWindowSize()
  const initialErrors = {
    returnTarget: '',
    paybackDate: ''
  }
  const [errors, setErrors] = useState(initialErrors)
  const validateReturnTarget = (returnTarget: number | undefined) => returnTarget && returnTarget > 0
  const validatePaybackPeriod = (payback: string | undefined) => payback && new Date(payback) > new Date()

  const renderTargetReturn = () => {
    const calculateInputWidth = () => {
      const projectedWidth = ((props.returnTarget)?.toString() || "").length * 20;
      const width = projectedWidth > 200 ? 200 : projectedWidth;
      return `${props.returnTarget ? width : 100}px`
    }
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setReturnTarget(e.target.valueAsNumber)
      const validReturn = validateReturnTarget(e.target.valueAsNumber)
      const validPayback = validatePaybackPeriod(props.paybackDate)
      console.log(`
        
      ---- parseInput (target return) ----
      validReturn: ${validReturn}
      validPayback: ${validPayback}

      `)
      if (validReturn) {
        setErrors({
          ...errors,
          returnTarget: ''
        })
      } else if (validReturn && validPayback) {
        props.setValidity(true)
      } else {
        setErrors({
          ...errors,
          returnTarget: 'Target return must be greater than zero'
        })
        props.setValidity(false)
      }
    }
    return (
      <$Horizontal alignItems='flex-end'>
        <$BigIcon>🌓</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$StepSubheading>Target Return on Investment</$StepSubheading>
          <$InputWrapper>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <div style={{ flex: 9, width: 'auto', maxWidth: '200px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <$Input type="number" min="0" value={props.returnTarget} onChange={parseInput} placeholder="10" screen={screen} width={calculateInputWidth()} />
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
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setPaybackDate(e.target.value)
      const validReturn = validateReturnTarget(props.returnTarget)
      const validPayback = validatePaybackPeriod(e.target.value || undefined)
      console.log(`
        
      ---- parseInput (target payback) ----
      validReturn: ${validReturn}
      validPayback: ${validPayback}

      `)
      if (validReturn && validPayback) {
        setErrors({
          ...errors,
          paybackDate: '',
          returnTarget: ''
        })
        props.setValidity(true)
      } else if (validPayback) {
        setErrors({
          ...errors,
          paybackDate: ''
        })
      } else if (!validPayback) {
        setErrors({
          ...errors,
          paybackDate: 'Target payback date must be in the future'
        })
        props.setValidity(false)
      }
    }
    return (
      <$Horizontal alignItems='flex-end'>
        <$BigIcon>⏳</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$StepSubheading>Payback in 34 Days</$StepSubheading>
          <$InputWrapper>
            <$Input value={props.paybackDate} type="date" placeholder="March 16th 2022" screen={'mobile'} fontWeight="200" onChange={parseInput} />
          </$InputWrapper>
        </div>
      </$Horizontal>
    )
  }
	return (
		<$StepChooseReturns>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext} errors={Object.values(errors)}>
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
  width: 100%;
  color: ${COLORS.black};
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