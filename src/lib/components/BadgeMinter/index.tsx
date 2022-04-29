import { COLORS } from '@wormgraph/helpers'
import { checkIfValidEmail, checkIfValidUrl } from 'lib/api/helpers'
import { NetworkOption } from 'lib/api/network'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import react, { forwardRef, useEffect, useState } from 'react'
import ColorPicker from 'simple-color-picker'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from '../CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $InputImage, $InputImageLabel, $InputMedium } from '../BadgeFactory'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import {
  $Divider,
  $LogoContainer,
  $TagText,
  $TicketIDText,
  $TicketLogo,
  $TicketTag,
  TicketCardCandyWrapper,
} from '../TicketCard/TicketCard'
import { $SocialLogo } from '../CreateLootbox/StepSocials'
import { SOCIALS } from 'lib/hooks/constants'

const INITIAL_TICKET: Record<string, string | File | undefined> = {
  guildName: '',
  memberName: '',
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
export interface PersonalizeBadgeProps {
  stage: StepStage
  selectedNetwork: NetworkOption
}
const PersonalizeBadge = forwardRef((props: PersonalizeBadgeProps, ref: React.RefObject<HTMLDivElement>) => {
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
    if (!validateName(ticketState.guildName as string)) valid = false
    if (!validateName(ticketState.memberName as string)) valid = false
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
    <$PersonalizeBadge style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
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
              <span>Mint Your Guild Badge</span>
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
              <span>Member Name</span>
              <HelpIcon tipID="badgeName" />
              <ReactTooltip id="badgeName" place="right" effect="solid">
                Lorem ipsum
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              maxLength={30}
              onChange={(e) => parseInput('memberName', e.target.value)}
              value={ticketState.memberName as string}
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
              {SOCIALS.filter((social) => social.shownOn.includes('badge-member')).map((social) => {
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
              <BadgeCandyWrapper
                backgroundImage={ticketState.coverUrl as string}
                logoImage={ticketState.logoUrl as string}
                themeColor={ticketState.themeColor as string}
                guildName={ticketState.guildName as string}
                memberName={ticketState.memberName as string}
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
                <$Vertical>
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
                <br />
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
    </$PersonalizeBadge>
  )
})

const $PersonalizeBadge = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

const BadgeMinter = () => {
  return (
    <PersonalizeBadge
      stage="in_progress"
      selectedNetwork={{
        name: 'Polygon',
        symbol: 'MATIC',
        themeColor: '#8F5AE8',
        chainIdHex: '0x89',
        chainIdDecimal: '137',
        isAvailable: false,
        isTestnet: false,
        icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
      }}
    ></PersonalizeBadge>
  )
}

const $BadgeMinter = styled.div<{}>``

interface BadgeCandyWrapperProps {
  backgroundImage: string
  logoImage: string
  badgeImage?: string
  themeColor: string
  guildName: string
  memberName: string
  screen: ScreenSize
}
const BadgeCandyWrapper = (props: BadgeCandyWrapperProps) => {
  return (
    <$BadgeCandyWrapper
      // id used to set background image in "components/CreateLootbox/StepCustomize/index.ts"
      id="ticket-candy-container"
      backgroundImage={props.backgroundImage}
      onClick={() => {
        console.log('click')
      }}
    >
      <$LogoContainer>
        {/* {props.badgeImage && (
          <$BadgeImage
            // id used to set logo image in "components/CreateLootbox/StepCustomize/index.ts"
            id="ticket-candy-badge"
            image={props.badgeImage}
            backgroundShadowColor={props.themeColor}
            // margin="auto auto 0"
          />
        )} */}

        <$TicketLogo
          // id used to set logo image in "components/CreateLootbox/StepCustomize/index.ts"
          id="ticket-candy-logo"
          backgroundImage={props.logoImage}
          backgroundShadowColor={props.themeColor}
          // margin="auto auto 0"
        />
      </$LogoContainer>

      <$VTicketTag>
        <$TicketIDText>{props.memberName || 'Member Name'}</$TicketIDText>
        <$TagText>{props.guildName || 'Guild Name'}</$TagText>
      </$VTicketTag>
    </$BadgeCandyWrapper>
  )
}

const BASE_CONTAINER = `
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1.5rem;
`

const $VTicketTag = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px 10px;
  box-sizing: border-box;
`

export const $BadgeCandyWrapper = styled.section<{ backgroundColor?: string; backgroundImage?: string | undefined }>`
  ${BASE_CONTAINER}
  border: 0px solid transparent;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  background: ${(props) => (props.backgroundColor ? props.backgroundColor : `${COLORS.surpressedBackground}15`)};
  ${(props) => (props.backgroundImage ? `background: url("${props.backgroundImage}");` : '')}
  background-size: cover;
  cursor: pointer;
  background-position: center;
  position: relative;
`

export default BadgeMinter
