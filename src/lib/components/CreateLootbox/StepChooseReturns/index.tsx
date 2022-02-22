import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal, containsAlphanumeric } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon } from '../StepChooseNetwork';
import { getPriceFeed } from 'lib/hooks/useContract';
import { BigNumber } from 'bignumber.js';
import { NetworkOption } from '../state';
import { useWeb3Utils } from 'lib/hooks/useWeb3Api';

export interface StepChooseReturnsProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  paybackDate: string | undefined;
  setPaybackDate: (date: string) => void;
  setValidity: (bool: boolean) => void;
  fundraisingTarget: BigNumber;
  basisPoints: number;
  setBasisPoints: (basisPoints: number) => void;
  onNext: () => void;
}
const StepChooseReturns = forwardRef((props: StepChooseReturnsProps, ref: React.RefObject<HTMLDivElement>) => {
  const web3Utils = useWeb3Utils()
  const { screen } = useWindowSize()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  const initialErrors = {
    returnTarget: '',
    paybackDate: ''
  }
  const [errors, setErrors] = useState(initialErrors)
  const validateReturnTarget = (returnTarget: number) => returnTarget && returnTarget > 0
  const validatePaybackPeriod = (payback: string | undefined) => payback && new Date(payback) > new Date()
  useEffect(() => {
    getLatestPrice()
  }, [props.selectedNetwork])
  const getLatestPrice = async () => {
    if (props.selectedNetwork?.priceFeed) {
      const nativeTokenPrice = await getPriceFeed(props.selectedNetwork.priceFeed)
      setNativeTokenPrice(nativeTokenPrice)
    }
  }
  const calculateEquivalentUSDPrice = (basisPoints?: number): BigNumber => {
    const price = nativeTokenPrice
      ?
      nativeTokenPrice.multipliedBy(
        props.fundraisingTarget
      ).multipliedBy((100 + (basisPoints || 0)) / 100).dividedBy(10 ** 18).toFixed(2)
      :
      web3Utils.toBN(0)
    if (!price && isNaN(price)) {
      return web3Utils.toBN(0)
    }
    return price
  }
  const calculateEquivalentUSDPriceDiff = (basisPoints: number): BigNumber => {
    const price = nativeTokenPrice
      ?
      nativeTokenPrice.multipliedBy(
        props.fundraisingTarget
      ).multipliedBy((100 + (basisPoints || 0)) / 100).minus(
        nativeTokenPrice.multipliedBy(
          props.fundraisingTarget
        )
      ).dividedBy(10 ** 18).toFixed(2)
      :
      web3Utils.toBN(0)
    if (!price && isNaN(price)) {
      return web3Utils.toBN(0)
    }
    return price
  }
  const calculatePayoutDays = (datestring: string | undefined) => {
    if (!datestring) return 0
    // props.setPaybackDate
    // To set two dates to two variables
    var now = new Date();
    const targetDate = new Date(datestring);
    // To calculate the time difference of two dates
    const Difference_In_Time = targetDate.getTime() - now.getTime();
    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days.toFixed(0)
  }
  const renderTargetReturn = () => {
    const calculateInputWidth = () => {
      const projectedWidth = ((props.basisPoints)?.toString() || "").length * 20;
      const width = projectedWidth > 200 ? 200 : projectedWidth;
      return `${props.basisPoints ? width : 100}px`
    }
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber
      props.setBasisPoints(value)
      const validReturn = validateReturnTarget(value)
      const validPayback = validatePaybackPeriod(props.paybackDate)
      
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
          <$Horizontal justifyContent='space-between' style={{ marginRight: "50px" }}>
            <$StepSubheading>{`Target Return`}</$StepSubheading>
            <$StepSubheading style={{ textAlign: "right"}}>{`USD $${calculateEquivalentUSDPrice()} Original`}</$StepSubheading>
          </$Horizontal>
          <$InputWrapper>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <div style={{ flex: 9, width: 'auto', maxWidth: '200px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <$Input type="number" min="0" value={props.basisPoints} onChange={parseInput} placeholder="10" screen={screen} width={calculateInputWidth()} />
                <$InputTranslationLight>%</$InputTranslationLight>
              </div>
              <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
                <$InputTranslationHeavy>{`+$${calculateEquivalentUSDPriceDiff(props.basisPoints)} Profit`}</$InputTranslationHeavy>
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
      const validReturn = validateReturnTarget(props.basisPoints)
      const validPayback = validatePaybackPeriod(e.target.value || undefined)

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
          <$Horizontal justifyContent='space-between' style={{ marginRight: "50px" }}>
            <$StepSubheading>{`Payout in ${calculatePayoutDays(props.paybackDate)} Days`}</$StepSubheading>
            <$StepSubheading style={{ textAlign: "right"}}>{`$${calculateEquivalentUSDPrice(props.basisPoints)} Total`}</$StepSubheading>
          </$Horizontal>
          <$InputWrapper>
            <$Input value={props.paybackDate} type="date" placeholder="March 16th 2022" screen={'mobile'} fontWeight="200" onChange={parseInput} />
          </$InputWrapper>
        </div>
      </$Horizontal>
    )
  }
	return (
		<$StepChooseReturns>
      {ref && <div ref={ref}></div>}
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
})

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