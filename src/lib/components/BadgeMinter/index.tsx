import { Address, COLORS, ContractAddress, convertDecimalToHex } from '@wormgraph/helpers'
import { checkIfValidEmail, checkIfValidUrl } from 'lib/api/helpers'
import { NetworkOption } from 'lib/api/network'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import react, { forwardRef, useEffect, useState } from 'react'
import ColorPicker from 'simple-color-picker'
import styled from 'styled-components'
import { ethers as ethersObj, Contract } from 'ethers'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from '../CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $InputImage, $InputImageLabel, $InputMedium, CreateBadgeFactory } from '../BadgeFactory'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { v4 as uuidv4 } from 'uuid'
import { uploadLootboxLogo } from 'lib/api/firebase/storage'
import { downloadFile, stampNewBadge } from 'lib/api/stamp'
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
import parseUrlParams from 'lib/utils/parseUrlParams'
import { addCustomEVMChain, getProvider, useProvider } from 'lib/hooks/useWeb3Api'
import BADGE_ABI from 'lib/abi/BadgeBCS.json'
import { decodeEVMLog } from 'lib/api/evm'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { SubmitStatus } from '../CreateLootbox/StepTermsConditions'
import LogRocket from 'logrocket'
import WalletStatus from '../WalletStatus'
import { checkMobileBrowser } from 'lib/api/createLootbox'

// CONSTANTS
const targetChainIdHex = '0x13881'
const VIEW_BADGE_URL = 'https://badge-viewer-bcs-v1-5.surge.sh'
const BADGE_MINTER_PIPEDREAM_URL = 'https://cf437c8b70a35a93625d1aac738e09f9.m.pipedream.net'
const BADGE_MINTER_PIPEDREAM_SECRET = 'z6dLUlZRYkje3tpXgQYZK1$M1Q@gYO0a8mhjJ%K*'
//

const INITIAL_TICKET: Record<string, string | File | undefined> = {
  guildName: '',
  memberName: '',
  themeColor: '#B48AF7',
  logoUrl: '',
  coverUrl: 'https://img.freepik.com/free-photo/gray-painted-background_53876-94041.jpg',
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
  gamesPlayed: '',
  location: '',
  numberOfScholars: '',
}

