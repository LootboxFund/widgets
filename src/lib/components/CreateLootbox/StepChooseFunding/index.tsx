import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { InputDecimal, $Input } from 'lib/components/Generics/Input'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { $NetworkIcon } from '../StepChooseNetwork'
import { NetworkOption } from 'lib/api/network'
import { getPriceFeed } from 'lib/hooks/useContract'
import { BigNumber } from 'bignumber.js'
import { useWeb3Utils } from '../../../hooks/useWeb3Api/index'
import { Address } from '@wormgraph/helpers'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { ethers as ethersObj } from 'ethers'
import { defaultFundraisingLimitMultiplier, defaultFundraisingLimitMultiplierDecimal } from '../index'

export const validateFundraisingTarget = (fundraisingTarget: BigNumber) => {
  const web3Utils = useWeb3Utils()
  return fundraisingTarget.gt(web3Utils.toBN(0))
}
export const validateReceivingWallet = (receivingWallet: string) => {
  const ethers = window.ethers ? window.ethers : ethersObj
  return ethers.utils.isAddress(receivingWallet)
}
export interface StepChooseFundingProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  type: 'escrow' | 'instant' | 'tournament'
  fundraisingTarget: BigNumber
  fundraisingLimit: BigNumber
  setFundraisingLimit: (limit: BigNumber) => void
  setFundraisingTarget: (amount: BigNumber) => void
  receivingWallet: Address
  setReceivingWallet: (addr: Address) => void
  setValidity: (bool: boolean) => void
  onNext: () => void
}
const StepChooseFunding = forwardRef((props: StepChooseFundingProps, ref: React.RefObject<HTMLDivElement>) => {
  const web3Utils = useWeb3Utils()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  const { screen } = useWindowSize()
  const initialErrors = {
    fundraisingTarget: '',
    fundraisingLimit: '',
    receivingWallet: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  const [showMaxInput, setShowMaxInput] = useState(false)

  useEffect(() => {
    getLatestPrice()
  }, [props.selectedNetwork])
  const getLatestPrice = async () => {
    if (props.selectedNetwork?.priceFeed) {
      const nativeTokenPrice = await getPriceFeed(props.selectedNetwork.priceFeed)
      setNativeTokenPrice(nativeTokenPrice)
    }
  }
  const calculateEquivalentUSDPrice = (amount: BigNumber) => {
    return nativeTokenPrice
      ? nativeTokenPrice
          .multipliedBy(amount)
          .dividedBy(10 ** 18)
          .toFixed(2)
      : 0
  }

  const renderInputFundraisingTarget = () => {
    const calculateInputWidth = (amount: BigNumber) => {
      const projectedWidth = web3Utils.fromWei(amount || '0').toString().length * 20
      const width = projectedWidth > 200 ? 200 : projectedWidth
      return `${amount ? width : 100}px`
    }
    const onFundraisingTargetChange = (value: string | undefined) => {
      const valueBN = web3Utils.toBN(web3Utils.toWei(value || '0'))
      props.setFundraisingTarget(valueBN)
      if (!showMaxInput) {
        // Update target limit as well
        const valueBNLimit = valueBN
          .mul(web3Utils.toBN(defaultFundraisingLimitMultiplier))
          .div(web3Utils.toBN(defaultFundraisingLimitMultiplierDecimal))
        props.setFundraisingLimit(valueBNLimit)
      }
      const validFundraise = validateFundraisingTarget(valueBN)
      const validReceiver = validateReceivingWallet(props.receivingWallet)
      if (validFundraise) {
        setErrors({
          ...errors,
          fundraisingTarget: '',
        })
      } else if (validFundraise && validReceiver) {
        props.setValidity(true)
      } else {
        setErrors({
          ...errors,
          fundraisingTarget: 'Fundraising target must be greater than zero',
        })
        props.setValidity(false)
      }
    }
    return (
      <$Vertical>
        {ref && <div ref={ref}></div>}
        <$StepSubheading>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <div>
              Target Fundraising Amount
              <HelpIcon tipID="fundraisingTarget" />
              <ReactTooltip id="fundraisingTarget" place="right" effect="solid">
                We recommend you set a fundraising target slightly higher than what you need in case of fluctuations in
                the value of the native token. You will receive the money right away, regardless of whether you hit your
                fundraising target. The maximum amount of money your Lootbox will be able to raise is 1.1x your
                fundraising target.
              </ReactTooltip>
            </div>
            <span
              onClick={() => setShowMaxInput(!showMaxInput)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {showMaxInput ? `Hide` : `Show`} Max Limit
            </span>
          </div>
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
              {props.selectedNetwork && <$NetworkIcon size="medium" src={props.selectedNetwork.icon} />}
              <InputDecimal
                initialValue={web3Utils.fromWei(props.fundraisingTarget, 'ether').toString()}
                onChange={onFundraisingTargetChange}
                width={calculateInputWidth(props.fundraisingTarget)}
              />
              <$InputTranslationLight>{props.selectedNetwork?.symbol}</$InputTranslationLight>
            </div>
            <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
              <$InputTranslationHeavy>{`$${calculateEquivalentUSDPrice(
                props.fundraisingTarget
              )} USD`}</$InputTranslationHeavy>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }
  const renderInputFundraisingLimit = () => {
    const calculateInputWidth = (amount: BigNumber) => {
      const projectedWidth = web3Utils.fromWei(amount || '0').toString().length * 20
      const width = projectedWidth > 200 ? 200 : projectedWidth
      return `${amount ? width : 100}px`
    }
    const onFundraisingLimitChange = (value: string | undefined) => {
      const valueBN = web3Utils.toBN(web3Utils.toWei(value || '0'))
      props.setFundraisingLimit(valueBN)
      const validFundraise = validateFundraisingTarget(valueBN)
      const validReceiver = validateReceivingWallet(props.receivingWallet)
      if (validFundraise) {
        setErrors({
          ...errors,
          fundraisingLimit: '',
        })
      } else if (validFundraise && validReceiver) {
        props.setValidity(true)
      } else {
        setErrors({
          ...errors,
          fundraisingLimit: 'Fundraising limit must be greater than zero',
        })
        props.setValidity(false)
      }
    }

    return (
      <$Vertical>
        {ref && <div ref={ref}></div>}
        <$StepSubheading>
          Max Fundraising Limit
          <HelpIcon tipID="fundraisingLimit" />
          <ReactTooltip id="fundraisingLimit" place="right" effect="solid">
            We recommend you set a fundraising target slightly higher than what you need in case of fluctuations in the
            value of the native token. You will receive the money right away, regardless of whether you hit your
            fundraising target. The maximum amount of money your Lootbox will be able to raise is 1.1x your fundraising
            target.
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
              {props.selectedNetwork && <$NetworkIcon size="medium" src={props.selectedNetwork.icon} />}
              <InputDecimal
                initialValue={web3Utils.fromWei(props.fundraisingLimit, 'ether').toString()}
                onChange={onFundraisingLimitChange}
                width={calculateInputWidth(props.fundraisingTarget)}
              />
              <$InputTranslationLight>{props.selectedNetwork?.symbol}</$InputTranslationLight>
            </div>
            <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
              <$InputTranslationHeavy>{`$${calculateEquivalentUSDPrice(
                props.fundraisingLimit
              )} USD`}</$InputTranslationHeavy>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }
  const renderInputReceivingWallet = () => {
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setReceivingWallet(e.target.value as Address)
      const validReceiver = validateReceivingWallet(e.target.value)
      const validFundraiser = validateFundraisingTarget(props.fundraisingTarget)
      if (!validReceiver) {
        setErrors({
          ...errors,
          receivingWallet: `Invalid Receiving Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`,
        })
        props.setValidity(false)
      } else if (validFundraiser && validReceiver) {
        props.setValidity(true)
        setErrors({
          ...errors,
          receivingWallet: '',
        })
      } else if (validReceiver) {
        setErrors({
          ...errors,
          receivingWallet: '',
        })
      }
    }
    return (
      <$Vertical>
        <$StepSubheading>
          {props.type === 'tournament' ? `Tournament Wallet` : `Receiving Wallet`}
          <HelpIcon tipID="receivingWallet" />
          <ReactTooltip id="receivingWallet" place="right" effect="solid">
            This address will receive the money right away. We highly recommend you use a MultiSig wallet if you are a
            team. Our YouTube channel has tutorials on how to set up a MultiSig.
          </ReactTooltip>
        </$StepSubheading>
        <$InputWrapper screen={screen}>
          <$Input
            value={props.receivingWallet}
            screen={'mobile'}
            fontWeight="200"
            onChange={parseInput}
            placeholder="Funds will arrive here"
          />
        </$InputWrapper>
      </$Vertical>
    )
  }
  return (
    <$StepChooseFunding style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={props.onNext}
        errors={Object.values(errors)}
      >
        <$Horizontal flex={1}>
          <$Vertical flex={3}>
            <$StepHeading>
              3. How much money do you need?
              <HelpIcon tipID="stepFunding" />
              <ReactTooltip id="stepFunding" place="right" effect="solid">
                We cannot guarantee you will be able to fundraise your target amount. Maximize your chances by watching
                videos on our YouTube channel teaching best practices on how to fundraise.
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              We recommend you start with a small amount that is easy to deliver a profit on. You can make unlimited
              Lootboxes for anything you want.
            </$StepSubheading>
            <br />
            <br />
            {renderInputFundraisingTarget()}
            {showMaxInput && (
              <>
                <br />
                {renderInputFundraisingLimit()}
              </>
            )}

            <br />
            {renderInputReceivingWallet()}
          </$Vertical>
          {screen !== 'mobile' && (
            <$Vertical flex={1}>
              <img
                style={{ width: '150px', marginTop: '50px' }}
                src={
                  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FFundingScales.png?alt=media'
                }
              />
            </$Vertical>
          )}
        </$Horizontal>
      </StepCard>
    </$StepChooseFunding>
  )
})

export const $InputWrapper = styled.div<{ screen: ScreenSize }>`
  background-color: #f1f1f1;
  display: flex;
  padding: 5px 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-right: ${(props) => (props.screen === 'desktop' ? '50px' : '0px')};
`

const $StepChooseFunding = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

export const $InputTranslationLight = styled.span`
  font-weight: 200;
  color: ${COLORS.surpressedFontColor};
`

export const $InputTranslationHeavy = styled.span`
  font-weight: 600;
  color: ${COLORS.surpressedFontColor};
`

export default StepChooseFunding
