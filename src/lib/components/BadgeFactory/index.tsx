import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import ColorPicker from 'simple-color-picker'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS } from 'lib/theme'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { v4 as uuidv4 } from 'uuid'
import {
  $Divider,
  $TagText,
  $TicketIDText,
  $TicketLogo,
  $TicketTag,
  TicketCardCandyWrapper,
} from 'lib/components/TicketCard/TicketCard'
import LogRocket from 'logrocket'
import { decodeEVMLog } from 'lib/api/evm'
import { NetworkOption } from 'lib/api/network'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { checkIfValidEmail, checkIfValidUrl } from 'lib/api/helpers'
import { SOCIALS } from 'lib/hooks/constants'
import { $SocialLogo } from '../CreateLootbox/StepSocials'
import { ethers as ethersObj } from 'ethers'
import { $ComingSoon, $NetworkIcon, $NetworkName } from '../CreateLootbox/StepChooseNetwork'
import { $TermCheckbox, $TermOfService, SubmitStatus, TermsFragment } from '../CreateLootbox/StepTermsConditions'
import { addCustomEVMChain, getProvider, useProvider } from 'lib/hooks/useWeb3Api'
import ERC20ABI from 'lib/abi/erc20.json'
import { ContractAddress, ChainIDHex, Address } from '@wormgraph/helpers'
import WalletButton from '../WalletButton'
import WalletStatus from 'lib/components/WalletStatus'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { getUserBalanceOfToken } from 'lib/hooks/useContract'
import { uploadLootboxLogo } from 'lib/api/firebase/storage'
import BADGE_FACTORY_ABI from 'lib/abi/BadgeFactoryBCS.json'

// CONSTANTS
const BADGE_FACTORY_ADDRESS = '0xA1E0F31e037DCB577756A85930c8822B3bfa1Be7' as ContractAddress
const targetChainIdHex = '0x13881'
const BADGE_FACTORY_URL = 'https://badge-minter-bcs-v1-3.surge.sh'
// ------------