export const validateName = (name: string) => name.length > 0
export const validateSymbol = (symbol: string) => symbol.length > 0
export const validateBiography = (bio: string) => bio.length >= 12
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
  const snapUserState = useSnapshot(userState)
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const [themeColor, setThemeColor] = useState('')
  const [badgeAddress, setBadgeAddress] = useState<ContractAddress>()
  const [shouldReloadBadgeDetails, setShouldReloadBadgeDetails] = useState(false)
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('unsubmitted')
  const [logoImage, setLogoImage] = useState('')
  const [provider, loading] = useProvider()
  const [finalTicketId, setFinalTicketId] = useState('')
  const [stampUrl, setStampUrl] = useState('')

  const [timeLeft, setTimeLeft] = useState<number | null>(null)
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

  const updateTicketState = (param: string, value: string | File | undefined) => {
    setTicketState({ ...ticketState, [param]: value })
  }

  useEffect(() => {
    const colorPickerElement = document.getElementById('color-picker')
    const picker = new ColorPicker({ el: colorPickerElement || undefined, color: ticketState.themeColor as string })
    picker.onChange((color: string) => {
      setThemeColor(color)
    })
    const addr = parseUrlParams('badge') as ContractAddress
    console.log(`Finding addr = ${addr}`)
    if (addr) {
      setBadgeAddress(addr)
    }
  }, [])

  useEffect(() => {
    if (badgeAddress) {
      getBadgeDetails(badgeAddress)
    }
  }, [badgeAddress, shouldReloadBadgeDetails])

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
    // if (!validateLogo(ticketState.logoUrl as string)) valid = false
    if (!validateCover(ticketState.coverUrl as string)) valid = false

    if (valid) {
      // if (!validateLogoFile(ticketState.logoFile as File)) {
      //   valid = false
      //   setErrors({ ...errors, logoFile: 'Please upload a logo image' })
      // }
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

  const getBadgeDetails = async (addr: ContractAddress) => {
    const ethers = window.ethers ? window.ethers : ethersObj
    const { provider } = await getProvider()
    const signer = await provider.getSigner()
    const badge = new ethers.Contract(addr, BADGE_ABI, signer)
    const [logoImageUrl, guildName] = await Promise.all([badge.logoImageUrl(), badge.name()])
    setLogoImage(logoImageUrl)
    console.log(`
      
    guildName = ${guildName}
    logoImageUrl = ${logoImageUrl}

    `)
    setTicketState({ ...ticketState, guildName, logoUrl: logoImageUrl })
    if (shouldReloadBadgeDetails) {
      const colorPickerElement = document.getElementById('color-picker')
      const picker = new ColorPicker({ el: colorPickerElement || undefined, color: ticketState.themeColor as string })
      picker.onChange((color: string) => {
        setThemeColor(color)
      })
    }
  }

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

  const validateAllInputs = () => {
    let valid = true
    if (!validateName(ticketState.memberName as string)) {
      valid = false
    }
    if (!validateCoverFile(ticketState.coverFile as File)) {
      valid = false
    }
    if (!validateThemeColor(ticketState.themeColor as string)) {
      valid = false
    }
    return valid
  }

  const mintBadge = async () => {
    setTimeLeft(99)
    setSubmitStatus('in_progress')
    const currentUser = (snapUserState.currentAccount || '') as Address
    if (!provider) {
      throw new Error('No provider')
    }
    if (!badgeAddress) {
      throw new Error('No badge found!')
    }
    const submissionId = `badge-bcs/${uuidv4()}`
    const [imagePublicPath] = await Promise.all([uploadLootboxLogo(submissionId, ticketState.coverFile as File)])
    const blockNum = await provider.getBlockNumber()
    const ethers = ethersObj
    const signer = await provider.getSigner()
    const badgeFactory = new ethers.Contract(badgeAddress, BADGE_ABI, signer)
    try {
      console.log(`--- Minting badge...`)
      await badgeFactory.mintBadge(ticketState.memberName as string, JSON.stringify(ticketState))
      console.log(`Submitted badge mint!`)
      const filter = {
        fromBlock: blockNum,
        address: badgeFactory.address,
        topics: [ethers.utils.solidityKeccak256(['string'], ['MintBadge(address,uint256,string,string)'])],
      }
      provider.on(filter, async (log) => {
        if (log !== undefined) {
          const decodedLog = decodeEVMLog({
            eventName: 'MintBadge',
            log: log,
            abi: `
            event MintBadge(
              address indexed purchaser,
              uint256 ticketId,
              string memberName,
              string _data
            )`,
            keys: ['purchaser', 'ticketId', 'memberName', '_data'],
          })
          const { purchaser, ticketId, memberName, _data } = decodedLog as any
          console.log(`

            --- purchaser: ${purchaser} vs ${currentUser}
            --- ticket: id = ${ticketId}, memberName = ${memberName}

          `)
          console.log(_data)
          if (
            purchaser.toLowerCase() === currentUser.toLowerCase() &&
            memberName.toLowerCase() === (ticketState.memberName as string).toLowerCase()
          ) {
            console.log(`

              ---- 🎉🎉🎉 ----

              Congratulations! You've minted a Badge!

              ${memberName}
              Badge Factory Address: ${badgeAddress}
              Ticket ID: ${ticketId}

              ---------------

            `)
            setFinalTicketId(ticketId)
            try {
              const [_stampUrl] = await Promise.all([
                stampNewBadge({
                  backgroundImage: imagePublicPath,
                  logoImage: ticketState.logoUrl as string,
                  themeColor: ticketState.themeColor as string,
                  guildName: ticketState.guildName as string,
                  memberName: ticketState.memberName as string,
                  ticketID: ticketId.toString(),
                  badgeAddress: badgeAddress,
                  chainIdHex: targetChainIdHex,
                }),
              ])
              console.log(`Stamp URL: ${_stampUrl}`)
              setStampUrl(_stampUrl)
              const nftData = {
                guildName: ticketState.guildName as string,
                memberName: ticketState.memberName as string,
                themeColor: ticketState.themeColor as string,
                logoUrl: ticketState.logoUrl as string,
                coverUrl: ticketState.coverUrl as string,
                twitter: ticketState.twitter as string,
                email: ticketState.email as string,
                facebook: ticketState.facebook as string,
                discord: ticketState.discord as string,
                web: ticketState.web as string,
                gamesPlayed: ticketState.gamesPlayed as string,
                location: ticketState.location as string,
                numberOfScholars: ticketState.numberOfScholars as string,
                stampImage: _stampUrl as string,
                ticketId: ticketId.toString(),
                badgeAddress: badgeAddress,
              }
              const headers = new Headers({
                'Content-Type': 'application/json',
                secret: BADGE_MINTER_PIPEDREAM_SECRET,
              })
              await fetch(`${BADGE_MINTER_PIPEDREAM_URL}`, {
                method: 'POST',
                headers: headers,
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify(nftData),
              })
              // Do not download the stamp if on mobile browser - doing so will cause Metamask browser to crash
              if (stampUrl && !checkMobileBrowser()) {
                await downloadFile(
                  `${ticketState.guildName}-${badgeAddress}-${ticketState.memberName}-${ticketId}`,
                  stampUrl
                )
              }
            } catch (err) {
              LogRocket.captureException(err)
              console.log(err)
            } finally {
              setSubmitStatus('success')
            }
          }
        }
      })
    } catch (e) {
      console.log(e)
      LogRocket.captureException(e)
      setSubmitStatus('failure')
    }
  }

  const switchChains = async () => {
    await addCustomEVMChain(targetChainIdHex)
    // console.log(`--- added custom chain ${targetChainIdHex}`)
  }

  const renderActionBar = () => {
    if (snapUserState.network.currentNetworkIdHex !== targetChainIdHex) {
      return (
        <CreateBadgeFactory
          allConditionsMet={validateAllInputs()}
          themeColor={props.selectedNetwork?.themeColor}
          onSubmit={() => switchChains()}
          text="Continue with Polygon"
        />
      )
    }
    if (submitStatus === 'failure') {
      return (
        <CreateBadgeFactory
          allConditionsMet={validateAllInputs()}
          themeColor={COLORS.dangerFontColor}
          onSubmit={() => mintBadge()}
          text="Failed, try again?"
        />
      )
    } else if (submitStatus === 'success') {
      return (
        <CreateBadgeFactory
          allConditionsMet={true}
          themeColor={COLORS.successFontColor}
          onSubmit={() => {
            window.open(stampUrl, '_blank')
          }}
          text="Success! View Badge"
        />
      )
    } else if (submitStatus === 'in_progress') {
      return (
        <CreateBadgeFactory
          allConditionsMet={false}
          themeColor={props.selectedNetwork?.themeColor}
          onSubmit={() => console.log('submitting...')}
          text={`...submitting (${timeLeft})`}
        />
      )
    } else if (submitStatus === 'unsubmitted') {
      return (
        <CreateBadgeFactory
          allConditionsMet={validateAllInputs()}
          themeColor={props.selectedNetwork?.themeColor}
          onSubmit={() => mintBadge()}
          text="Mint Guild Badge"
        />
      )
    }
    return
  }

  if (!badgeAddress) {
    return <p>No Badge Smart Contract found in URL</p>
  }

  if (!snapUserState.currentAccount) {
    return <p>Connect with Metamask</p>
  } else {
    if (!shouldReloadBadgeDetails) {
      setShouldReloadBadgeDetails(true)
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
        customActionBar={renderActionBar}
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
              <span>{`Join ${ticketState.guildName}`}</span>
              <HelpIcon tipID="customizeGuildBadge" />
              <ReactTooltip id="customizeGuildBadge" place="right" effect="solid">
                {`Mint this NFT for free on the Polygon network. You can use this badge to join ${ticketState.guildName} and show your support.`}
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              {`Share this link with your guild members to mint your Official Guild Badge. In partnership with BlockchainSpace & LootboxFund.`}
            </$StepSubheading>
            <$StepSubheading style={{ fontSize: '0.8rem' }}>
              <a href={`${props.selectedNetwork.blockExplorerUrl}address/${badgeAddress}`} target="_blank">
                {badgeAddress}
              </a>
            </$StepSubheading>
            <br />
            <br />
            <$StepSubheading>
              <span>Member Name</span>
              <HelpIcon tipID="badgeName" />
              <ReactTooltip id="badgeName" place="right" effect="solid">
                Ideally use the same name that your guild members know you as. That could be your gamertag, your discord
                username, or your real name. It's your choice.
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
                  Optional but highly recommended. Providing this info to your guild will help them reach you.
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
                {`Everyone in ${ticketState.guildName} will use the same Guild Logo, but every person will have their own unique background image on their Badge.`}
              </ReactTooltip>
            </$StepSubheading>
            <$StepSubheading>
              {`Customize the look & feel of your Guild Badge. This is your NFT membership pass.`}
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
  const snapUserState = useSnapshot(userState)
  const isWalletConnected = snapUserState.accounts.length > 0
  return (
    <div>
      <WalletStatus targetNetwork={targetChainIdHex} />
      <br />
      <div style={isWalletConnected ? { marginTop: '20px' } : { opacity: '0.2', cursor: 'not-allowed' }}>
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
            blockExplorerUrl: 'https://mumbai.polygonscan.com/',
          }}
        ></PersonalizeBadge>
      </div>
    </div>
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

// const MyBadges = () => {
//   const [badgeAddress, setBadgeAddress] = useState('')
//   const snapUserState = useSnapshot(userState)
//   useEffect(() => {
//     const addr = parseUrlParams('badge') as ContractAddress
//     console.log(`Finding addr = ${addr}`)
//     if (addr) {
//       setBadgeAddress(addr)
//       loadMyBadges(addr as ContractAddress)
//     }
//   }, [])
//   const loadMyBadges = async (badgeAddr: ContractAddress) => {
//     if (!badgeAddr) {
//       throw new Error('No badge initialized')
//     }
//     if (!snapUserState.currentAccount) {
//       throw new Error('No user account')
//     }
//     // use ERC721Enumerable to get the tokens owned by an address (https://ethereum.stackexchange.com/questions/68438/erc721-how-to-get-the-owned-tokens-of-an-address)
//     const badges = await fetchUserTicketsFromLootbox(snapUserState.currentAccount, badgeAddr)
//     for (const ticket of userTicketState.userTickets) {
//       try {
//         await loadTicketData(ticket)
//       } catch (err) {
//         console.error('Error loading ticket', err)
//       }
//     }
//   }
//   return <p>My Tickets</p>
// }

export default BadgeMinter
