import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $StepHeading, $StepSubheading } from '../CreateLootbox/StepCard'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import ColorPicker from 'simple-color-picker'
import { FormattedMessage, useIntl } from 'react-intl'
import { $InputImage, $InputImageLabel, $InputMedium, $TextAreaMedium } from '../CreateLootbox/StepCustomize'
import useWindowSize from 'lib/hooks/useScreenSize'
import { TicketCardCandyWrapper } from 'lib/components/TicketCard/TicketCard'
import { checkIfValidEmail, checkIfValidUrl } from 'lib/api/helpers'
import { getSocials } from 'lib/hooks/constants'
import { $SocialLogo } from '../CreateLootbox/StepSocials'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import $Button from '../Generics/Button'
import Spinner from '../Generics/Spinner'

export interface QuickCreateProps {
  tournamentName: string
  themeColor: string
}
const INITIAL_TICKET: Record<string, string | number> & { logoFile?: File; coverFile?: File; badgeFile?: File } = {
  name: '',
  symbol: '',
  biography: '',
  lootboxThemeColor: '#000000',
  // logoFile?: File
  // coverFile?: File
  // badgeFile?: File
}
export const validateName = (name: string) => name.length > 0
// export const validateSymbol = (symbol: string) => symbol.length > 0
export const validateBiography = (bio: string) => bio.length >= 12
export const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
export const validateLogo = (url: string) => url && checkIfValidUrl(url)
export const validateCover = (url: string) => url && checkIfValidUrl(url)
export const validateBadge = (url: string) => url && checkIfValidUrl(url)
export const validateLogoFile = (file: File) => !!file
export const validateCoverFile = (file: File) => !!file
export const validateBadgeFile = (file: File) => !!file

const INITAL_LOGO =
  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media'
const INITIAL_COVER =
  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-background.png?alt=media'

