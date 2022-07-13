import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS } from 'lib/theme'
import $Input from 'lib/components/Generics/Input'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { getPriceFeed } from 'lib/hooks/useContract'
import { BigNumber } from 'bignumber.js'
import { NetworkOption } from 'lib/api/network'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { LootboxType } from '../StepChooseType'
import { InitialUrlParams } from '../state'
import { FormattedMessage } from 'react-intl'

export const validateReturnTarget = (returnTarget: number) => returnTarget && returnTarget > 0
export const validatePaybackPeriod = (payback: string | undefined) => {
  return payback && new Date(payback) > new Date()
}
export interface StepChooseReturnsProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  paybackDate: string | undefined
  setPaybackDate: (date: string) => void
  setPayoutUSDPrice: (payout?: BigNumber) => void
  setValidity: (bool: boolean) => void
  fundraisingTarget: BigNumber
  basisPoints: number
  setBasisPoints: (basisPoints: number) => void
  onNext: () => void
  initialUrlParams?: InitialUrlParams
}
const StepChooseReturns = forwardRef((props: StepChooseReturnsProps, ref: React.RefObject<HTMLDivElement>) => {
  const web3Utils = useWeb3Utils()
  const { screen } = useWindowSize()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  const initialErrors: {
    returnTarget: string | React.ReactElement
    paybackDate: string | React.ReactElement
  } = {
    returnTarget: '',
    paybackDate: '',
  }
  const [errors, setErrors] = useState(initialErrors)

  useEffect(() => {
    props.setPayoutUSDPrice(calculateEquivalentUSDPrice(props.basisPoints))
  }, [props.basisPoints, nativeTokenPrice, props.fundraisingTarget])

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
      ? nativeTokenPrice
          .multipliedBy(props.fundraisingTarget)
          .multipliedBy((100 + (basisPoints ? basisPoints / 100 : 0)) / 100)
          .dividedBy(10 ** 18)
          .toFixed(2)
      : web3Utils.toBN(0)
    if (!price && isNaN(price)) {
      return web3Utils.toBN(0)
    }
    return price
  }
  const calculateEquivalentUSDPriceDiff = (basisPoints: number): BigNumber => {
    const price = nativeTokenPrice
      ? nativeTokenPrice
          .multipliedBy(props.fundraisingTarget)
          .multipliedBy((100 + (basisPoints ? basisPoints / 100 : 0)) / 100)
          .minus(nativeTokenPrice.multipliedBy(props.fundraisingTarget))
          .dividedBy(10 ** 18)
          .toFixed(2)
      : web3Utils.toBN(0)
    if (!price && isNaN(price)) {
      return web3Utils.toBN(0)
    }
    return price
  }
  const calculatePayoutDays = (datestring: string | undefined) => {
    if (!datestring) return 0
    // props.setPaybackDate
    // To set two dates to two variables
    var now = new Date()
    const targetDate = new Date(datestring)
    // To calculate the time difference of two dates
    const Difference_In_Time = targetDate.getTime() - now.getTime()
    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
    return Difference_In_Days.toFixed(0)
  }
  const renderTargetReturn = () => {
    const calculateInputWidth = () => {
      const projectedWidth = (props.basisPoints?.toString() || '').length * 20
      const width = projectedWidth > 200 ? 200 : projectedWidth
      return `${props.basisPoints ? width : 100}px`
    }
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber
      const basisPoints = Math.round(value * 100)
      props.setBasisPoints(basisPoints)
      const validReturn = validateReturnTarget(basisPoints)
      const validPayback = validatePaybackPeriod(props.paybackDate)

      if (validReturn) {
        setErrors({
          ...errors,
          returnTarget: '',
        })
      } else if (validReturn && validPayback) {
        props.setValidity(true)
      } else {
        setErrors({
          ...errors,
          returnTarget: (
            <FormattedMessage
              id="createLootbox.stepChooseReturns.returnTargetError"
              defaultMessage="Target return must be greater than zero"
              description="Error message when target return is less than zero"
            />
          ),
        })
        props.setValidity(false)
      }
    }
    return (
      <$Horizontal alignItems="flex-end">
        <$BigIcon>🌓</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$Horizontal justifyContent="space-between" style={{ marginRight: screen === 'mobile' ? '0px' : '50px' }}>
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.stepChooseReturns.returnTarget.title"
                defaultMessage="Target Return"
                description="Title for target return step in Create lootbox"
              />
              <HelpIcon tipID="targetReturn" />
              <ReactTooltip id="targetReturn" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.stepChooseReturns.returnTarget.tooltip"
                  defaultMessage="This target is shown to investors but is not a guranteed return. You decide how much this is, based on your knowlege of the oppourtunity you are pursuing. A 10% target return on 10 ETH investment means you intend to reward investors 11 ETH. Typically your obligation to reward investors ends when you hit your target return."
                  description="Tooltip for users when they are selecting a return target for their Lootbox"
                />
              </ReactTooltip>
            </$StepSubheading>
            <$StepSubheading
              style={{ textAlign: 'right', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
            >
              <FormattedMessage
                id="createLootbox.stepChooseReturns.returnTarget.usdEquivalent"
                defaultMessage="USD ${usdPrice} Original"
                values={{ usdPrice: calculateEquivalentUSDPrice()?.toString() }}
                description="This shows the user how much USD value they want to raise from their Lootbox. Original means that they originally want to raise x amount. It is used in contrast with the amount of money they will owe to investors. "
              />
            </$StepSubheading>
          </$Horizontal>
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
                <$Input
                  type="number"
                  min="0"
                  value={Math.round(props.basisPoints) / 100}
                  onChange={parseInput}
                  placeholder="10"
                  screen={screen}
                  width={calculateInputWidth()}
                  onWheel={(e) => e.currentTarget.blur()}
                  disabled={!!props.initialUrlParams?.returnsTarget}
                />
                <$InputTranslationLight>%</$InputTranslationLight>
              </div>
              <div
                style={{
                  flex: 3,
                  textAlign: 'right',
                  paddingRight: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <$InputTranslationHeavy>
                  <FormattedMessage
                    id="createLootbox.stepChooseReturns.returnTarget.investorProfit"
                    defaultMessage="+${investorProfit} Profit"
                    description="This is the amount of money the user will need to accumulate to pay back investors in USD profit."
                    values={{
                      investorProfit: calculateEquivalentUSDPriceDiff(props.basisPoints)?.toString(),
                    }}
                  />
                </$InputTranslationHeavy>
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
          returnTarget: '',
        })
        props.setValidity(true)
      } else if (validPayback) {
        setErrors({
          ...errors,
          paybackDate: '',
        })
      } else if (!validPayback) {
        setErrors({
          ...errors,
          paybackDate: (
            <FormattedMessage
              id="createLootbox.stepChooseReturns.paybackDateError"
              defaultMessage="Target payback date must be in the future"
              description="Error message when target payback date is in the past"
            />
          ),
        })
        props.setValidity(false)
      }
    }
    return (
      <$Horizontal alignItems="flex-end">
        <$BigIcon>⏳</$BigIcon>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <$Horizontal justifyContent="space-between" style={{ marginRight: screen === 'mobile' ? '0px' : '50px' }}>
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.stepChooseReturns.paybackPeriod.title"
                defaultMessage="Payout in {payoutDays} Days"
                description="Title for payback period step in Create lootbox"
                values={{ payoutDays: calculatePayoutDays(props.paybackDate) }}
              />
              <HelpIcon tipID="payoutDate" />
              <ReactTooltip id="payoutDate" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.stepChooseReturns.paybackPeriod.tooltip"
                  defaultMessage="This is shown to investors as an end date they should expect to receive their profits. You can reward investors any time, this payout date is just an estimate. Be honest and realistic with your estimate."
                  description="Tooltip for users when they are selecting a payback period for their Lootbox"
                />
              </ReactTooltip>
            </$StepSubheading>
            <$StepSubheading
              style={{ textAlign: 'right', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
            >
              <FormattedMessage
                id="createLootbox.stepChooseReturns.paybackPeriod.totalValue"
                defaultMessage="${usdPrice} Total"
                values={{ usdPrice: calculateEquivalentUSDPrice(props.basisPoints)?.toString() }}
                description="This shows the user how much total value they must raise in USD."
              />
            </$StepSubheading>
          </$Horizontal>
          <$InputWrapper screen={screen}>
            <$Input
              value={props.paybackDate}
              type="date"
              placeholder="March 16th 2022"
              screen={'mobile'}
              fontWeight="200"
              onChange={parseInput}
              disabled={!!props.initialUrlParams?.returnsDate}
            />
          </$InputWrapper>
        </div>
      </$Horizontal>
    )
  }
  return (
    <$StepChooseReturns style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={props.onNext}
        errors={Object.values(errors)}
      >
        <$Horizontal flex={1}>
          <$Vertical flex={3}>
            <$StepHeading>
              <FormattedMessage
                id="createLootbox.stepChooseReturns.title"
                defaultMessage="4. How will your reward your investors?"
                description="Title for the step in CreateLootbox where the user can determine how much they will reward their investors"
              />
              <HelpIcon tipID="stepReturns" />
              <ReactTooltip id="stepReturns" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.stepChooseReturns.tooltip"
                  defaultMessage="Treat your investors like your fans. The more you reward them, the more they will trust and support you."
                  description="Tooltip for users when they are selecting a payback period for their Lootbox"
                />
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.stepChooseReturns.subtitle"
                defaultMessage="Lootbox is not a loan. You decide when and how much you want to reward your investors. Good performance improves your on-chain reputation, helping you fundraise more in the future."
                description="Subtitle for the step in CreateLootbox where the user can determine how much they will reward their investors"
              />
            </$StepSubheading>
            <br />
            <br />
            {renderTargetReturn()}
            <br />
            {renderTargetPayback()}
          </$Vertical>
          {screen !== 'mobile' && (
            <$Vertical flex={1}>
              <img
                style={{ width: '150px', marginTop: '50px' }}
                src={
                  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FReturnScales.png?alt=media'
                }
              />
            </$Vertical>
          )}
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

const $InputWrapper = styled.div<{ screen: ScreenSize }>`
  background-color: #f1f1f1;
  display: flex;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
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

export default StepChooseReturns
