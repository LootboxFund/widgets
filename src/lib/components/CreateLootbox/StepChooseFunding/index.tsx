import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@lootboxfund/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon } from '../StepChooseNetwork';
import { useWeb3 } from 'lib/hooks/useWeb3Api';
import Web3Utils from 'web3-utils'
import { NetworkOption } from '../state';
import { getPriceFeed } from 'lib/hooks/useContract';
import BN, { BigNumber } from 'bignumber.js';
import { useWeb3Utils } from '../../../hooks/useWeb3Api/index';

interface Errors {
  fundraisingTarget: string;
  receivingWallet: string;
}
export interface StepChooseFundingProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  fundraisingTarget: BigNumber;
  setFundraisingTarget: (amount: BigNumber) => void;
  receivingWallet: string;
  setReceivingWallet: (addr: string) => void;
  setValidity: (bool: boolean) => void;
  ref?: React.RefObject<HTMLDivElement>;
  onNext: () => void;
}
const StepChooseFunding = (props: StepChooseFundingProps) => {
  const web3Utils = useWeb3Utils()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  const { screen } = useWindowSize()
  const initialErrors = {
    fundraisingTarget: '',
    receivingWallet: ''
  }
  const [errors, setErrors] = useState(initialErrors)
  const validateFundraisingTarget = (fundraisingTarget: BigNumber) => {
    return fundraisingTarget.gt(0)
  }
  const validateReceivingWallet = async (receivingWallet: string) => {
    return web3Utils.isAddress(receivingWallet) 
  }

  useEffect(() => {
    getLatestPrice()
  }, [props.selectedNetwork])
  const getLatestPrice = async () => {
    if (props.selectedNetwork?.priceFeed) {
      const nativeTokenPrice = await getPriceFeed(props.selectedNetwork.priceFeed)
      setNativeTokenPrice(nativeTokenPrice)
    }
  }
  const calculateEquivalentUSDPrice = () => {
    return nativeTokenPrice ? nativeTokenPrice.multipliedBy(props.fundraisingTarget).dividedBy(10 ** 18).toFixed(2) : 0
  }

  const renderInputFundraisingTarget = () => {
    const calculateInputWidth = () => {
      const projectedWidth = web3Utils.fromWei(props.fundraisingTarget || "0").toString().length * 20;
      const width = projectedWidth > 200 ? 200 : projectedWidth;
      return `${props.fundraisingTarget ? width : 100}px`
    }
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = web3Utils.toBN(web3Utils.toWei(e.target.value || "0"))
      props.setFundraisingTarget(value)
      const validFundraise = validateFundraisingTarget(value)
      const validReceiver = await validateReceivingWallet(props.receivingWallet)
      if (validFundraise) {
        setErrors({
          ...errors,
          fundraisingTarget: ''
        })
      } else if (validFundraise && validReceiver) {
        props.setValidity(true)
      } else {
        setErrors({
          ...errors,
          fundraisingTarget: 'Cannot have a negative fundraising target'
        })
        props.setValidity(false)
      }
    }
    return (
      <$Vertical>
        {props.ref && <div ref={props.ref}></div>}
        <$StepSubheading>Fundraising Target</$StepSubheading>
        <$InputWrapper>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <div style={{ flex: 9, width: 'auto', maxWidth: '200px', paddingLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              {
                props.selectedNetwork && <$NetworkIcon size="medium" src={props.selectedNetwork.icon} />
              }
              <$Input type="number" value={web3Utils.fromWei(props.fundraisingTarget).toString()} min="0" onChange={parseInput} placeholder="0.01" screen={screen} width={calculateInputWidth()} />
              <$InputTranslationLight>{props.selectedNetwork?.symbol}</$InputTranslationLight>
            </div>
            <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
              <$InputTranslationHeavy>{`$${calculateEquivalentUSDPrice()} USD`}</$InputTranslationHeavy>
            </div>
          </div>
        </$InputWrapper>
      </$Vertical>
    )
  }
  const renderInputReceivingWallet = () => {
    const parseInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setReceivingWallet(e.target.value)
      const validReceiver = await validateReceivingWallet(e.target.value)
      const validFundraiser = validateFundraisingTarget(props.fundraisingTarget)
      if (!validReceiver) {
        setErrors({
          ...errors,
          receivingWallet: `Invalid Receiving Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`
        })
        props.setValidity(false)
      } else if (validFundraiser && validReceiver) {
        props.setValidity(true)
        setErrors({
          ...errors,
          receivingWallet: ''
        })
      } else if (validReceiver) {
        setErrors({
          ...errors,
          receivingWallet: ''
        })
      }
    }
    return (
      <$Vertical>
        <$StepSubheading>Receiving Wallet</$StepSubheading>
        <$InputWrapper>
          <$Input value={props.receivingWallet} placeholder="0xAutodetectYourWallet" screen={'mobile'} fontWeight="200" onChange={parseInput} />
        </$InputWrapper>
      </$Vertical>
    )
  }
	return (
		<$StepChooseFunding>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext} errors={Object.values(errors)}>
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

export default StepChooseFunding;