import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  initDApp,
  updateStateToChain,
  useUserInfo,
  useEthers,
  useWeb3Utils,
  useProvider,
  addCustomEVMChain,
} from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import useWindowSize from 'lib/hooks/useScreenSize'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
import {
  extractURLState_CreateLootboxPage,
  InitialFormStateCreateLootbox,
  InitialFormValidityCreateLootbox,
} from './state'
import StepChooseFunding, {
  validateFundraisingTarget,
  validateReceivingWallet,
} from 'lib/components/CreateLootbox/StepChooseFunding'
import StepChooseNetwork from 'lib/components/CreateLootbox/StepChooseNetwork'
import StepChooseReturns, {
  validatePaybackPeriod,
  validateReturnTarget,
} from 'lib/components/CreateLootbox/StepChooseReturns'
import StepCustomize, {
  validateBiography,
  validateCover,
  validateLogo,
  validateLogoFile,
  validateCoverFile,
  validateName,
  validateSymbol,
  validateThemeColor,
} from 'lib/components/CreateLootbox/StepCustomize'
import StepSocials from 'lib/components/CreateLootbox/StepSocials'
import StepTermsConditions, { SubmitStatus } from 'lib/components/CreateLootbox/StepTermsConditions'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { BigNumber } from 'bignumber.js'
import { Address, BLOCKCHAINS, chainIdHexToSlug, ContractAddress, convertDecimalToHex } from '@wormgraph/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { checkIfValidEmail } from 'lib/api/helpers'
import { initLogging } from 'lib/api/logrocket'
import LogRocket from 'logrocket'
import StepChooseType, { LootboxType } from 'lib/components/CreateLootbox/StepChooseType'
import { createEscrowLootbox, createInstantLootbox } from 'lib/api/createLootbox'
import { manifest } from 'manifest'
import StepMagicLink, { validNetworks, validTypes } from 'lib/components/CreateLootbox/StepMagicLink'
import { ethers } from 'ethers'
import StepPrefillDisclaimer from './StepPrefillDisclaimer/index'
import { uploadLootboxLogo, uploadLootboxCover, LOOTBOX_ASSET_FOLDER } from 'lib/api/firebase/storage'
import { TournamentID } from 'lib/types'

