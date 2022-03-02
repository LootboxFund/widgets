import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS } from 'lib/theme'
import useWindowSize from 'lib/hooks/useScreenSize'
import { TicketCardCandyWrapper } from 'lib/components/TicketCard/TicketCard'
import { NetworkOption } from '../state'
import { BigNumber } from 'bignumber.js'
import { getPriceFeed } from 'lib/hooks/useContract'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { checkIfValidUrl } from 'lib/api/helpers'

export const getMaxTicketPrice = (
  nativeTokenPrice: BigNumber,
  fundraisingTarget: BigNumber,
  web3Utils: any
): number => {
  const price = nativeTokenPrice
    ? nativeTokenPrice
        .multipliedBy(fundraisingTarget)
        .dividedBy(10 ** 18)
        .toFixed(2)
    : web3Utils.toBN(0)
  if (!price && isNaN(price)) {
    return 0
  }
  return price
}

export const validateName = (name: string) => name.length > 0
export const validateSymbol = (symbol: string) => symbol.length > 0
export const validateBiography = (bio: string) => bio.length > 12
export const validatePricePerShare = (price: number, maxPricePerShare: number) => price > 0 && price <= maxPricePerShare
export const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
export const validateLogo = (url: string) => url && checkIfValidUrl(url)
export const validateCover = (url: string) => url && checkIfValidUrl(url)
export interface StepCustomizeProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  onNext: () => void
  fundraisingTarget: BigNumber
  ticketState: Record<string, string | number>
  updateTicketState: (slug: string, value: string | number) => void
  setValidity: (bool: boolean) => void
}
const StepCustomize = forwardRef((props: StepCustomizeProps, ref: React.RefObject<HTMLDivElement>) => {
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
  const maxPricePerShare = nativeTokenPrice
    ? getMaxTicketPrice(nativeTokenPrice, props.fundraisingTarget, web3Utils)
    : 0
  const initialErrors = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: '',
    lootboxThemeColor: '',
    logoUrl: '',
    coverUrl: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  const checkAllTicketCustomizationValidations = () => {
    let valid = true
    if (!validateName(props.ticketState.name as string)) valid = false
    if (!validateSymbol(props.ticketState.symbol as string)) valid = false
    if (!validateBiography(props.ticketState.biography as string)) valid = false
    if (!validatePricePerShare(props.ticketState.pricePerShare as number, maxPricePerShare)) valid = false
    if (!validateThemeColor(props.ticketState.lootboxThemeColor as string)) valid = false
    if (!validateLogo(props.ticketState.logoUrl as string)) valid = false
    if (!validateCover(props.ticketState.coverUrl as string)) valid = false
    if (valid) {
      setErrors({
        ...errors,
        name: '',
        symbol: '',
        biography: '',
        pricePerShare: '',
        lootboxThemeColor: '',
      })
      props.setValidity(true)
    } else {
      props.setValidity(false)
    }
    return valid
  }
  useEffect(() => {
    checkAllTicketCustomizationValidations()
  }, [props.ticketState])
  const parseInput = (slug: string, text: string | number) => {
    const value = slug === 'symbol' ? (text as string).toUpperCase().replace(' ', '') : text
    props.updateTicketState(slug, value)
    if (slug === 'name') {
      setErrors({
        ...errors,
        name: validateName(value as string) ? '' : 'Name cannot be empty',
      })
    }
    if (slug === 'symbol') {
      setErrors({
        ...errors,
        symbol: validateSymbol(value as string) ? '' : 'Symbol cannot be empty',
      })
    }
    if (slug === 'biography') {
      setErrors({
        ...errors,
        biography: validateBiography(value as string) ? '' : 'Biography must be at least 12 characters',
      })
    }
    if (slug === 'pricePerShare') {
      setErrors({
        ...errors,
        pricePerShare: validatePricePerShare(value as number, maxPricePerShare)
          ? ''
          : `Price per share must be greater than zero and less than $${maxPricePerShare}`,
      })
    }
    if (slug === 'lootboxThemeColor') {
      setErrors({
        ...errors,
        lootboxThemeColor: validateThemeColor(value as string) ? '' : 'Theme color must be a valid hex color',
      })
    }
    if (slug === 'logoUrl') {
      setErrors({
        ...errors,
        logoUrl: validateLogo(value as string) ? '' : 'Logo must be a valid URL',
      })
    }
    if (slug === 'coverUrl') {
      setErrors({
        ...errors,
        coverUrl: validateCover(value as string) ? '' : 'Cover image must be a valid URL',
      })
    }
  }

  return (
    <$StepCustomize style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={props.onNext}
        errors={Object.values(errors)}
      >
        <$Horizontal flex={1}>
          <$Vertical flex={1}>
            <$StepHeading>
              <span>4. Customize NFT Ticket</span>
              <HelpIcon tipID="stepCustomize" />
              <ReactTooltip id="stepCustomize" place="right" effect="solid">
                Finally, an NFT that's actually useful 😂
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              Your Lootbox fundraises money by selling NFT tickets to investors, who enjoy profit sharing when you
              deposit earnings back into the Lootbox.
            </$StepSubheading>
            <br />
            <br />
            <$StepSubheading>
              <span>Lootbox Name</span>
              <HelpIcon tipID="lootboxName" />
              <ReactTooltip id="lootboxName" place="right" effect="solid">
                The name of your Lootbox. It can be your name, your mission, or just something catchy. Keep in mind that
                you will likely have multiple Lootboxes in the future, so try to have a uniquely identifyable name to
                reduce confusion.
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              maxLength={30}
              onChange={(e) => parseInput('name', e.target.value)}
              value={props.ticketState.name}
            />
            <br />
            <$StepSubheading>
              <span>Ticket Symbol</span>
              <HelpIcon tipID="ticketSymbol" />
              <ReactTooltip id="ticketSymbol" place="right" effect="solid">
                Set a shortname for your NFT Tickets to be displayed in Metamask. Max 9 characters.
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              onChange={(e) => parseInput('symbol', e.target.value)}
              value={props.ticketState.symbol}
              maxLength={9}
            />
            <br />
            <$StepSubheading>
              <span>Biography</span>
              <HelpIcon tipID="ticketBiography" />
              <ReactTooltip id="ticketBiography" place="right" effect="solid">
                Write a 3-5 sentence introduction of yourself and what you plan to use the investment money for.
              </ReactTooltip>
            </$StepSubheading>
            <$TextAreaMedium
              onChange={(e) => parseInput('biography', e.target.value)}
              value={props.ticketState.biography}
              rows={6}
              maxLength={500}
            />
            <br />
            <$Horizontal verticalCenter>
              <$Vertical>
                <$StepSubheading>
                  <span>Share Price</span>
                  <HelpIcon tipID="pricePerShare" />
                  <ReactTooltip id="pricePerShare" place="right" effect="solid">
                    We recommend leaving this at the default value. When investors buy NFT tickets from your Lootbox,
                    they specify many shares they want. The more shares owned in a ticket, the higher the % of Lootbox
                    earnings they receive. It is possible to buy fractional shares. The only reason you may want to
                    customize your share price is for psychological pricing.
                  </ReactTooltip>
                </$StepSubheading>
                <$Horizontal verticalCenter flex={1}>
                  <$CurrencySign>$</$CurrencySign>
                  <$InputMedium
                    type="number"
                    min="0"
                    onChange={(e) => parseInput('pricePerShare', e.target.valueAsNumber)}
                    value={props.ticketState.pricePerShare}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ width: '100px' }}
                  />
                </$Horizontal>
              </$Vertical>
              <$Vertical>
                <$StepSubheading>
                  <span>Theme Color</span>
                  <HelpIcon tipID="themeColor" />
                  <ReactTooltip id="themeColor" place="right" effect="solid">
                    Your Lootbox theme color is only used for visual effects. Use the default color if you don't want to
                    customize it.
                  </ReactTooltip>
                </$StepSubheading>
                <$Horizontal verticalCenter flex={1}>
                  <$InputColor
                    value={props.ticketState.lootboxThemeColor}
                    onChange={(e) => parseInput('lootboxThemeColor', e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <$ColorPreview
                    color={props.ticketState.lootboxThemeColor as string}
                    onClick={() => window.open('https://htmlcolorcodes.com/color-picker/', '_blank')}
                  />
                </$Horizontal>
              </$Vertical>
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
            <$Horizontal verticalCenter></$Horizontal>
            <$Vertical>
              <$StepSubheading>
                Logo Image
                <HelpIcon tipID="logoImage" />
                <ReactTooltip id="logoImage" place="right" effect="solid">
                  Upload your logo image to Imgur or Pinata and paste the URL here. We recommend Pinata.cloud if you
                  want to use Web3 IPFS, or Imgur for simplicity (be careful to copy image address url, not the page
                  url). Please do not use massive images as it will slow down your Lootbox page load.
                </ReactTooltip>
              </$StepSubheading>
              <$InputMedium
                onChange={(e) => parseInput('logoUrl', e.target.value)}
                value={props.ticketState.logoUrl}
                style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}
              />
            </$Vertical>
            <$Vertical>
              <$StepSubheading>
                <span>Cover Image</span>
                <HelpIcon tipID="coverImage" />
                <ReactTooltip id="coverImage" place="right" effect="solid">
                  Upload your logo image to Imgur or Pinata and paste the URL here. We recommend Pinata.cloud if you
                  want to use Web3 IPFS, or Imgur for simplicity (be careful to copy image address url, not the page
                  url). Please do not use massive images as it will slow down your Lootbox page load.
                </ReactTooltip>
              </$StepSubheading>
              <$InputMedium
                onChange={(e) => parseInput('coverUrl', e.target.value)}
                value={props.ticketState.coverUrl}
                style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}
              />
            </$Vertical>
          </$Vertical>
        </$Horizontal>
      </StepCard>
    </$StepCustomize>
  )
})

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

export default StepCustomize
