import react, { useEffect, useState } from 'react'
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
import { TicketCardCandyWrapper } from 'lib/components/TicketCard/TicketCard';
import { NetworkOption } from '../state';
import { BigNumber } from 'bignumber.js';
import { getPriceFeed } from 'lib/hooks/useContract';
import { useWeb3Utils } from 'lib/hooks/useWeb3Api';

export interface StepCustomizeProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  onNext: () => void;
  fundraisingTarget: BigNumber;
  ticketState: Record<string, string | number>;
  updateTicketState: (slug: string, value: string | number) => void;
  setValidity: (bool: boolean) => void;
}
const StepCustomize = (props: StepCustomizeProps) => {
  const { screen } = useWindowSize()
  const web3Utils = useWeb3Utils()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  useEffect(() => {
    getLatestPrice()
  }, [props.selectedNetwork])
  const getLatestPrice = async () => {
    if (props.selectedNetwork?.priceFeed) {
      const nativeTokenPrice = await getPriceFeed(props.selectedNetwork.priceFeed)
      setNativeTokenPrice(nativeTokenPrice)
    }
  }
  const deriveMaxTicketPrice = (): number => {
    const price = nativeTokenPrice
      ?
      nativeTokenPrice.multipliedBy(
        props.fundraisingTarget
      ).dividedBy(10 ** 18).toFixed(2)
      :
      web3Utils.toBN(0)
    if (!price && isNaN(price)) {
      return 0
    }
    return price
  }
  const maxPricePerShare = deriveMaxTicketPrice()
  console.log(`maxPricePerShare = ${maxPricePerShare}`)
  const initialErrors = {
    name: "",
    symbol: '',
    biography: '',
    pricePerShare: "",
    lootboxThemeColor: "",
    logoUrl: "",
    coverUrl: ""
  }
  const [errors, setErrors] = useState(initialErrors)
  const validateName = (name: string) => name.length > 0
  const validateSymbol = (symbol: string) => symbol.length > 0
  const validateBiography = (bio: string) => bio.length > 12
  const validatePricePerShare = (price: number) => price > 0 && price <= maxPricePerShare
  const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
  const checkAllValidations = () => {
    let valid = true;
    if (!validateName(props.ticketState.name as string)) valid = false;
    if (!validateSymbol(props.ticketState.symbol as string)) valid = false;
    if (!validateBiography(props.ticketState.biography as string)) valid = false;
    if (!validatePricePerShare(props.ticketState.pricePerShare as number)) valid = false;
    if (!validateThemeColor(props.ticketState.lootboxThemeColor as string)) valid = false;
    if (valid) {
      setErrors({
        ...errors,
        name: "",
        symbol: '',
        biography: '',
        pricePerShare: "",
        lootboxThemeColor: "",
      })
      props.setValidity(true)
    } else {
      props.setValidity(false)
    }
    return valid
  }
  useEffect(() => {
    checkAllValidations()
  }, [props.ticketState])
  const parseInput = (slug: string, value: string | number) => {
    props.updateTicketState(slug, value)
    if (slug === 'name') {
      setErrors({
        ...errors,
        name: validateName(value as string) ? "" : 'Name cannot be empty'
      })
    }
    if (slug === "symbol") {
      setErrors({
        ...errors,
        symbol: validateSymbol(value as string) ? '' : 'Symbol cannot be empty'
      })
    }
    if (slug === "biography") {
      setErrors({
        ...errors,
        biography: validateBiography(value as string) ? '' : 'Biography must be at least 12 characters'
      })
    }
    if (slug === "pricePerShare") {
      setErrors({
        ...errors,
        pricePerShare: validatePricePerShare(value as number) ? '' : `Price per share must be greater than zero and less than $${maxPricePerShare}`
      })
    }
    if (slug === "lootboxThemeColor") {
      setErrors({
        ...errors,
        lootboxThemeColor: validateThemeColor(value as string) ? '' : 'Theme color must be a valid hex color'
      })
    }
  }
  
	return (
		<$StepCustomize>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext} errors={Object.values(errors)}>
        <$Horizontal flex={1}>
          <$Vertical flex={1}>
            <$StepHeading>4. Customize Ticket</$StepHeading>
            <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
            <br /><br />
            <$StepSubheading>Lootbox Name</$StepSubheading>
            <$InputMedium maxLength={25} onChange={(e) => parseInput('name', e.target.value)} value={props.ticketState.name} /><br />
            <$StepSubheading>Ticket Symbol</$StepSubheading>
            <$InputMedium onChange={(e) => parseInput('symbol', e.target.value)} value={props.ticketState.symbol} /><br />
            <$StepSubheading>Biography</$StepSubheading>
            <$TextAreaMedium onChange={(e) => parseInput('biography', e.target.value)} value={props.ticketState.biography} rows={5} /><br />
            <$StepSubheading>Price per Share</$StepSubheading>
            <$Horizontal verticalCenter>
              <$CurrencySign>$</$CurrencySign>
              <$InputMedium type="number" min="0" onChange={(e) => parseInput('pricePerShare', e.target.valueAsNumber)} value={props.ticketState.pricePerShare} />
            </$Horizontal>
            <br />
          </$Vertical>
          <$Vertical flex={1}>
            <TicketCardCandyWrapper
              backgroundImage={props.ticketState.coverUrl as string}
              logoImage={props.ticketState.logoUrl as string}
              themeColor={props.ticketState.lootboxThemeColor as string}
              name={props.ticketState.name as string}
            />
            <br />
            <$Horizontal verticalCenter>
              <$Horizontal verticalCenter>
                <$ColorPreview color={props.ticketState.lootboxThemeColor as string} onClick={() => window.open("https://imagecolorpicker.com/", "_blank")} />
                <$InputColor value={props.ticketState.lootboxThemeColor} onChange={(e) => parseInput("lootboxThemeColor", e.target.value)} /><br />
              </$Horizontal>
              <$UploadFileButton>Upload Logo</$UploadFileButton>
              <$UploadFileButton>Upload Cover</$UploadFileButton>
            </$Horizontal>
          </$Vertical>
        </$Horizontal>
      </StepCard>
		</$StepCustomize>
	)
}

const $StepCustomize = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

const $CurrencySign = styled.span`
  font-size: 1.8rem;
  color: ${COLORS.surpressedBackground};
  line-height: 2rem;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 1.5rem;
  margin-right: 20px;
  height: 40px;
`
export const $TextAreaMedium = styled.textarea`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 20px 20px;
  font-size: 1rem;
  margin-right: 20px;
`

export const $InputColor = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px;
  font-size: 1rem;
  margin: 0px 5px;
  height: 40px;
  flex: 1;
  text-align: center;
`

export const $UploadFileButton = styled.button`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px;
  font-size: 1rem;
  height: 40px;
  flex: 1;
  margin: 5px;
`

export const $ColorPreview = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props: { color: string }) => props.color};
`

export default StepCustomize;