// Multiplies the fundraisingTarget by this value
export const defaultFundraisingLimitMultiplier = 10 // base 2 - examples: 10 = 100%, 11 = 110%
export const defaultFundraisingLimitMultiplierDecimal = 10

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  useEffect(() => {
    initLogging()
    if (window.ethereum) {
      initDApp()
        .then(() => initFromUrlParams())
        .catch((err) => LogRocket.captureException(err))
    } else {
      window.addEventListener('ethereum#initialized', () => initDApp(), {
        once: true,
      })
      setTimeout(() => {
        if (!window.ethereum) {
          alert('Please install MetaMask to use this app. Use the Chrome extension or Metamask mobile app')
        } else {
          initDApp()
            .then(() => {
              initFromUrlParams()
            })
            .catch((err) => LogRocket.captureException(err))
        }
      }, 3000) // 3 seconds
    }
  }, [])
  const [loadedUrlParams, setLoadedUrlParams] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const [provider, loading] = useProvider()
  const web3Utils = useWeb3Utils()
  const isWalletConnected = snapUserState.accounts.length > 0
  const [tournamentId, setTournamentId] = useState<string>('')

  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [preconfigParams, setPreconfigParams] = useState<string[]>([])

  const [doesNetworkMatchProvider, setDoesNetworkMatchProvider] = useState(true)

  const initFromUrlParams = async () => {
    const { INITIAL_URL_PARAMS } = extractURLState_CreateLootboxPage()
    console.log('------- INITIAL_URL_PARAMS -------')
    console.log(INITIAL_URL_PARAMS)
    const prefilledFields = []

    let tempStateObject = {}

    if (INITIAL_URL_PARAMS.network && validNetworks.includes(INITIAL_URL_PARAMS.network || '')) {
      const networkOption = matchNetworkByHex(INITIAL_URL_PARAMS.network)
      if (networkOption) {
        setNetwork(networkOption)
        prefilledFields.push(`Network set to ${networkOption.name}`)
      }
    }
    if (INITIAL_URL_PARAMS.type && validTypes.includes(INITIAL_URL_PARAMS.type || '')) {
      setFundingType(INITIAL_URL_PARAMS.type as LootboxType)
      prefilledFields.push(`Funding type set to ${INITIAL_URL_PARAMS.type}`)
    }
    if (INITIAL_URL_PARAMS.fundingTarget && !isNaN(parseFloat(INITIAL_URL_PARAMS.fundingTarget))) {
      console.log(`Setting funding target... ${INITIAL_URL_PARAMS.fundingTarget}`)
      setFundraisingTarget(web3Utils.toBN(INITIAL_URL_PARAMS.fundingTarget))
      const networkOption = matchNetworkByHex(INITIAL_URL_PARAMS.network || '')
      prefilledFields.push(
        `Funding target set to ${parseFloat(
          ethers.utils.formatUnits(INITIAL_URL_PARAMS.fundingTarget || '0', '18').toString()
        ).toFixed(4)} ${networkOption?.symbol}`
      )
    }
    if (INITIAL_URL_PARAMS.fundingLimit && !isNaN(parseFloat(INITIAL_URL_PARAMS.fundingLimit))) {
      setFundraisingLimit(web3Utils.toBN(INITIAL_URL_PARAMS.fundingLimit))
      const networkOption = matchNetworkByHex(INITIAL_URL_PARAMS.network || '')
      prefilledFields.push(
        `Funding limit set to ${parseFloat(
          ethers.utils.formatUnits(INITIAL_URL_PARAMS.fundingLimit || '0', '18').toString()
        ).toFixed(4)} ${networkOption?.symbol}`
      )
    }
    if (INITIAL_URL_PARAMS.receivingWallet) {
      setReceivingWallet(INITIAL_URL_PARAMS.receivingWallet as Address)
      prefilledFields.push(`Receiving wallet set to ${INITIAL_URL_PARAMS.receivingWallet}`)
    }
    if (INITIAL_URL_PARAMS.returnsTarget && !isNaN(parseInt(INITIAL_URL_PARAMS.returnsTarget))) {
      setBasisPoints(parseInt(INITIAL_URL_PARAMS.returnsTarget))
      prefilledFields.push(
        `Returns target set to ${ethers.utils.formatUnits(INITIAL_URL_PARAMS.returnsTarget || '0', '2').toString()}%`
      )
    }
    if (INITIAL_URL_PARAMS.returnsDate) {
      const paybackDate = new Date(INITIAL_URL_PARAMS.returnsDate)
      if (INITIAL_URL_PARAMS.returnsDate && paybackDate instanceof Date && !isNaN(paybackDate.getTime())) {
        setPaybackDate(INITIAL_URL_PARAMS.returnsDate)
        prefilledFields.push(`Returns date set to ${INITIAL_URL_PARAMS.returnsDate}`)
      }
    }
    if (INITIAL_URL_PARAMS.themeColor) {
      tempStateObject = { ...tempStateObject, lootboxThemeColor: INITIAL_URL_PARAMS.themeColor }
    }
    if (INITIAL_URL_PARAMS.campaignWebsite) {
      updateSocialState('web', INITIAL_URL_PARAMS.campaignWebsite)
      prefilledFields.push(`Lootbox website for more info set to "${INITIAL_URL_PARAMS.campaignWebsite}"`)
    }
    if (INITIAL_URL_PARAMS.campaignBio) {
      tempStateObject = { ...tempStateObject, biography: INITIAL_URL_PARAMS.campaignBio }
      prefilledFields.push(`Lootbox description is already set`)
    }
    if (INITIAL_URL_PARAMS.logoImage) {
      // const decodedLogo = encodeImageURI(INITIAL_URL_PARAMS.logoImage)
      const decodedLogo = INITIAL_URL_PARAMS.logoImage
      tempStateObject = { ...tempStateObject, logoUrl: decodedLogo }
      prefilledFields.push(`Lootbox logo image is already set`)
    }
    if (INITIAL_URL_PARAMS.coverImage) {
      // const decodedCover = encodeImageURI(INITIAL_URL_PARAMS.coverImage)
      const decodedCover = INITIAL_URL_PARAMS.coverImage
      tempStateObject = { ...tempStateObject, coverUrl: decodedCover }
      prefilledFields.push(`Lootbox cover image is already set`)
    }

    if (INITIAL_URL_PARAMS.tournamentId) {
      setTournamentId(INITIAL_URL_PARAMS.tournamentId)
      prefilledFields.push(`Tournament ID is set`)
    }

    // @ts-ignore bullshit typing shit
    setTicketState({ ...ticketState, ...tempStateObject })

    setLoadedUrlParams(true)
    setPreconfigParams(prefilledFields)
  }

  type FormStep =
    | 'stepNetwork'
    | 'stepType'
    | 'stepFunding'
    | 'stepReturns'
    | 'stepCustomize'
    | 'stepSocials'
    | 'stepTerms'

  const INITIAL_FORM_STATE: InitialFormStateCreateLootbox = {
    stepNetwork: 'in_progress',
    stepType: 'not_yet',
    stepFunding: 'not_yet',
    stepReturns: 'not_yet',
    stepCustomize: 'not_yet',
    stepSocials: 'not_yet',
    stepTerms: 'not_yet',
  }
  const [stage, setStage] = useState(INITIAL_FORM_STATE)

  // VALIDITY: Validity of the forms
  const INITIAL_VALIDITY: InitialFormValidityCreateLootbox = {
    stepNetwork: false,
    stepType: false,
    stepFunding: false,
    stepReturns: false,
    stepCustomize: false,
    stepSocials: false,
    stepTerms: false,
  }
  const [validity, setValidity] = useState(INITIAL_VALIDITY)

  // Prevent: Step 2-6 Warning used before declaration
  const now = new Date()
  const numberOfDaysToAdd = 30
  const defaultPaybackDate = new Date(now.setDate(now.getDate() + numberOfDaysToAdd))
  const month = defaultPaybackDate.getMonth() + 1
  const [paybackDate, setPaybackDate] = useState<string>(
    `${defaultPaybackDate.getFullYear()}-${
      month.toString().length === 1 ? `0${month}` : month
    }-${defaultPaybackDate.getDate()}`
    // `${defaultPaybackDate.getFullYear()}-${defaultPaybackDate.getMonth() + 1}-${defaultPaybackDate.getDate()}`
  )
  const [fundingType, setFundingType] = useState<LootboxType>('escrow')
  const reputationWallet = (snapUserState.currentAccount || '') as Address

  const [fundraisingTarget, setFundraisingTarget] = useState(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
  const [fundraisingLimit, setFundraisingLimit] = useState(
    fundraisingTarget
      .mul(web3Utils.toBN(defaultFundraisingLimitMultiplier))
      .div(web3Utils.toBN(defaultFundraisingLimitMultiplierDecimal))
  )

  // STEP 1: Choose Network
  const [network, setNetwork] = useState<NetworkOption>()
  const selectNetwork = async (network: NetworkOption, step: FormStep) => {
    await addCustomEVMChain(network.chainIdHex)
    setNetwork(network)
    if (network && reputationWallet) {
      setStage({
        ...stage,
        [step]: 'may_proceed',
      })
    }
  }
  const checkNetworkStepDone = () => {
    return isWalletConnected && network && reputationWallet && reputationWallet.length > 0 && doesNetworkMatchProvider
  }

  // STEP 2: Choose Type
  const refStepType = useRef<HTMLDivElement | null>(null)
  const checkTypeStepDone = () => {
    return fundingType && fundingType.length > 0
  }

  // STEP 2: Choose Funding
  const refStepFunding = useRef<HTMLDivElement | null>(null)
  const [receivingWallet, setReceivingWallet] = useState<Address | undefined>(
    (snapUserState.currentAccount || undefined) as Address
  )
  const checkFundingStepDone = () => {
    return validateFundraisingTarget(fundraisingTarget) && validateReceivingWallet(reputationWallet)
  }

  // STEP 3: Choose Returns
  const refStepReturns = useRef<HTMLDivElement | null>(null)
  const [basisPoints, setBasisPoints] = useState(1000) // 1000 basis points => 10% return
  const [payoutUSD, setPayoutUSD] = useState(web3Utils.toBN(0))
  const checkReturnsStepDone = () => validateReturnTarget(basisPoints) && validatePaybackPeriod(paybackDate)

  // STEP 4: Customize Ticket
  const refStepCustomize = useRef<HTMLDivElement | null>(null)
  const INITIAL_TICKET: Record<string, string | number> & { logoFile?: File; coverFile?: File; badgeFile?: File } = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: 0.05,
    lootboxThemeColor: '#000000',
    /** @deprecated logoUrls are now from internal gbucket - use logoFile instead */
    logoUrl: '',
    /** @deprecated logoUrls are now from internal gbucket - use coverFile instead*/
    coverUrl: '',
    badgeUrl: '',
  }
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  const updateTicketState = (slug: string, value: string | number) => {
    setTicketState({ ...ticketState, [slug]: value })
  }
  const checkCustomizeStepDone = () => {
    return (
      validateName(ticketState.name as string) &&
      validateSymbol(ticketState.symbol as string) &&
      validateBiography(ticketState.biography as string) &&
      validateThemeColor(ticketState.lootboxThemeColor as string) &&
      (validateLogo(ticketState.logoUrl as string) || validateLogoFile(ticketState.logoFile as File)) &&
      (validateCover(ticketState.coverUrl as string) || validateCoverFile(ticketState.coverFile as File))
    )
  }

  // STEP 5: Socials
  const refStepSocials = useRef<HTMLDivElement | null>(null)
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
  const updateSocialState = (slug: string, text: string) => {
    setSocialState({ ...socialState, [slug]: text })
  }
  const checkSocialStateDone = () => checkIfValidEmail(socialState.email)

  // STEP 6: Terms & Conditions
  const refStepTerms = useRef<HTMLDivElement | null>(null)
  const INITIAL_TERMS: Record<string, boolean> = {
    agreeEthics: false,
    agreeLiability: false,
    agreeVerify: false,
  }
  const [termsState, setTermsState] = useState(INITIAL_TERMS)
  const updateTermsState = (slug: string, bool: boolean) => {
    setTermsState({ ...termsState, [slug]: bool })
  }
  const checkTermsStepDone = () =>
    termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && receivingWallet

  const { requestAccounts } = useUserInfo()
  const connectWallet = async () => {
    const result = await requestAccounts()
    if (result.success && provider) {
      const network = await provider.getNetwork()
      const chainIdHex = convertDecimalToHex(network.chainId.toString())
      const chainSlug = chainIdHexToSlug(chainIdHex)
      if (chainSlug) {
        const blockchain = BLOCKCHAINS[chainSlug]
        if (blockchain) {
          updateStateToChain(blockchain)
        }
      }
    }
  }

  // STEP 7: Submit
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('unsubmitted')
  const checkAllConditionsMet = () => {
    const allValidationsPassed = Object.values(validity).every((condition) => condition === true)

    const conditionsMet: boolean[] = []
    stage.stepNetwork === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepFunding === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepReturns === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepCustomize === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepSocials === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepTerms === 'may_proceed' ? conditionsMet.push(true) : conditionsMet.push(false)
    reputationWallet ? conditionsMet.push(true) : conditionsMet.push(false)
    const allConditionsMet = conditionsMet.every((condition) => condition === true)

    return allValidationsPassed && allConditionsMet
  }

  const createLootbox = async () => {
    setSubmitStatus('pending_confirmation')
    const current = snapUserState.currentAccount ? (snapUserState.currentAccount as String).toLowerCase() : ''
    if (!snapUserState?.network?.currentNetworkIdHex) {
      throw new Error('Network not set')
    }
    if (fundingType === 'instant') {
      console.log(`Generating Instant Lootbox...`)
      await createInstantLootbox(
        provider,
        setSubmitStatus,
        {
          name: ticketState.name as string,
          symbol: ticketState.symbol as string,
          biography: ticketState.biography as string,
          lootboxThemeColor: ticketState.lootboxThemeColor as string,
          logoFile: ticketState.logoFile as File,
          coverFile: ticketState.coverFile as File,
          logoUrl: ticketState.logoUrl as string,
          coverUrl: ticketState.coverUrl as string,
          badgeFile: ticketState.badgeFile as File,
          fundraisingTarget: fundraisingTarget as BigNumber,
          fundraisingTargetMax: fundraisingLimit as BigNumber,
          receivingWallet: receivingWallet as Address,
          currentAccount: current as Address,
          setLootboxAddress: (address: ContractAddress) => setLootboxAddress(address),
          basisPoints,
          returnAmountTarget: payoutUSD?.toString() || '0',
          paybackDate: paybackDate,
          downloaded,
          setDownloaded: (downloaded: boolean) => setDownloaded(downloaded),
          tournamentId: tournamentId as TournamentID,
        },
        socialState,
        snapUserState.network.currentNetworkIdHex
      )
    } else {
      console.log(`Generating Escrow/Tournament Lootbox...`)
      await createEscrowLootbox(
        provider,
        setSubmitStatus,
        {
          name: ticketState.name as string,
          symbol: ticketState.symbol as string,
          biography: ticketState.biography as string,
          lootboxThemeColor: ticketState.lootboxThemeColor as string,
          logoFile: ticketState.logoFile as File,
          coverFile: ticketState.coverFile as File,
          logoUrl: ticketState.logoUrl as string,
          coverUrl: ticketState.coverUrl as string,
          badgeFile: ticketState.badgeFile as File,
          fundraisingTarget: fundraisingTarget as BigNumber,
          fundraisingTargetMax: fundraisingLimit as BigNumber,
          receivingWallet: receivingWallet as Address,
          currentAccount: current as Address,
          setLootboxAddress: (address: ContractAddress) => setLootboxAddress(address),
          basisPoints,
          returnAmountTarget: payoutUSD?.toString() || '0',
          paybackDate: paybackDate,
          downloaded,
          setDownloaded: (downloaded: boolean) => setDownloaded(downloaded),
          tournamentId: tournamentId as TournamentID,
        },
        socialState,
        snapUserState.network.currentNetworkIdHex
      )
    }
  }

  const goToLootboxAdminPage = () => {
    return `${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${lootboxAddress}`
  }

  if (checkNetworkStepDone() && stage.stepNetwork !== 'may_proceed') {
    setStage({
      ...stage,
      stepNetwork: 'may_proceed',
    })
    setValidity({
      ...validity,
      stepNetwork: true,
    })
  }
  if (checkNetworkStepDone() && checkTypeStepDone() && stage.stepType !== 'may_proceed') {
    setStage({
      ...stage,
      stepType: 'may_proceed',
    })
    setValidity({
      ...validity,
      stepType: true,
    })
  }
  if (
    checkNetworkStepDone() &&
    checkTypeStepDone() &&
    checkFundingStepDone() &&
    reputationWallet.length > 0 &&
    stage.stepFunding !== 'may_proceed'
  ) {
    setStage({
      ...stage,
      stepFunding: 'may_proceed',
    })
    setValidity({
      ...validity,
      stepFunding: true,
    })
  } else if (stage.stepNetwork === 'may_proceed' && !checkFundingStepDone() && stage.stepFunding !== 'in_progress') {
    setStage({
      ...stage,
      stepFunding: 'in_progress',
    })
  }
  if (snapUserState.currentAccount && receivingWallet === undefined) {
    setReceivingWallet(snapUserState.currentAccount as Address)
  }
  if (
    checkNetworkStepDone() &&
    checkTypeStepDone() &&
    checkFundingStepDone() &&
    checkReturnsStepDone() &&
    stage.stepReturns !== 'may_proceed'
  ) {
    setStage({
      ...stage,
      stepReturns: 'may_proceed',
    })
    setValidity({
      ...validity,
      stepReturns: true,
    })
  } else if (stage.stepFunding === 'may_proceed' && !checkReturnsStepDone() && stage.stepReturns !== 'in_progress') {
    setStage({
      ...stage,
      stepReturns: 'in_progress',
    })
  }
  if (
    checkNetworkStepDone() &&
    checkTypeStepDone() &&
    checkFundingStepDone() &&
    checkReturnsStepDone() &&
    checkCustomizeStepDone() &&
    stage.stepCustomize !== 'may_proceed'
  ) {
    setStage({
      ...stage,
      stepCustomize: 'may_proceed',
    })
  } else if (
    stage.stepReturns === 'may_proceed' &&
    !checkCustomizeStepDone() &&
    stage.stepCustomize !== 'in_progress'
  ) {
    setStage({
      ...stage,
      stepCustomize: 'in_progress',
    })
  }
  if (
    checkNetworkStepDone() &&
    checkTypeStepDone() &&
    checkFundingStepDone() &&
    checkReturnsStepDone() &&
    checkCustomizeStepDone() &&
    checkSocialStateDone() &&
    stage.stepSocials !== 'may_proceed'
  ) {
    setStage({
      ...stage,
      stepSocials: 'may_proceed',
    })
  } else if (stage.stepCustomize === 'may_proceed' && !checkSocialStateDone() && stage.stepSocials !== 'in_progress') {
    setStage({
      ...stage,
      stepSocials: 'in_progress',
    })
  }
  if (
    checkNetworkStepDone() &&
    checkTypeStepDone() &&
    checkFundingStepDone() &&
    checkReturnsStepDone() &&
    checkCustomizeStepDone() &&
    checkSocialStateDone() &&
    checkTermsStepDone() &&
    stage.stepTerms !== 'may_proceed'
  ) {
    setStage({
      ...stage,
      stepTerms: 'may_proceed',
    })
  } else if (stage.stepSocials === 'may_proceed' && !checkTermsStepDone() && stage.stepTerms !== 'in_progress') {
    setStage({
      ...stage,
      stepTerms: 'in_progress',
    })
  }

  return (
    <$CreateLootbox>
      {preconfigParams && preconfigParams.length > 0 && (
        <div style={{ width: '100%' }}>
          <StepPrefillDisclaimer
            tournamentId={tournamentId as TournamentID | undefined}
            selectedNetwork={network}
            prefilledFields={preconfigParams}
          />
          <$Spacer></$Spacer>
        </div>
      )}
      <StepChooseNetwork
        selectedNetwork={network}
        stage={stage.stepNetwork}
        onSelectNetwork={(network: NetworkOption) => {
          selectNetwork(network, 'stepNetwork')
        }}
        onNext={() => refStepType.current?.scrollIntoView()}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepNetwork: bool })}
        setDoesNetworkMatch={(bool: boolean) => setDoesNetworkMatchProvider(bool)}
      />
      <$Spacer></$Spacer>
      <StepChooseType
        ref={refStepType}
        selectedType={fundingType}
        selectedNetwork={network}
        stage={stage.stepType}
        onSelectType={setFundingType}
        onNext={() => refStepFunding.current?.scrollIntoView()}
        setValidity={(bool: boolean) => console.log(bool)}
      />
      <$Spacer></$Spacer>
      {loadedUrlParams && (
        <StepChooseFunding
          ref={refStepFunding}
          type={fundingType}
          selectedNetwork={network}
          fundraisingLimit={fundraisingLimit}
          fundraisingTarget={fundraisingTarget}
          setFundraisingLimit={(limit: BigNumber) => setFundraisingLimit(limit)}
          setFundraisingTarget={(target: BigNumber) => setFundraisingTarget(target)}
          receivingWallet={receivingWallet === undefined ? reputationWallet : receivingWallet}
          setReceivingWallet={setReceivingWallet}
          stage={stage.stepFunding}
          setValidity={(bool: boolean) => setValidity({ ...validity, stepFunding: bool })}
          onNext={() => refStepReturns.current?.scrollIntoView()}
        />
      )}

      <$Spacer></$Spacer>
      <StepChooseReturns
        ref={refStepReturns}
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        basisPoints={basisPoints}
        setBasisPoints={(basisPoints: number) => setBasisPoints(basisPoints)}
        setPayoutUSDPrice={(payout) => setPayoutUSD(payout)}
        paybackDate={paybackDate}
        setPaybackDate={(date: string) => setPaybackDate(date)}
        stage={stage.stepReturns}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepReturns: bool })}
        onNext={() => refStepCustomize.current?.scrollIntoView()}
      />
      <$Spacer></$Spacer>
      <StepCustomize
        ref={refStepCustomize}
        fundraisingTarget={fundraisingTarget}
        ticketState={ticketState}
        updateTicketState={updateTicketState}
        selectedNetwork={network}
        stage={stage.stepCustomize}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepCustomize: bool })}
        onNext={() => refStepSocials.current?.scrollIntoView()}
      />
      <$Spacer></$Spacer>
      <StepSocials
        ref={refStepSocials}
        socialState={socialState}
        updateSocialState={updateSocialState}
        selectedNetwork={network}
        stage={stage.stepSocials}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepSocials: bool })}
        onNext={() => refStepTerms.current?.scrollIntoView()}
      />
      <$Spacer></$Spacer>
      <StepTermsConditions
        ref={refStepTerms}
        allConditionsMet={checkAllConditionsMet()}
        termsState={termsState}
        updateTermsState={updateTermsState}
        selectedNetwork={network}
        stage={stage.stepTerms}
        reputationWallet={reputationWallet}
        treasuryWallet={receivingWallet === undefined ? reputationWallet : receivingWallet}
        updateTreasuryWallet={setReceivingWallet}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepTerms: bool })}
        onNext={() => console.log('onNext')}
        submitStatus={submitStatus}
        onSubmit={() => createLootbox()}
        goToLootboxAdminPage={goToLootboxAdminPage}
      />
      <$Vertical style={{ marginTop: '20px' }}>
        {!doesNetworkMatchProvider ? (
          <$Horizontal flex={1} justifyContent="flex-start" verticalCenter>
            <span style={{ marginRight: '10px' }}>⚠️</span>
            <span style={{ fontFamily: 'sans-serif' }}>{`MetaMask is on the wrong network`}</span>
          </$Horizontal>
        ) : null}
        {Object.keys(validity)
          .filter((key: FormStep) => !validity[key])
          .map((key: FormStep) => {
            return (
              <$Horizontal flex={1} justifyContent="flex-start" verticalCenter>
                <span style={{ marginRight: '10px' }}>⚠️</span>
                <span style={{ fontFamily: 'sans-serif' }}>{`${key.replace('step', '')} not completed`}</span>
              </$Horizontal>
            )
          })}
        {!reputationWallet ? (
          <$Horizontal
            onClick={connectWallet}
            flex={1}
            justifyContent="flex-start"
            verticalCenter
            style={{ cursor: 'pointer' }}
          >
            <span style={{ marginRight: '10px' }}>⚠️</span>
            <span style={{ fontFamily: 'sans-serif', textDecoration: 'underline' }}>{`Wallet not connected`}</span>
          </$Horizontal>
        ) : null}
      </$Vertical>
      <$Spacer></$Spacer>
      <StepMagicLink
        network={network?.chainIdHex}
        type={fundingType}
        fundingTarget={fundraisingTarget.toString()}
        fundingLimit={fundraisingLimit.toString()}
        receivingWallet={receivingWallet}
        returnsTarget={basisPoints.toString()}
        returnsDate={paybackDate}
        logoImage={undefined}
        coverImage={undefined}
        themeColor={ticketState.themeColor as string}
        campaignBio={ticketState.biography as string}
        campaignWebsite={socialState.web}
        uploadLogo={async (submissionId: string) => {
          if (!ticketState.logoFile && !ticketState.logoUrl) {
            throw new Error('Logo not set')
          }
          const imagePublicPath = ticketState.logoFile
            ? await uploadLootboxLogo(submissionId, ticketState.logoFile)
            : (ticketState.logoUrl as string)

          return imagePublicPath
        }}
        uploadCover={async (submissionId: string) => {
          if (!ticketState.coverFile && !ticketState.coverUrl) {
            throw new Error('Cover not set')
          }

          const coverPublicPath = ticketState.coverFile
            ? await uploadLootboxCover(submissionId, ticketState.coverFile)
            : (ticketState.coverUrl as string)

          return coverPublicPath
        }}
        stage="in_progress"
        selectedNetwork={network}
        tournamentId={tournamentId}
      />
      <$Spacer></$Spacer>
    </$CreateLootbox>
  )
}

const $CreateLootbox = styled.div<{}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 800px;
`

const $Spacer = styled.div<{}>`
  width: 100%;
  height: 100px;
`

export default CreateLootbox