const QuickCreate = (props: QuickCreateProps) => {
  const { screen } = useWindowSize()
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  const [themeColor, setThemeColor] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'unsubmitted' | 'loading' | 'error' | 'success'>('unsubmitted')
  const intl = useIntl()
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const initialErrors: {
    name: string | React.ReactElement
    // symbol: string | React.ReactElement
    biography: string | React.ReactElement
    lootboxThemeColor: string | React.ReactElement
    logoUrl: string | React.ReactElement
    coverUrl: string | React.ReactElement
    badgeUrl: string | React.ReactElement
    logoFile: string | React.ReactElement
    coverFile: string | React.ReactElement
    badgeFile: string | React.ReactElement
    email: string | React.ReactElement
    submit: string | React.ReactElement
  } = {
    name: '',
    // symbol: '',
    biography: '',
    lootboxThemeColor: '',
    logoUrl: '',
    coverUrl: '',
    badgeUrl: '',
    logoFile: '',
    coverFile: '',
    badgeFile: '',
    email: '',
    submit: '',
  }
  const INITIAL_SOCIALS: { [key: string]: any } = {
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
  const [socialState, setSocialState] = useState(INITIAL_SOCIALS)
  const SOCIALS = getSocials(intl)
  const [errors, setErrors] = useState(initialErrors)
  const updateTicketState = (slug: string, value: string | number) => {
    setTicketState({ ...ticketState, [slug]: value })
  }
  useEffect(() => {
    const colorPickerElement = document.getElementById('color-picker')
    const picker = new ColorPicker({ el: colorPickerElement || undefined, color: ticketState.lootboxThemeColor })
    picker.onChange((color: string) => {
      setThemeColor(color)
    })
  }, [])

  useEffect(() => {
    if (themeColor !== ticketState.lootboxThemeColor) {
      updateTicketState('lootboxThemeColor', themeColor)
    }
  }, [themeColor, props])

  useEffect(() => {
    checkAllTicketCustomizationValidations()
  }, [ticketState])

  const checkAllTicketCustomizationValidations = () => {
    let valid = true
    if (!validateName(ticketState.name as string)) valid = false
    // if (!validateSymbol(ticketState.symbol as string)) valid = false
    if (!validateBiography(ticketState.biography as string)) valid = false
    if (!validateThemeColor(ticketState.lootboxThemeColor as string)) valid = false

    if (valid) {
      if (!validateLogoFile(ticketState.logoFile as File) && !validateLogo(ticketState.logoUrl as string)) {
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
        return
      }
      if (!validateCoverFile(ticketState.coverFile as File) && !validateCover(ticketState.coverUrl as string)) {
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
        return
      }
    }

    if (valid) {
      setErrors({
        ...errors,
        name: '',
        // symbol: '',
        biography: '',
        lootboxThemeColor: '',
        logoFile: '',
        coverFile: '',
        badgeFile: '',
        logoUrl: '',
        coverUrl: '',
      })
    }
    return valid
  }
  const parseInput = (slug: string, text: string | number) => {
    const value = slug === 'symbol' ? (text as string).toUpperCase().replace(' ', '') : text
    updateTicketState(slug, value)
    if (slug === 'name') {
      setErrors({
        ...errors,
        name: validateName(value as string) ? (
          ''
        ) : (
          <FormattedMessage
            id="createLootbox.stepCustomize.name.error"
            defaultMessage="Name cannot be empty"
            description="Error message for user if they forgot to enter a name for their Lootbox"
          />
        ),
      })
    }
    // if (slug === 'symbol') {
    //   setErrors({
    //     ...errors,
    //     symbol: validateSymbol(value as string) ? (
    //       ''
    //     ) : (
    //       <FormattedMessage
    //         id="createLootbox.stepCustomize.symbol.error"
    //         defaultMessage="Symbol cannot be empty"
    //         description="Error message for user if they forgot to enter a symbol for their Lootbox"
    //       />
    //     ),
    //   })
    // }
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

  const parseSocial = (slug: string, value: string) => {
    setSocialState({ ...socialState, [slug]: value })
    if (slug === 'email') {
      if (!checkIfValidEmail(value)) {
        setErrors({
          ...errors,
          email: (
            <FormattedMessage
              id="step.socials.email.invalid"
              defaultMessage="Invalid email"
              description="When a user enters an invalid email address, this message is shown."
            />
          ),
        })
      } else if (value.length === 0) {
        setErrors({
          ...errors,
          email: (
            <FormattedMessage
              id="step.socials.email.empty"
              defaultMessage="Email is mandatory"
              description="When a user does not enter an email address, this message is shown."
            />
          ),
        })
      } else {
        setErrors({
          ...errors,
          email: '',
        })
      }
    } else if (!socialState.email) {
      setErrors({
        ...errors,
        email: (
          <FormattedMessage
            id="step.socials.email.empty2"
            defaultMessage="Email is mandatory"
            description="When a user does not enter an email address, this message is shown."
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

      updateTicketState(slug, file)

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

  const joinTournament = async () => {
    setSubmitStatus('loading')
    setTimeout(() => {
      setSubmitStatus('success')
      setErrors({
        ...errors,
        name: '',
        // symbol: '',
        biography: '',
        lootboxThemeColor: '',
        logoFile: '',
        coverFile: '',
        badgeFile: '',
        logoUrl: '',
        coverUrl: '',
        submit: '',
      })
    }, 2000)
    setTimeout(() => {
      setSubmitStatus('error')
      setErrors({
        ...errors,
        name: '',
        // symbol: '',
        biography: '',
        lootboxThemeColor: '',
        logoFile: '',
        coverFile: '',
        badgeFile: '',
        logoUrl: '',
        coverUrl: '',
        submit: 'Submit Error',
      })
    }, 4000)
  }

  const renderButton = () => {
    const validProceed =
      !errors.name &&
      !errors.biography &&
      !errors.logoFile &&
      !errors.coverFile &&
      !errors.email &&
      ticketState.name &&
      ticketState.coverFile &&
      ticketState.logoFile &&
      ticketState.biography
    if (submitStatus === 'loading') {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${props.themeColor}30`}
          backgroundColorHover={props.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
          disabled={true}
        >
          <Spinner color={`${COLORS.surpressedFontColor}ae`} size="15px" margin="auto" />
        </$Button>
      )
    }
    if (submitStatus === 'success') {
      return (
        <$Button
          screen={screen}
          backgroundColor={COLORS.successFontColor}
          backgroundColorHover={COLORS.successFontColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          SUCCESSFULLY JOINED!
        </$Button>
      )
    }
    if (submitStatus === 'error') {
      return (
        <$Button
          screen={screen}
          onClick={() => joinTournament()}
          backgroundColor={COLORS.dangerFontColor}
          backgroundColorHover={props.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          FAILURE! TRY AGAIN?
        </$Button>
      )
    }
    return (
      <$Button
        screen={screen}
        onClick={() => joinTournament()}
        backgroundColor={validProceed ? props.themeColor : `${props.themeColor}30`}
        backgroundColorHover={props.themeColor}
        color={COLORS.white}
        style={{
          boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          fontSize: TYPOGRAPHY.fontSize.large,
          padding: '15px',
          borderRadius: '5px',
        }}
        disabled={!validProceed}
      >
        JOIN TOURNAMENT
      </$Button>
    )
  }

  return (
    <$QuickCreate>
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
          <$InputMedium maxLength={30} onChange={(e) => parseInput('name', e.target.value)} value={ticketState.name} />
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
            value={ticketState.biography}
            rows={6}
            maxLength={500}
          />
          <br />
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
          {SOCIALS.filter((s) => ['email', 'discord', 'twitch', 'facebook'].includes(s.slug)).map((social) => {
            return (
              <$Horizontal
                key={social.slug}
                style={screen === 'mobile' ? { marginBottom: '10px' } : { marginTop: '10px' }}
              >
                <$SocialLogo src={social.icon} />
                <$InputMedium
                  style={{ width: '100%' }}
                  value={socialState[social.slug]}
                  onChange={(e) => parseSocial(social.slug, e.target.value)}
                  placeholder={social.placeholder}
                ></$InputMedium>
              </$Horizontal>
            )
          })}
        </$Vertical>
        <$Vertical flex={isMobile ? 1 : 0.45} style={isMobile ? { flexDirection: 'column-reverse' } : undefined}>
          <TicketCardCandyWrapper
            backgroundImage={(ticketState.coverUrl as string) || INITIAL_COVER}
            logoImage={(ticketState.logoUrl as string) || INITAL_LOGO}
            badgeImage={ticketState.badgeUrl as string}
            themeColor={ticketState.lootboxThemeColor as string}
            name={ticketState.name as string}
            screen={screen}
          />
          <br />
          <$Horizontal flexWrap={screen === 'mobile'} style={{ flexDirection: screen === 'mobile' ? 'column' : 'row' }}>
            <$Vertical>
              {/* <$ColorPreview
                
                    color={ticketState.lootboxThemeColor as string}
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
                      icon: ticketState.logoFile || ticketState.logoUrl ? '✅' : '⚠️',
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
                      icon: ticketState.coverFile || ticketState.coverUrl ? '✅' : '⚠️',
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
              <$InputMedium
                value={ticketState.lootboxThemeColor}
                onChange={(e) => parseInput('lootboxThemeColor', e.target.value)}
                style={{
                  width: '120px',
                  textAlign: 'center',
                  border: ticketState.lootboxThemeColor ? `${ticketState.lootboxThemeColor} solid 2px ` : '',
                }}
              />
              {/* <$Vertical>
                  <$InputImageLabel
                    onClick={(e) => {
                      if (ticketState.badgeFile) {
                        updateTicketState('badgeFile', '')
                        updateTicketState('badgeUrl', '')
                        console.log(`REMOVING BADGE`)
                      }
                    }}
                    htmlFor="badge-uploader"
                  >
                    {ticketState.badgeFile ? 'Change' : 'Upload'} Badge
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
            </$Vertical>
          </$Horizontal>
        </$Vertical>
      </div>
      <br />
      <br />
      <$Vertical>
        {renderButton()}
        <$Horizontal justifyContent="center">
          <$Vertical justifyContent="center">
            {Object.values(errors)
              .filter((e) => e)
              .map((err) => {
                return <p style={{ color: COLORS.dangerFontColor, fontFamily: 'sans-serif' }}>{err}</p>
              })}
          </$Vertical>
        </$Horizontal>
      </$Vertical>
    </$QuickCreate>
  )
}

const $QuickCreate = styled.div<{}>`
  font-family: 'Roboto', sans-serif;
  width: 100%;
  max-width: 700px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 10%);
  padding: 20px;
`

export default QuickCreate
