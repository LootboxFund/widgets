import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import ColorPicker from 'simple-color-picker'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS } from 'lib/theme'
import useWindowSize from 'lib/hooks/useScreenSize'
import { TicketCardCandyWrapper } from 'lib/components/TicketCard/TicketCard'
import { NetworkOption } from 'lib/api/network'
import { BigNumber } from 'bignumber.js'
import { getPriceFeed } from 'lib/hooks/useContract'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { checkIfValidEmail, checkIfValidUrl } from 'lib/api/helpers'
import { SOCIALS } from 'lib/hooks/constants'
import { $SocialLogo } from '../CreateLootbox/StepSocials'

const INITIAL_TICKET: Record<string, string | File | undefined> = {
  name: '',
  symbol: '',
  themeColor: '#B48AF7',
  logoUrl: 'https://gateway.pinata.cloud/ipfs/Qmdit9THgH3ifxYZnc4f1oHtifwxVcGMeVdUpWCPD2LuYC',
  coverUrl: 'https://gateway.pinata.cloud/ipfs/QmdZ2uzY9N77j95Vib8nM8AXBfDC4RctqefRwGLZjdsyxN',
  badgeUrl: 'https://i.pinimg.com/736x/14/b4/c2/14b4c205eba27ac480719a51adc98169.jpg',
  logoFile: undefined,
  coverFile: undefined,
  twitter: '',
  email: '',
  instagram: '',
  tiktok: '',
  facebook: '',
  discord: '',
  youtube: '',
  snapchat: '',
  twitch: '',
  web: '',
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
export interface BadgeFactoryProps {
  stage: StepStage
  selectedNetwork: NetworkOption
}
const BadgeFactoryStepOne = forwardRef((props: BadgeFactoryProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const [themeColor, setThemeColor] = useState('')
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)

  const updateTicketState = (param: string, value: string | File | undefined) => {
    setTicketState({ ...ticketState, [param]: value })
  }

  useEffect(() => {
    const colorPickerElement = document.getElementById('color-picker')
    const picker = new ColorPicker({ el: colorPickerElement || undefined, color: ticketState.themeColor as string })
    picker.onChange((color: string) => {
      setThemeColor(color)
    })
  }, [])

  useEffect(() => {
    if (themeColor !== ticketState.themeColor) {
      updateTicketState('themeColor', themeColor)
    }
  }, [themeColor, props])

  const initialErrors = {
    name: '',
    symbol: '',
    themeColor: '',
    logoUrl: '',
    coverUrl: '',
    logoFile: '',
    coverFile: '',
    email: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  const checkAllTicketCustomizationValidations = () => {
    let valid = true
    if (!validateName(ticketState.name as string)) valid = false
    if (!validateSymbol(ticketState.symbol as string)) valid = false
    if (!validateThemeColor(ticketState.themeColor as string)) valid = false
    if (!validateLogo(ticketState.logoUrl as string)) valid = false
    if (!validateCover(ticketState.coverUrl as string)) valid = false

    if (valid) {
      if (!validateLogoFile(ticketState.logoFile as File)) {
        valid = false
        setErrors({ ...errors, logoFile: 'Please upload a logo image' })
      }
      if (!validateCoverFile(ticketState.coverFile as File)) {
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
        themeColor: '',
        logoFile: '',
        coverFile: '',
        email: '',
      })
    }
    return valid
  }
  useEffect(() => {
    checkAllTicketCustomizationValidations()
  }, [ticketState])

  const parseInput = (slug: string, text: string) => {
    const value = slug === 'symbol' ? (text as string).toUpperCase().replace(' ', '') : text
    updateTicketState(slug, value)
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
    if (slug === 'themeColor') {
      setErrors({
        ...errors,
        themeColor: validateThemeColor(value as string) ? '' : 'Theme color must be a valid hex color',
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
    if (slug === 'email') {
      if (!checkIfValidEmail(value)) {
        setErrors({
          ...errors,
          email: 'Invalid email',
        })
      } else if (value.length === 0) {
        setErrors({
          ...errors,
          email: 'Email is mandatory',
        })
      } else {
        setErrors({
          ...errors,
          email: '',
        })
      }
    }
  }

  const onImageInputChange = (inputElementId: 'logo-uploader' | 'cover-uploader', slug: 'logoFile' | 'coverFile') => {
    // @ts-ignore
    const selectedFiles = document.getElementById(inputElementId)?.files
    if (selectedFiles?.length) {
      const file = selectedFiles[0]

      updateTicketState(slug, file)

      // Display the image in the UI
      // This updates the TicketCardCandyWrapper's logo and background
      let elementId: string
      if (slug === 'logoFile') {
        elementId = 'ticket-candy-logo'
      } else if (slug === 'coverFile') {
        elementId = 'ticket-candy-container'
      } else {
        elementId = ''
      }
      const el = document.getElementById(elementId)

      if (!el) {
        console.error(`Could not find element ${elementId}`)
        return
      }

      var url = URL.createObjectURL(file)

      el.style.backgroundImage = 'url(' + url + ')'

      return
    }
  }

  return (
    <$BadgeFactoryStepOne style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={() => {}}
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
              <span>Create Your Guild Badge</span>
              <HelpIcon tipID="customizeGuildBadge" />
              <ReactTooltip id="customizeGuildBadge" place="right" effect="solid">
                Lorem ipsum
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </$StepSubheading>
            <br />
            <br />
            <$StepSubheading>
              <span>Badge Name</span>
              <HelpIcon tipID="badgeName" />
              <ReactTooltip id="badgeName" place="right" effect="solid">
                Lorem ipsum
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              maxLength={30}
              onChange={(e) => parseInput('name', e.target.value)}
              value={ticketState.name as string}
            />
            <br />
            <$StepSubheading>
              <span>NFT Symbol</span>
              <HelpIcon tipID="nftSymbol" />
              <ReactTooltip id="nftSymbol" place="right" effect="solid">
                Lorem ipsum
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              onChange={(e) => parseInput('symbol', e.target.value)}
              value={ticketState.symbol as string}
              maxLength={9}
            />
            <br />
            <$Vertical>
              <$StepSubheading>
                <span>Contact Info</span>
                <HelpIcon tipID="contactInfo" />
                <ReactTooltip id="contactInfo" place="right" effect="solid">
                  Lorem ipsum
                </ReactTooltip>
              </$StepSubheading>
              {SOCIALS.filter((social) => social.shownOn.includes('badge-factory')).map((social) => {
                return (
                  <$Horizontal
                    key={social.slug}
                    style={
                      screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px', marginBottom: '10px' }
                    }
                  >
                    <$SocialLogo src={social.icon} />
                    <$InputMedium
                      style={{ width: '100%', fontSize: '1rem' }}
                      value={ticketState[social.slug] as string}
                      onChange={(e) => parseInput(social.slug, e.target.value)}
                      placeholder={social.placeholder}
                    ></$InputMedium>
                  </$Horizontal>
                )
              })}
            </$Vertical>
            <br />
          </$Vertical>
          <$Vertical flex={isMobile ? 1 : 0.45} style={isMobile ? { flexDirection: 'column-reverse' } : undefined}>
            <div style={{ height: '400px', marginBottom: '50px' }}>
              <TicketCardCandyWrapper
                backgroundImage={ticketState.coverUrl as string}
                logoImage={ticketState.logoUrl as string}
                themeColor={ticketState.themeColor as string}
                name={ticketState.name as string}
                screen={screen}
              />
            </div>
            <br />
            <$StepSubheading>
              <b>Styling Your NFT Badge</b>
              <HelpIcon tipID="styleNFTBadge" />
              <ReactTooltip id="styleNFTBadge" place="right" effect="solid">
                Lorem ipsum
              </ReactTooltip>
            </$StepSubheading>
            <$StepSubheading>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </$StepSubheading>
            <$Horizontal>
              <$Vertical>
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="logo-uploader">
                    {ticketState.logoFile ? '✅' : '⚠️  Upload'} Logo
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="logo-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('logo-uploader', 'logoFile')}
                  />
                </$Vertical>
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="cover-uploader">
                    {ticketState.coverFile ? '✅' : '⚠️  Upload'} Cover
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="cover-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('cover-uploader', 'coverFile')}
                  />
                </$Vertical>
                <br />
              </$Vertical>
              <$Vertical>
                <$Vertical flex={1}>
                  <div id="color-picker" />
                </$Vertical>
                <$InputMedium
                  value={ticketState.themeColor as string}
                  onChange={(e) => parseInput('themeColor', e.target.value)}
                  style={{
                    width: '80%',
                    textAlign: 'center',
                    border: ticketState.themeColor ? `${ticketState.themeColor} solid 2px ` : '',
                  }}
                />
              </$Vertical>
            </$Horizontal>
          </$Vertical>
        </div>
      </StepCard>
    </$BadgeFactoryStepOne>
  )
})

const $BadgeFactoryStepOne = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`
const $BadgeFactoryStepTwo = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`
const $BadgeFactoryStepThree = styled.section<{}>`
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

interface ValidatePurchasingTokenBalanceProps {
  stage: StepStage
  selectedNetwork: NetworkOption
}
const ValidatePurchasingTokenBalance = (props: ValidatePurchasingTokenBalanceProps) => {
  const initialErrors = {
    errorOne: '',
    errorTwo: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  return (
    <$BadgeFactoryStepOne style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={() => {}}
        errors={Object.values(errors)}
      >
        <p>ValidatePurchasingTokenBalance</p>
      </StepCard>
    </$BadgeFactoryStepOne>
  )
}

interface SubmitBadgeFactoryOnPolygonProps {
  stage: StepStage
  selectedNetwork: NetworkOption
}
const SubmitBadgeFactoryOnPolygon = (props: SubmitBadgeFactoryOnPolygonProps) => {
  const initialErrors = {
    errorOne: '',
    errorTwo: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  return (
    <$BadgeFactoryStepOne style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={() => {}}
        errors={Object.values(errors)}
      >
        <p>SubmitBadgeFactoryOnPolygon</p>
      </StepCard>
    </$BadgeFactoryStepOne>
  )
}

const network = {
  name: 'Binance',
  symbol: 'BNB',
  themeColor: '#F0B90B',
  chainIdHex: 'a',
  chainIdDecimal: '',
  isAvailable: true,
  icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
}

const BadgeFactory = () => {
  return (
    <$Vertical>
      <ValidatePurchasingTokenBalance stage="in_progress" selectedNetwork={network} />
      <br />
      <br />
      <BadgeFactoryStepOne stage="in_progress" selectedNetwork={network} />
      <br />
      <br />
      <SubmitBadgeFactoryOnPolygon stage="in_progress" selectedNetwork={network} />
    </$Vertical>
  )
}

export default BadgeFactory