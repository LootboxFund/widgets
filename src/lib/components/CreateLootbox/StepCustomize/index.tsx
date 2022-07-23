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
import { checkIfValidUrl } from 'lib/api/helpers'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'

const INITAL_LOGO =
  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media'
const INITIAL_COVER =
  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-background.png?alt=media'

export const validateName = (name: string) => name.length > 0
export const validateSymbol = (symbol: string) => symbol.length > 0
export const validateBiography = (bio: string) => bio.length >= 12
export const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
export const validateLogo = (url: string) => url && checkIfValidUrl(url)
export const validateCover = (url: string) => url && checkIfValidUrl(url)
export const validateBadge = (url: string) => url && checkIfValidUrl(url)
export const validateLogoFile = (file: File) => !!file
export const validateCoverFile = (file: File) => !!file
export const validateBadgeFile = (file: File) => !!file
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
  const words = useWords()

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
  const initialErrors: {
    name: string | React.ReactElement
    symbol: string | React.ReactElement
    biography: string | React.ReactElement
    lootboxThemeColor: string | React.ReactElement
    logoUrl: string | React.ReactElement
    coverUrl: string | React.ReactElement
    badgeUrl: string | React.ReactElement
    logoFile: string | React.ReactElement
    coverFile: string | React.ReactElement
    badgeFile: string | React.ReactElement
  } = {
    name: '',
    symbol: '',
    biography: '',
    lootboxThemeColor: '',
    logoUrl: '',
    coverUrl: '',
    badgeUrl: '',
    logoFile: '',
    coverFile: '',
    badgeFile: '',
  }
  const [errors, setErrors] = useState(initialErrors)
  const checkAllTicketCustomizationValidations = () => {
    let valid = true
    if (!validateName(props.ticketState.name as string)) valid = false
    if (!validateSymbol(props.ticketState.symbol as string)) valid = false
    if (!validateBiography(props.ticketState.biography as string)) valid = false
    if (!validateThemeColor(props.ticketState.lootboxThemeColor as string)) valid = false

    if (valid) {
      if (!validateLogoFile(props.ticketState.logoFile as File) && !validateLogo(props.ticketState.logoUrl as string)) {
        valid = false
        setErrors({
          ...errors,
          logoFile: (
            <FormattedMessage
              id="createLootbox.stepCustomize.logoFile.error"
              defaultMessage="Please upload a logo image"
              description="Error message for user if they forgot to upload a logo file (image file)"
            />
          ),
        })
      }
      if (
        !validateCoverFile(props.ticketState.coverFile as File) &&
        !validateCover(props.ticketState.coverUrl as string)
      ) {
        valid = false
        setErrors({
          ...errors,
          coverFile: (
            <FormattedMessage
              id="createLootbox.stepCustomize.coverFile.error"
              defaultMessage="Please upload a cover photo"
              description="Error message for user if they forgot to upload a cover file (image file)"
            />
          ),
        })
      }
    }

    if (valid) {
      setErrors({
        ...errors,
        name: '',
        symbol: '',
        biography: '',
        lootboxThemeColor: '',
        logoFile: '',
        coverFile: '',
        badgeFile: '',
        logoUrl: '',
        coverUrl: '',
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
        name: validateName(value as string) ? '' : words.nameCannotBeEmpty,
      })
    }
    if (slug === 'symbol') {
      setErrors({
        ...errors,
        symbol: validateSymbol(value as string) ? (
          ''
        ) : (
          <FormattedMessage
            id="createLootbox.stepCustomize.symbol.error"
            defaultMessage="Symbol cannot be empty"
            description="Error message for user if they forgot to enter a symbol for their Lootbox"
          />
        ),
      })
    }
    if (slug === 'biography') {
      setErrors({
        ...errors,
        biography: validateBiography(value as string) ? (
          ''
        ) : (
          <FormattedMessage
            id="createLootbox.stepCustomize.biography.error"
            defaultMessage="Biography must be at least 12 characters"
            description="Error message for user if they forgot to enter a valid biography for their Lootbox"
          />
        ),
      })
    }
    if (slug === 'lootboxThemeColor') {
      setErrors({
        ...errors,
        lootboxThemeColor: validateThemeColor(value as string) ? (
          ''
        ) : (
          <FormattedMessage
            id="createLootbox.stepCustomize.themeColor.error"
            defaultMessage="Theme color must be a valid hex color"
            description="Error message for user if they forgot to enter a valid themecolor which should be HEX format (i.e. #fefefe)"
          />
        ),
      })
    }
  }

  const onImageInputChange = (
    inputElementId: 'badge-uploader' | 'logo-uploader' | 'cover-uploader',
    slug: 'logoFile' | 'coverFile' | 'badgeFile'
  ) => {
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
      } else if (slug === 'coverFile') {
        elementId = 'ticket-candy-container'
      } else {
        elementId = 'ticket-candy-badge'
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
              <FormattedMessage
                id="createLootbox.customizeTicket.title"
                defaultMessage="5. Customize NFT Ticket"
                description="Header for 5th step in creating a Lootbox"
              />
              <HelpIcon tipID="stepCustomize" />
              <ReactTooltip id="stepCustomize" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.customizeTicket.subHeading"
                  defaultMessage="Finally, an NFT that's actually useful 😂"
                  description="Sub-header for 5th step in creating a Lootbox"
                />
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.customizeTicket.subHeading2"
                defaultMessage="Your Lootbox fundraises money by selling NFT tickets to investors, who enjoy profit sharing when you deposit earnings back into the Lootbox."
                description="Sub-header for 5th step in creating a Lootbox"
              />
            </$StepSubheading>
            <br />
            <br />
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.customizeTicket.inputName"
                defaultMessage="Lootbox Name"
                description="Label for name input in 5th step in creating a Lootbox - this is a name for the Lootbox"
              />
              <HelpIcon tipID="lootboxName" />
              <ReactTooltip id="lootboxName" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.customizeTicket.inputName.toolTip"
                  defaultMessage="The name of your Lootbox. It can be your name, your mission, or just something catchy. Keep in mind that you will likely have multiple Lootboxes in the future, so try to have a uniquely identifyable name to reduce confusion."
                  description="Tooltip for name input in 5th step in creating a Lootbox"
                />
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              maxLength={30}
              onChange={(e) => parseInput('name', e.target.value)}
              value={props.ticketState.name}
            />
            <br />
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.customizeTicket.inputSymbol"
                defaultMessage="Lootbox Symbol"
                description="Label for symbol input in 5th step in creating a Lootbox - this is a symbol for the Lootbox"
              />
              <HelpIcon tipID="ticketSymbol" />
              <ReactTooltip id="ticketSymbol" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.customizeTicket.inputSymbol.tooltip"
                  defaultMessage="Set a shortname for your NFT Tickets to be displayed in Metamask. Max 9 characters."
                  description="tooltip for people who might be confused about what this field is"
                />
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              onChange={(e) => parseInput('symbol', e.target.value)}
              value={props.ticketState.symbol}
              maxLength={9}
            />
            <br />
            <$StepSubheading>
              <FormattedMessage
                id="createLootbox.customizeTicket.inputBiography"
                defaultMessage="Biography"
                description="Label for biography input. This is a field the user can input a description of their Lootbox."
              />
              <HelpIcon tipID="ticketBiography" />
              <ReactTooltip id="ticketBiography" place="right" effect="solid">
                <FormattedMessage
                  id="createLootbox.customizeTicket.inputBiography.tooltip"
                  defaultMessage="Write a 3-5 sentence introduction of yourself and what you plan to use the investment money for."
                  description="tooltip for people who might be confused about what the Lootbox biography field is"
                />
              </ReactTooltip>
            </$StepSubheading>
            <$TextAreaMedium
              onChange={(e) => parseInput('biography', e.target.value)}
              value={props.ticketState.biography}
              rows={6}
              maxLength={500}
            />
            <br />
            <br />
          </$Vertical>
          <$Vertical flex={isMobile ? 1 : 0.45} style={isMobile ? { flexDirection: 'column-reverse' } : undefined}>
            <TicketCardCandyWrapper
              backgroundImage={(props.ticketState.coverUrl as string) || INITIAL_COVER}
              logoImage={(props.ticketState.logoUrl as string) || INITAL_LOGO}
              badgeImage={props.ticketState.badgeUrl as string}
              themeColor={props.ticketState.lootboxThemeColor as string}
              name={props.ticketState.name as string}
              screen={screen}
            />
            <br />
            <$Horizontal
              flexWrap={screen === 'mobile'}
              style={{ flexDirection: screen === 'mobile' ? 'column' : 'row' }}
            >
              <$Vertical>
                {/* <$ColorPreview
                
                    color={props.ticketState.lootboxThemeColor as string}
                    onClick={() => window.open('https://htmlcolorcodes.com/color-picker/', '_blank')}
                  /> */}
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="logo-uploader">
                    <FormattedMessage
                      id="createLootbox.customizeTicket.inputLogo.prompt"
                      defaultMessage="{icon} Upload Logo"
                      description="Label for input field for Lootbox logo (image file)"
                      values={{
                        icon: props.ticketState.logoFile || props.ticketState.logoUrl ? '✅' : '⚠️',
                      }}
                    />
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
                    <FormattedMessage
                      id="createLootbox.customizeTicket.inputCover.prompt"
                      defaultMessage="{icon} Upload Cover"
                      description="Label for input field for Lootbox cover file (image file)"
                      values={{
                        icon: props.ticketState.coverFile || props.ticketState.coverUrl ? '✅' : '⚠️',
                      }}
                    />
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="cover-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('cover-uploader', 'coverFile')}
                  />
                </$Vertical>
                <br />
                {/* <$Vertical>
                  <$InputImageLabel
                    onClick={(e) => {
                      if (props.ticketState.badgeFile) {
                        props.updateTicketState('badgeFile', '')
                        props.updateTicketState('badgeUrl', '')
                        console.log(`REMOVING BADGE`)
                      }
                    }}
                    htmlFor="badge-uploader"
                  >
                    {props.ticketState.badgeFile ? 'Change' : 'Upload'} Badge
                  </$InputImageLabel>
                  <$InputImage
                    type="file"
                    id="badge-uploader"
                    accept="image/*"
                    onChange={() => onImageInputChange('badge-uploader', 'badgeFile')}
                  />
                </$Vertical> */}
              </$Vertical>
              <$Vertical>
                <$Vertical flex={1}>
                  <div id="color-picker" />
                </$Vertical>
                <$InputMedium
                  value={props.ticketState.lootboxThemeColor}
                  onChange={(e) => parseInput('lootboxThemeColor', e.target.value)}
                  style={{
                    width: '120px',
                    textAlign: 'center',
                    border: props.ticketState.lootboxThemeColor
                      ? `${props.ticketState.lootboxThemeColor} solid 2px `
                      : '',
                  }}
                />
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