export const validateName = (name: string) => name.length > 0
export const validateSymbol = (symbol: string) => symbol.length > 0
export const validateBiography = (bio: string) => bio.length >= 12
export const validatePricePerShare = (price: number, maxPricePerShare: number) => price > 0 && price <= maxPricePerShare
export const validateThemeColor = (color: string) => color.length === 7 && color[0] === '#'
export const validateLogo = (url: string) => url && checkIfValidUrl(url)
export const validateCover = (url: string) => url && checkIfValidUrl(url)
export const validateLogoFile = (file: File) => !!file
export const validateCoverFile = (file: File) => !!file
export interface CustomizeBadgeProps {
  stage: StepStage
  selectedNetwork: NetworkOption
  setCustomizeComplete: (bool: Boolean) => void
  ticketState: Record<string, string | File | undefined>
  updateTicketState: (param: string, value: string | File | undefined) => void
}
const CustomizeBadge = forwardRef((props: CustomizeBadgeProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const isMobile = screen === 'mobile' || screen === 'tablet'
  const [themeColor, setThemeColor] = useState('')

  useEffect(() => {
    const colorPickerElement = document.getElementById('color-picker')
    const picker = new ColorPicker({
      el: colorPickerElement || undefined,
      color: props.ticketState.themeColor as string,
    })
    picker.onChange((color: string) => {
      setThemeColor(color)
    })
  }, [])

  useEffect(() => {
    if (themeColor !== props.ticketState.themeColor) {
      props.updateTicketState('themeColor', themeColor)
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
    if (!validateName(props.ticketState.name as string)) valid = false
    if (!validateSymbol(props.ticketState.symbol as string)) valid = false
    if (!validateThemeColor(props.ticketState.themeColor as string)) valid = false
    if (!validateLogo(props.ticketState.logoUrl as string)) valid = false

    if (valid) {
      if (!validateLogoFile(props.ticketState.logoFile as File)) {
        valid = false
        setErrors({ ...errors, logoFile: 'Please upload a logo image' })
      }
    }

    if (valid) {
      setErrors({
        ...errors,
        name: '',
        symbol: '',
        themeColor: '',
        logoFile: '',
        email: '',
      })
    }
    return valid
  }
  useEffect(() => {
    const isValid = checkAllTicketCustomizationValidations()
    if (isValid) {
      props.setCustomizeComplete(isValid)
    }
  }, [props.ticketState])

  const parseInput = (slug: string, text: string) => {
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

      props.updateTicketState(slug, file)

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
    <$CustomizeBadge style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
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
              <span>Customize Your Guild Badge</span>
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
              value={props.ticketState.name as string}
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
              value={props.ticketState.symbol as string}
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
                      value={props.ticketState[social.slug] as string}
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
              <BadgeCardCandyWrapper
                backgroundImage={props.ticketState.coverUrl as string}
                logoImage={props.ticketState.logoUrl as string}
                themeColor={props.ticketState.themeColor as string}
                name={props.ticketState.name as string}
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
                    {props.ticketState.logoFile ? '✅' : '⚠️  Upload'} Logo
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
                    {props.ticketState.coverFile ? '✅' : 'Upload'} Cover
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
                  value={props.ticketState.themeColor as string}
                  onChange={(e) => parseInput('themeColor', e.target.value)}
                  style={{
                    width: '80%',
                    textAlign: 'center',
                    border: props.ticketState.themeColor ? `${props.ticketState.themeColor} solid 2px ` : '',
                  }}
                />
              </$Vertical>
            </$Horizontal>
          </$Vertical>
        </div>
      </StepCard>
    </$CustomizeBadge>
  )
})

const $CustomizeBadge = styled.section<{}>`
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

interface BadgeCardCandyWrapperProps {
  backgroundImage: string
  logoImage: string
  badgeImage?: string
  themeColor: string
  name: string
  screen: ScreenSize
}
export const BadgeCardCandyWrapper = (props: BadgeCardCandyWrapperProps) => {
  return (
    <$TicketCardContainer
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

      <$TicketTag>
        <$TagText>{props.name || 'Guild Name'}</$TagText>
      </$TicketTag>
    </$TicketCardContainer>
  )
}

const BASE_CONTAINER = `
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1.5rem;
`

export const $LogoContainer = styled.div`
  flex: 1;
  padding: 2.2rem 2.2rem 1.5rem;
`

export const $TicketCardContainer = styled.section<{ backgroundColor?: string; backgroundImage?: string | undefined }>`
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

const BADGE_FACTORY_NETWORKS = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    themeColor: '#627EEA',
    chainIdHex: '0x1',
    chainIdDecimal: '1',
    isAvailable: true,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FETH_COLORED.png?alt=media',
    validityTokenAddr: '0x83e9f223e1edb3486f876ee888d76bfba26c475a' as ContractAddress,
  },
  {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: '0x38',
    chainIdDecimal: '56',
    isAvailable: true,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    validityTokenAddr: '0x0565805ca3a4105faee51983b0bd8ffb5ce1455c' as ContractAddress,
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    themeColor: '#8F5AE8',
    chainIdHex: '0x89',
    chainIdDecimal: '137',
    isAvailable: false,
    isTestnet: false,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media',
    validityTokenAddr: '' as ContractAddress,
  },
]
interface ValidatePurchasingTokenBalanceProps {
  stage: StepStage
  validateTokenRequirementsMet: (bool: Boolean) => void
}
const ValidatePurchasingTokenBalance = (props: ValidatePurchasingTokenBalanceProps) => {
  const initialErrors = {
    errorBalance: '',
  }
  const { screen } = useWindowSize()
  const [errors, setErrors] = useState(initialErrors)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>()
  const snapUserState = useSnapshot(userState)
  const verifyEligibility = async (erc20Addr: ContractAddress, chainIdHex: ChainIDHex) => {
    console.log(`--- verifying eligibility for ${erc20Addr} on chain ${chainIdHex}`)
    await addCustomEVMChain(chainIdHex)
    console.log(`--- added custom chain ${chainIdHex}`)
    const ethers = window.ethers ? window.ethers : ethersObj
    const { provider } = await getProvider()
    // const signer = await provider.getSigner()
    // console.log(`--- got signer = ${signer._address}`)
    const erc20 = new ethers.Contract(erc20Addr, ERC20ABI)
    console.log(`--- got erc20 = ${erc20Addr}`)
    console.log(erc20)
    const currentUser = (snapUserState.currentAccount || '') as Address
    console.log(`--- got currentUser`)
    console.log(currentUser)
    try {
      // const balance = await erc20.balanceOf(currentUser)
      const balance = await getUserBalanceOfToken(erc20Addr, currentUser)
      console.log(`
        
      Balance = ${balance.toString()}
      
      `)
      if (ethers.BigNumber.from(balance.toString()).gte(ethers.BigNumber.from('200000000000000000000'))) {
        console.log('Passes the validation check')
        setErrors({
          ...errors,
          errorBalance: '',
        })
        props.validateTokenRequirementsMet(true)
      } else {
        setErrors({
          ...errors,
          errorBalance: 'Must have at least 200 GUILD token in your wallet',
        })
        props.validateTokenRequirementsMet(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <$CustomizeBadge style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      <StepCard
        themeColor={selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={() => {}}
        errors={Object.values(errors)}
      >
        <$Vertical>
          <$StepHeading>
            <span>Verify Eligibility</span>
            <HelpIcon tipID="verifyEligibility" />
            <ReactTooltip id="verifyEligibility" place="right" effect="solid">
              Lorem ipsum
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </$StepSubheading>
          <br />
          <$Vertical>
            {BADGE_FACTORY_NETWORKS.map((network) => {
              return (
                <$VerifyGuildTokenButton
                  isSelected={selectedNetwork?.chainIdHex === network.chainIdHex}
                  themeColor={network.themeColor}
                  onClick={async () => {
                    if (network.isAvailable) {
                      await setSelectedNetwork(network)
                      await verifyEligibility(network.validityTokenAddr, network.chainIdHex)
                    }
                  }}
                  key={network.chainIdHex}
                  isAvailable={network.isAvailable}
                >
                  <$NetworkIcon src={network.icon} />
                  {network.isAvailable ? (
                    <$Horizontal flex={1} justifyContent="space-between">
                      <$NetworkName
                        isAvailable={network.isAvailable}
                        isSelected={selectedNetwork?.chainIdHex === network.chainIdHex}
                      >
                        {network.name}
                      </$NetworkName>
                      <$ComingSoon isSelected={selectedNetwork?.chainIdHex === network.chainIdHex}>
                        {network.isTestnet && 'Testnet'}
                      </$ComingSoon>
                    </$Horizontal>
                  ) : (
                    <$Horizontal flex={1} justifyContent="space-between">
                      <$NetworkName>{network.name}</$NetworkName>
                      <$ComingSoon>Coming Soon</$ComingSoon>
                    </$Horizontal>
                  )}
                </$VerifyGuildTokenButton>
              )
            })}
          </$Vertical>
        </$Vertical>
        {screen !== 'mobile' && selectedNetwork && (
          <$Vertical flex={1}>
            <img
              style={{ width: '150px', marginTop: '50px' }}
              src={
                selectedNetwork?.chainIdHex === '0x1'
                  ? 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FGUILD_TOKEN.png?alt=media'
                  : 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FGUILD_TOKEN_BSC.png?alt=media'
              }
            />
          </$Vertical>
        )}
        {screen !== 'mobile' && !selectedNetwork && (
          <$Vertical flex={1}>
            <img
              style={{ width: '150px', marginTop: '50px' }}
              src={
                'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FGUILD_TOKEN_BLACK.png?alt=media'
              }
            />
          </$Vertical>
        )}
      </StepCard>
    </$CustomizeBadge>
  )
}

const $VerifyGuildTokenButton = styled.button<{ isAvailable?: boolean; themeColor?: string; isSelected?: boolean }>`
  width: 300px;
  padding: 8px 10px;
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  justify-content: flex-start;
  border: 0.5px solid #cdcdcd;
  ${(props) => props.isAvailable && 'cursor: pointer'};
  ${(props) =>
    props.themeColor && props.isSelected
      ? `background-color: ${props.themeColor}`
      : props.isAvailable && 'background-color: white'};
  ${(props) => !props.isSelected && props.isAvailable && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`

interface SubmitBadgeFactoryOnPolygonProps {
  stage: StepStage
  selectedNetwork: NetworkOption
  verifyAgreedTerms: (bool: Boolean) => void
  submitStatus: SubmitStatus
  setSubmitStatus: (status: SubmitStatus) => void
  submitBadgeFactory: () => void
  viewBadgeFactory: () => void
}
const SubmitBadgeFactoryOnPolygon = (props: SubmitBadgeFactoryOnPolygonProps) => {
  const initialErrors = {
    errorOne: '',
    errorTwo: '',
  }
  const snapUserState = useSnapshot(userState)
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
  const [termsState, updateTermsState] = useState({
    termA: false,
    termB: false,
  })
  const [errors, setErrors] = useState(initialErrors)
  useEffect(() => {
    if (termsState.termA && termsState.termB) {
      props.verifyAgreedTerms(true)
    }
  }, [termsState])
  const TERMS: TermsFragment[] = [
    {
      slug: 'termA',
      text: 'I agree to conduct business ethically & professionally as a fiduciary to my investors and fellow gamers.',
    },
    {
      slug: 'termB',
      text: 'I agree to the Lootbox Terms & Conditions and release Lootbox DAO from any liability as a permissionless protocol.',
    },
  ]
  const updateCheckbox = (slug: string, checked: any) => {
    updateTermsState({
      ...termsState,
      [slug]: checked,
    })
  }
  const switchChains = async () => {
    await addCustomEVMChain(targetChainIdHex)
    console.log(`--- added custom chain ${targetChainIdHex}`)
  }
  const renderActionBar = () => {
    if (snapUserState.network.currentNetworkIdHex !== targetChainIdHex) {
      return (
        <$CreateBadgeFactory onClick={switchChains} allConditionsMet={true} themeColor={'#5D0076'}>
          {`Continue with Polygon`}
        </$CreateBadgeFactory>
      )
    }
    if (props.stage === 'in_progress') {
      return (
        <$CreateBadgeFactory allConditionsMet={false} disabled themeColor={props.selectedNetwork?.themeColor}>
          Create Guild Badge
        </$CreateBadgeFactory>
      )
    } else if (props.stage === 'may_proceed') {
      if (props.submitStatus === 'failure') {
        return (
          <CreateBadgeFactory
            allConditionsMet={true}
            themeColor={COLORS.dangerFontColor}
            onSubmit={() => props.submitBadgeFactory()}
            text="Failed, try again?"
          />
        )
      } else if (props.submitStatus === 'success') {
        return (
          <$CreateBadgeFactory
            allConditionsMet={true}
            onClick={() => {
              props.viewBadgeFactory()
            }}
            themeColor={COLORS.successFontColor}
          >
            View Your Guild Badge
          </$CreateBadgeFactory>
        )
      } else if (props.submitStatus === 'in_progress') {
        return (
          <$CreateBadgeFactory allConditionsMet={false} disabled themeColor={props.selectedNetwork?.themeColor}>
            {`...submitting (${timeLeft})`}
          </$CreateBadgeFactory>
        )
      }
      return (
        <CreateBadgeFactory
          allConditionsMet={true}
          themeColor={props.selectedNetwork?.themeColor}
          onSubmit={() => {
            setTimeLeft(99)
            props.submitBadgeFactory()
          }}
          text="Create Guild Badge"
        />
      )
    }
    return
  }
  return (
    <$CustomizeBadge style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={() => {}}
        errors={Object.values(errors)}
        customActionBar={
          (props.stage === 'in_progress' || props.stage === 'may_proceed') &&
          Object.values(errors).filter((e) => e).length === 0
            ? renderActionBar
            : undefined
        }
      >
        <$Vertical>
          <$StepHeading>
            <span>Create Badge</span>
            <HelpIcon tipID="verifyEligibility" />
            <ReactTooltip id="verifyEligibility" place="right" effect="solid">
              Lorem ipsum
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </$StepSubheading>
          <br />
          {TERMS.map((term) => {
            return (
              <div
                key={term.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <$TermCheckbox
                  onClick={(e) => updateCheckbox(term.slug, e.currentTarget.checked)}
                  value={term.slug}
                  type="checkbox"
                ></$TermCheckbox>
                <$TermOfService key={term.slug}>{term.text}</$TermOfService>
              </div>
            )
          })}
        </$Vertical>
      </StepCard>
    </$CustomizeBadge>
  )
}

interface CreateBadgeFactoryProps {
  allConditionsMet: boolean
  themeColor?: string
  onSubmit: () => void
  text: string
}
export const CreateBadgeFactory = (props: CreateBadgeFactoryProps) => {
  return (
    <$CreateBadgeFactory
      disabled={!props.allConditionsMet}
      allConditionsMet={props.allConditionsMet}
      onClick={props.onSubmit}
      themeColor={props.themeColor}
    >
      {props.text}
    </$CreateBadgeFactory>
  )
}

const $CreateBadgeFactory = styled.button<{ themeColor?: string; allConditionsMet: boolean }>`
  background-color: ${(props) => (props.allConditionsMet ? props.themeColor : `${props.themeColor}30`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${(props) => (props.allConditionsMet ? 'pointer' : 'not-allowed')};
  color: ${(props) => (props.allConditionsMet ? COLORS.white : `${props.themeColor}40`)};
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  margin: 20px;
  padding: 20px;
`

const INITIAL_TICKET: Record<string, string | File | undefined> = {
  name: '',
  symbol: '',
  themeColor: '#B48AF7',
  logoUrl:
    'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Flogo-placeholder.png?alt=media',
  coverUrl: 'https://img.freepik.com/free-photo/gray-painted-background_53876-94041.jpg',
  badgeUrl: 'https://i.pinimg.com/736x/14/b4/c2/14b4c205eba27ac480719a51adc98169.jpg',
  logoFile: undefined,
  coverFile: undefined,
  twitter: '',
  email: '',
  numberOfScholars: '',
  tiktok: '',
  facebook: '',
  discord: '',
  youtube: '',
  location: '',
  gamesPlayed: '',
  web: '',
}
const BadgeFactory = () => {
  const [provider, loading] = useProvider()
  const snapUserState = useSnapshot(userState)
  const isWalletConnected = snapUserState.accounts.length > 0
  const [stageValidatePurchasingToken, setStageValidatePurchasingToken] = useState<StepStage>('in_progress')
  const [stageCustomizeBadge, setStageCustomizeBadge] = useState<StepStage>('not_yet')
  const [stageAgreeTerms, setStageAgreeTerms] = useState<StepStage>('not_yet')
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('unsubmitted')
  const [badgeFactoryAddress, setBadgeFactoryAddress] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateTicketState = (param: string, value: string | File | undefined) => {
    setTicketState({ ...ticketState, [param]: value })
  }
  const submitBadgeFactory = async () => {
    setSubmitStatus('in_progress')
    const currentUser = (snapUserState.currentAccount || undefined) as Address
    const submissionId = `badge-bcs/${uuidv4()}`
    const [imagePublicPath] = await Promise.all([uploadLootboxLogo(submissionId, ticketState.logoFile as File)])
    console.log(`Submit badge factory image... ${imagePublicPath}`)
    if (!provider) {
      throw new Error('No provider')
    }
    const blockNum = await provider.getBlockNumber()
    const ethers = ethersObj
    const signer = await provider.getSigner()
    const badgeFactory = new ethers.Contract(BADGE_FACTORY_ADDRESS, BADGE_FACTORY_ABI, signer)
    try {
      console.log(`--- Creating badge factory...`)
      await badgeFactory.createBadge(ticketState.name, ticketState.symbol, imagePublicPath, JSON.stringify(ticketState))
      console.log(`Submitted badge factory creation!`)
      const filter = {
        fromBlock: blockNum,
        address: badgeFactory.address,
        topics: [ethers.utils.solidityKeccak256(['string'], ['BadgeCreated(string,address,address,string)'])],
      }
      provider.on(filter, async (log) => {
        if (log !== undefined) {
          const decodedLog = decodeEVMLog({
            eventName: 'BadgeCreated',
            log: log,
            abi: `
            event BadgeCreated(
              string badgeName,
              address indexed badge,
              address indexed issuer,
              string _data
            )`,
            keys: ['badgeName', 'badge', 'issuer', '_data'],
          })
          const { badgeName, badge, issuer, _data } = decodedLog as any
          console.log(`

            --- issuer: ${issuer} vs ${currentUser}
            --- badge: ${badgeName} vs ${ticketState.name}
            --- address = ${badge}

          `)
          console.log(_data)
          if (
            issuer.toLowerCase() === currentUser.toLowerCase() &&
            badgeName.toLowerCase() === (ticketState.name as string).toLowerCase()
          ) {
            console.log(`

              ---- 🎉🎉🎉 ----

              Congratulations! You've created a Badge Factory!

              ${badgeName}
              Badge Factory Address: ${badge}

              ---------------

            `)
            setBadgeFactoryAddress(badge)
            setSubmitStatus('success')
          }
        }
      })
    } catch (e) {
      console.log(e)
      LogRocket.captureException(e)
      setSubmitStatus('failure')
    }
  }
  return (
    <$Vertical>
      <WalletStatus />
      <br />
      <br />
      <div style={isWalletConnected ? {} : { opacity: '0.2', cursor: 'not-allowed' }}>
        <ValidatePurchasingTokenBalance
          stage={stageValidatePurchasingToken}
          validateTokenRequirementsMet={(bool: Boolean) => {
            if (bool) {
              setStageValidatePurchasingToken('may_proceed')
              setStageCustomizeBadge('in_progress')
            } else {
              setStageCustomizeBadge('not_yet')
            }
          }}
        />
      </div>
      <br />
      <br />
      <div style={stageCustomizeBadge === 'not_yet' ? { opacity: '0.2', cursor: 'not-allowed' } : {}}>
        <CustomizeBadge
          stage={stageCustomizeBadge}
          setCustomizeComplete={(bool: Boolean) => {
            if (bool) {
              setStageCustomizeBadge('may_proceed')
              setStageAgreeTerms('in_progress')
            } else {
              setStageCustomizeBadge('not_yet')
            }
          }}
          ticketState={ticketState}
          updateTicketState={updateTicketState}
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
        />
      </div>
      <br />
      <br />
      <div style={stageAgreeTerms === 'not_yet' ? { opacity: '0.2', cursor: 'not-allowed' } : {}}>
        <SubmitBadgeFactoryOnPolygon
          stage={stageAgreeTerms}
          verifyAgreedTerms={(bool: Boolean) => {
            if (bool) {
              setStageAgreeTerms('may_proceed')
            } else {
              setStageAgreeTerms('not_yet')
            }
          }}
          submitStatus={submitStatus}
          setSubmitStatus={setSubmitStatus}
          submitBadgeFactory={() => submitBadgeFactory()}
          viewBadgeFactory={() => {
            window.open(`${BADGE_FACTORY_URL}?badge=${badgeFactoryAddress}`, '_blank')
          }}
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
        />
      </div>
    </$Vertical>
  )
}

export default BadgeFactory
