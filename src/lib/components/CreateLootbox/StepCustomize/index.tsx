import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import ColorPicker from 'simple-color-picker'
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
export const validateBiography = (bio: string) => bio.length >= 12
export const validatePricePerShare = (price: number, maxPricePerShare: number) => price > 0 && price <= maxPricePerShare
export const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
export const validateLogo = (url: string) => url && checkIfValidUrl(url)
export const validateCover = (url: string) => url && checkIfValidUrl(url)
export const validateLogoFile = (file: File) => !!file
export const validateCoverFile = (file: File) => !!file
export interface StepCustomizeProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  onNext: () => void
  fundraisingTarget: BigNumber
  ticketState: Record<string, string | number> & { logoFile?: File; coverFile?: File }
  updateTicketState: (slug: string, value: string | number | File) => void
  setValidity: (bool: boolean) => void
}
const StepCustomize = forwardRef((props: StepCustomizeProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const web3Utils = useWeb3Utils()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  const [themeColor, setThemeColor] = useState('')

  useEffect(() => {
    const colorPickerElement = document.getElementById('color-picker')
    const picker = new ColorPicker({ el: colorPickerElement || undefined, color: props.ticketState.lootboxThemeColor })
    picker.onChange((color: string) => {
      setThemeColor(color)
    })
  }, [])

  useEffect(() => {
    if (themeColor !== props.ticketState.lootboxThemeColor) {
      props.updateTicketState('lootboxThemeColor', themeColor)
    }
  }, [themeColor, props])

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
    logoFile: '',
    coverFile: '',
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
      if (!validateLogoFile(props.ticketState.logoFile as File)) {
        valid = false
        setErrors({ ...errors, logoFile: 'Please upload a logo image' })
      }
      if (!validateCoverFile(props.ticketState.coverFile as File)) {
        valid = false
        setErrors({
          ...errors,
          coverFile: 'Please upload a cover photo',
        })
      }
    }

    if (valid) {
      setErrors({
        ...errors,
        name: '',
        symbol: '',
        biography: '',
        pricePerShare: '',
        lootboxThemeColor: '',
        logoFile: '',
        coverFile: '',
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

  const onImageInputChange = (inputElementId: 'logo-uploader' | 'cover-uploader', slug: 'logoFile' | 'coverFile') => {
    // @ts-ignore
    const selectedFiles = document.getElementById(inputElementId)?.files
    if (selectedFiles?.length) {
      const file = selectedFiles[0]

      props.updateTicketState(slug, file)

      // Display the image in the UI
      // This updates the TicketCardCandyWrapper's logo and background
      let elementId: string
      if (slug === 'logoFile') {
        elementId = 'ticket-candy-logo'
      } else {
        elementId = 'ticket-candy-container'
      }
      const el = document.getElementById(elementId)

      if (!el) {
        console.error('Could not find element "ticket-candy-logo"')
        return
      }

      var url = URL.createObjectURL(file)

      el.style.backgroundImage = 'url(' + url + ')'

      return
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
        <div
          style={
            isMobile
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  paddingBottom: '20px',
                  flex: 1,
                  width: '100%',
                }
              : {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }
          }
        >
          <$Vertical flex={isMobile ? 1 : 0.55}>
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
            <$StepSubheading>
              <span>Share Price</span>
              <HelpIcon tipID="pricePerShare" />
              <ReactTooltip id="pricePerShare" place="right" effect="solid">
                We recommend leaving this at the default value. When investors buy NFT tickets from your Lootbox, they
                specify many shares they want. The more shares owned in a ticket, the higher the % of Lootbox earnings
                they receive. It is possible to buy fractional shares. The only reason you may want to customize your
                share price is for psychological pricing.
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
                style={{ width: '100%' }}
              />
            </$Horizontal>

            <br />
          </$Vertical>
          <$Vertical flex={isMobile ? 1 : 0.45} style={isMobile ? { flexDirection: 'column-reverse' } : undefined}>
            <TicketCardCandyWrapper
              backgroundImage={props.ticketState.coverUrl as string}
              logoImage={props.ticketState.logoUrl as string}
              themeColor={props.ticketState.lootboxThemeColor as string}
              name={props.ticketState.name as string}
            />
            <br />
            <$Horizontal>
              <$Vertical>
                <$InputMedium
                  value={props.ticketState.lootboxThemeColor}
                  onChange={(e) => parseInput('lootboxThemeColor', e.target.value)}
                  style={{
                    width: '100px',
                    border: props.ticketState.lootboxThemeColor
                      ? `${props.ticketState.lootboxThemeColor} solid 2px `
                      : '',
                  }}
                />
                {/* <$ColorPreview
                
                    color={props.ticketState.lootboxThemeColor as string}
                    onClick={() => window.open('https://htmlcolorcodes.com/color-picker/', '_blank')}
                  /> */}
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="logo-uploader">
                    {props.ticketState.logoFile ? '✅' : '⚠️  Upload'} Logo
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="logo-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('logo-uploader', 'logoFile')}
                  />
                  {/* <$InputMedium
                onChange={(e) => parseInput('logoUrl', e.target.value)}
                value={props.ticketState.logoUrl}
                style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}
              /> */}
                </$Vertical>
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="cover-uploader">
                    {props.ticketState.coverFile ? '✅' : '⚠️  Upload'} Cover
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="cover-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('cover-uploader', 'coverFile')}
                  />
                  {/* <$InputMedium
                onChange={(e) => parseInput('coverUrl', e.target.value)}
                value={props.ticketState.coverUrl}
                style={{ fontSize: '1rem', color: COLORS.surpressedFontColor }}
              /> */}
                </$Vertical>
              </$Vertical>
              <$Vertical>
                <$Vertical flex={1}>
                  <div id="color-picker" />
                </$Vertical>
              </$Vertical>
            </$Horizontal>
          </$Vertical>
        </div>
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

export const $InputImage = styled.input`
  display: none;
`

export const $InputImageLabel = styled.label`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  color: ${COLORS.surpressedFontColor};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 1.1rem;
  margin-right: 20px;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
`

export const $ColorPreview = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props: { color: string }) => props.color};
`

export default StepCustomize
