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
import { BigNumber } from 'bignumber.js'
import { $SocialLogo } from '../CreateLootbox/StepSocials'
import { Address, COLORS, ContractAddress, TYPOGRAPHY, TournamentID } from '@wormgraph/helpers'
import $Button from '../Generics/Button'
import { NetworkOption } from 'lib/api/network'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { createEscrowLootbox } from 'lib/api/createLootbox'
import { SubmitStatus } from '../CreateLootbox/StepTermsConditions'
import { addCustomEVMChain, useProvider } from 'lib/hooks/useWeb3Api'
import { manifest } from '../../../manifest'
import useWords from 'lib/hooks/useWords'
import { useWords as useWordsCreate } from 'lib/components/CreateLootbox/constants'
import WalletButton from '../WalletButton'

export interface QuickCreateProps {
  tournamentName: string
  receivingWallet: Address
  network: NetworkOption
  fundraisingTarget: BigNumber
  fundraisingLimit: BigNumber
  // fundingType: LootboxType // only accepts escrow type
  tournamentId: TournamentID
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
  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [provider, loading] = useProvider()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [downloaded, setDownloaded] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('unsubmitted')
  const intl = useIntl()
  const words = useWords()
  const wordsCreate = useWordsCreate()
  const snapUserState = useSnapshot(userState)
  const reputationWallet = (snapUserState.currentAccount || '') as Address
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const initialErrors: {
    name: string
    // symbol: string
    biography: string
    lootboxThemeColor: string
    logoUrl: string
    coverUrl: string
    badgeUrl: string
    logoFile: string
    coverFile: string
    badgeFile: string
    email: string
    submit: string
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
  type socialKeys =
    | 'twitter'
    | 'email'
    | 'instagram'
    | 'tiktok'
    | 'facebook'
    | 'discord'
    | 'youtube'
    | 'snapchat'
    | 'twitch'
    | 'web'
  const INITIAL_SOCIALS: {
    twitter: string
    email: string
    instagram: string
    tiktok: string
    facebook: string
    discord: string
    youtube: string
    snapchat: string
    twitch: string
    web: string
  } = {
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
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null)
    }
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [timeLeft])

  useEffect(() => {
    if (timeElapsed === 0) {
      return
    }
    const intervalId = setInterval(() => {
      setTimeElapsed(timeElapsed + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [timeElapsed])
  useEffect(() => {
    if (submitStatus === 'success') {
      setTimeElapsed(0)
      setTimeLeft(20) // set the timer
    }
  }, [submitStatus])
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
          logoFile: wordsCreate.pleaseUploadALogoImage,
        })
        return
      }
      if (!validateCoverFile(ticketState.coverFile as File) && !validateCover(ticketState.coverUrl as string)) {
        valid = false
        setErrors({
          ...errors,
          coverFile: wordsCreate.pleaseUploadACoverPhoto,
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
        name: validateName(value as string) ? '' : words.nameCannotBeEmpty,
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
        biography: validateBiography(value as string) ? '' : wordsCreate.biographyMustBeAtLeast20Characters,
      })
    }
    if (slug === 'lootboxThemeColor') {
      setErrors({
        ...errors,
        lootboxThemeColor: validateThemeColor(value as string) ? '' : wordsCreate.themeColorMustBeAValidHexColor,
      })
    }
  }

  const parseSocial = (slug: string, value: string) => {
    setSocialState({ ...socialState, [slug]: value })
    if (slug === 'email') {
      if (!checkIfValidEmail(value)) {
        setErrors({
          ...errors,
          email: words.invalidEmail,
        })
      } else if (value.length === 0) {
        setErrors({
          ...errors,
          email: wordsCreate.emailIsMandatory,
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
        email: wordsCreate.emailIsMandatory,
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
    setTimeElapsed(1) // set the timer
    const current = snapUserState.currentAccount ? (snapUserState.currentAccount as String).toLowerCase() : ''
    console.log(snapUserState)
    if (!snapUserState?.network?.currentNetworkIdHex) {
      throw new Error(words.networkNotSet)
    }
    console.log(`Generating Escrow/Tournament Lootbox...`)
    await createEscrowLootbox(
      provider,
      setSubmitStatus,
      {
        name: ticketState.name as string,
        symbol: (ticketState.name as string).toUpperCase().replace(' ', '').slice(0, 9),
        biography: ticketState.biography as string,
        lootboxThemeColor: ticketState.lootboxThemeColor as string,
        logoFile: ticketState.logoFile as File,
        coverFile: ticketState.coverFile as File,
        logoUrl: ticketState.logoUrl as string,
        coverUrl: ticketState.coverUrl as string,
        badgeFile: ticketState.badgeFile as File,
        fundraisingTarget: props.fundraisingTarget as BigNumber,
        fundraisingTargetMax: props.fundraisingLimit as BigNumber,
        receivingWallet: current as Address,
        currentAccount: current as Address,
        setLootboxAddress: (address: ContractAddress) => setLootboxAddress(address),
        basisPoints: 1000, // hardcoded
        returnAmountTarget: '0',
        paybackDate: new Date().toString(),
        downloaded,
        setDownloaded: (downloaded: boolean) => setDownloaded(downloaded),
        tournamentId: props.tournamentId as TournamentID,
      },
      socialState,
      snapUserState.network.currentNetworkIdHex
    )
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
    if (!reputationWallet) {
      // Connect wallet
      return <WalletButton />
    }
    if (snapUserState.network.currentNetworkIdHex !== props.network.chainIdHex) {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${props.network.themeColor}`}
          backgroundColorHover={props.network.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
          onClick={async () => {
            await addCustomEVMChain(props.network.chainIdHex)
          }}
        >
          {words.switchNetwork}
        </$Button>
      )
    }
    if (submitStatus === 'in_progress') {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${props.network.themeColor}30`}
          backgroundColorHover={props.network.themeColor}
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
          {wordsCreate.submittingElapsedTimeFn(timeElapsed)}
        </$Button>
      )
    }
    if (submitStatus === 'success' && lootboxAddress) {
      if (timeLeft && timeLeft > 0) {
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
            onClick={() =>
              window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxAddress}`, '_blank')
            }
          >
            {wordsCreate.preparingElapsedTimeFn(timeLeft)}
          </$Button>
        )
      } else {
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
            onClick={() =>
              window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxAddress}`, '_blank')
            }
          >
            🎉 {wordsCreate.viewYourLootbox} 🎉
          </$Button>
        )
      }
    }
    if (submitStatus === 'failure') {
      return (
        <$Button
          screen={screen}
          onClick={() => joinTournament()}
          backgroundColor={COLORS.dangerFontColor}
          backgroundColorHover={props.network.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          {wordsCreate.failedTryAgain}
        </$Button>
      )
    }
    if (submitStatus === 'pending_confirmation') {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${props.network.themeColor}30`}
          backgroundColorHover={props.network.themeColor}
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
          {words.confirmOnMetamask}
        </$Button>
      )
    }
    return (
      <$Button
        screen={screen}
        onClick={() => joinTournament()}
        backgroundColor={validProceed ? props.network.themeColor : `${props.network.themeColor}30`}
        backgroundColorHover={props.network.themeColor}
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
        {words.joinTournament}
      </$Button>
    )
  }

  return (
    <$QuickCreate>
      <$Horizontal
        justifyContent="center"
        verticalCenter
        style={{
          backgroundColor: props.network.themeColor,
          color: COLORS.white,
          marginBottom: '20px',
          padding: '20px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          borderRadius: '15px 15px 0px 0px',
        }}
      >
        {wordsCreate.joinTournamentNameFn(props.tournamentName)}
      </$Horizontal>
      <$InnerLining>
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
              {wordsCreate.joinLootboxTournament}
              <HelpIcon tipID="quickCreateLootboxHeader" />
              <ReactTooltip id="quickCreateLootboxHeader" place="right" effect="solid">
                <FormattedMessage
                  id="quickCreateLootbox.singleStep.headingTooltip"
                  defaultMessage="Quickly create a Lootbox by joining a tournament with its predefined settings."
                  description="Info tooltip for quickly creating a Lootbox"
                />
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              <FormattedMessage
                id="quickCreateLootbox.singleStep.subheadingDescription"
                defaultMessage="Quickly join a Tournament using its predefined settings and your customized artwork for your Lootbox."
                description="Info statement about quickly creating a Lootbox"
              />
            </$StepSubheading>
            <br />
            <br />
            <$StepSubheading>
              {wordsCreate.lootboxName}
              <HelpIcon tipID="lootboxName" />
              <ReactTooltip id="lootboxName" place="right" effect="solid">
                {wordsCreate.lootboxNameHelp}
              </ReactTooltip>
            </$StepSubheading>
            <$InputMedium
              maxLength={30}
              onChange={(e) => parseInput('name', e.target.value)}
              value={ticketState.name}
            />
            <br />
            <$StepSubheading>
              {wordsCreate.biography}
              <HelpIcon tipID="ticketBiography" />
              <ReactTooltip id="ticketBiography" place="right" effect="solid">
                {wordsCreate.biographyHelp}
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
                id="quickCreateLootbox.singleStep.socials"
                defaultMessage="Socials"
                description="Label for user socials so that tournament organizers and fans can contact or follow them."
              />
              <HelpIcon tipID="ticketSocials" />
              <ReactTooltip id="ticketSocials" place="right" effect="solid">
                <FormattedMessage
                  id="quickCreateLootbox.singleStep.socials.tooltip"
                  defaultMessage="Provide your teams social media so that tournament organizers and fans can contact or follow you."
                  description="Tooltip for socials section in Quick Create Lootbox"
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
                    value={socialState[social.slug as socialKeys]}
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
            <$Horizontal
              flexWrap={screen === 'mobile'}
              style={{ flexDirection: screen === 'mobile' ? 'column' : 'row' }}
            >
              <$Vertical>
                <br />
                <$Vertical>
                  <$InputImageLabel htmlFor="logo-uploader">
                    {wordsCreate.uploadLogoFn(ticketState.logoFile || ticketState.logoUrl ? '✅' : '⚠️')}
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
                    {wordsCreate.uploadCoverFn(ticketState.coverFile || ticketState.coverUrl ? '✅' : '⚠️')}
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
                .map((err, index) => {
                  return (
                    <p key={index} style={{ color: COLORS.dangerFontColor, fontFamily: 'sans-serif' }}>
                      {err}
                    </p>
                  )
                })}
            </$Vertical>
          </$Horizontal>
        </$Vertical>
      </$InnerLining>
    </$QuickCreate>
  )
}

const $QuickCreate = styled.div<{}>`
  font-family: 'Roboto', sans-serif;
  width: 100%;
  max-width: 700px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 10%);
`

const $InnerLining = styled.div<{}>`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
`

export default QuickCreate
