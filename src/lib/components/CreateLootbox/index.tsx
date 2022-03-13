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
import { subscribe, useSnapshot } from 'valtio'
import useWindowSize from 'lib/hooks/useScreenSize'
import { StepStage } from 'lib/components/CreateLootbox/StepCard'
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
  getMaxTicketPrice,
  validateBiography,
  validateCover,
  validateLogo,
  validateLogoFile,
  validateCoverFile,
  validateName,
  validatePricePerShare,
  validateSymbol,
  validateThemeColor,
} from 'lib/components/CreateLootbox/StepCustomize'
import StepSocials from 'lib/components/CreateLootbox/StepSocials'
import StepTermsConditions, { SubmitStatus } from 'lib/components/CreateLootbox/StepTermsConditions'
import LOOTBOX_FACTORY_ABI from 'lib/abi/LootboxFactory.json'
import { NetworkOption, NETWORK_OPTIONS } from './state'
import { BigNumber } from 'bignumber.js'
import { createTokenURIData } from 'lib/api/storage'
import { uploadLootboxLogo, uploadLootboxCover } from 'lib/api/firebase/storage'
import { getPriceFeed } from 'lib/hooks/useContract'
import {
  Address,
  BLOCKCHAINS,
  chainIdHexToSlug,
  ContractAddress,
  convertDecimalToHex,
  convertHexToDecimal,
  Url,
} from '@lootboxfund/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { checkIfValidEmail } from 'lib/api/helpers'
import { manifest } from '../../../manifest'
import { decodeEVMLog } from 'lib/api/evm'
import { downloadFile, stampNewLootbox } from 'lib/api/stamp'
import { v4 as uuidv4 } from 'uuid'
import { initLogging } from 'lib/api/logrocket';
import LogRocket from 'logrocket'

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  useEffect(() => {
    initLogging()
    if (window.ethereum) {
      initDApp().catch((err) => LogRocket.captureException(err))
    } else {
      window.addEventListener('ethereum#initialized', initDApp, {
        once: true,
      })
      setTimeout(() => {
        if (!window.ethereum) {
          alert('Please install MetaMask to use this app. Use the Chrome extension or Metamask mobile app')
        } else {
          initDApp().catch((err) => LogRocket.captureException(err))
        }
      }, 3000) // 3 seconds
    }
  }, [])
  const [downloaded, setDownloaded] = useState(false)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const [provider, loading] = useProvider()
  const web3Utils = useWeb3Utils()
  const isWalletConnected = snapUserState.accounts.length > 0

  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()

  type FormStep = 'stepNetwork' | 'stepFunding' | 'stepReturns' | 'stepCustomize' | 'stepSocials' | 'stepTerms'

  const INITIAL_FORM_STATE: Record<FormStep, StepStage> = {
    stepNetwork: 'in_progress',
    stepFunding: 'not_yet',
    stepReturns: 'not_yet',
    stepCustomize: 'not_yet',
    stepSocials: 'not_yet',
    stepTerms: 'not_yet',
  }
  const [stage, setStage] = useState(INITIAL_FORM_STATE)

  // VALIDITY: Validity of the forms
  const INITIAL_VALIDITY: Record<FormStep, boolean> = {
    stepNetwork: false,
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
  const reputationWallet = (snapUserState.currentAccount || '') as Address
  const [fundraisingTarget, setFundraisingTarget] = useState(web3Utils.toBN(web3Utils.toWei('1', 'ether')))

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
  const getLatestPrice = async () => {
    if (network?.priceFeed) {
      const nativeTokenPriceEther = await getPriceFeed(network.priceFeed)
      const nativeTokenPrice = nativeTokenPriceEther.multipliedBy(new BigNumber('10').pow('8'))
      setNativeTokenPrice(nativeTokenPrice)
    }
  }
  const checkNetworkStepDone = () => {
    return network && reputationWallet && reputationWallet.length > 0
  }

  // STEP 2: Choose Funding
  const refStepFunding = useRef<HTMLDivElement | null>(null)
  const [receivingWallet, setReceivingWallet] = useState<Address | undefined>(
    (snapUserState.currentAccount || undefined) as Address
  )
  const checkFundingStepDone = () => {
    return validateFundraisingTarget(fundraisingTarget) && validateReceivingWallet(reputationWallet, web3Utils)
  }

  // STEP 3: Choose Returns
  const refStepReturns = useRef<HTMLDivElement | null>(null)
  const [basisPoints, setBasisPoints] = useState(10)
  const checkReturnsStepDone = () => validateReturnTarget(basisPoints) && validatePaybackPeriod(paybackDate)

  // STEP 4: Customize Ticket
  const refStepCustomize = useRef<HTMLDivElement | null>(null)
  const INITIAL_TICKET: Record<string, string | number> & { logoFile?: File; coverFile?: File } = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: 0.05,
    lootboxThemeColor: '#B48AF7',
    /** @deprecated logoUrls are now from internal gbucket - use logoFile instead */
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media',
    /** @deprecated logoUrls are now from internal gbucket - use coverFile instead*/
    coverUrl:
      'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-background.png?alt=media',
  }
  const [ticketState, setTicketState] = useState(INITIAL_TICKET)
  const updateTicketState = (slug: string, value: string | number) => {
    setTicketState({ ...ticketState, [slug]: value })
  }
  const maxPricePerShare = nativeTokenPrice ? getMaxTicketPrice(nativeTokenPrice, fundraisingTarget, web3Utils) : 0
  const checkCustomizeStepDone = () =>
    validateName(ticketState.name as string) &&
    validateSymbol(ticketState.symbol as string) &&
    validateBiography(ticketState.biography as string) &&
    validatePricePerShare(ticketState.pricePerShare as number, maxPricePerShare) &&
    validateThemeColor(ticketState.lootboxThemeColor as string) &&
    validateLogo(ticketState.logoUrl as string) &&
    validateCover(ticketState.coverUrl as string) &&
    validateLogoFile(ticketState.logoFile as File) &&
    validateCoverFile(ticketState.coverFile as File)

  // STEP 5: Socials
  const refStepSocials = useRef<HTMLDivElement | null>(null)
  const INITIAL_SOCIALS: Record<string, string> = {
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
    if (!nativeTokenPrice) {
      console.error('No token price')
      setSubmitStatus('failure')
      return
    }
    if (!provider) {
      throw new Error('No provider')
    }
    if (!ticketState.pricePerShare) {
      throw new Error('Missing share price')
    }
    if (!(ticketState.coverFile && ticketState.logoFile)) {
      throw new Error('Missing images')
    }

    setSubmitStatus('in_progress')
    const LOOTBOX_FACTORY_ADDRESS = manifest.lootbox.contracts.LootboxFactory.address
    const blockNum = await provider.getBlockNumber()

    const pricePerShare = new web3Utils.BN(web3Utils.toWei(ticketState.pricePerShare.toString(), 'gwei')).div(
      new web3Utils.BN('10')
    )
    const maxSharesSold = fundraisingTarget
      .mul(new web3Utils.BN(nativeTokenPrice.toString()))
      .div(pricePerShare)
      .mul(new web3Utils.BN('11'))
      .div(new web3Utils.BN('10'))
      .toString()

    const ethers = useEthers()
    const signer = await provider.getSigner()
    const lootbox = new ethers.Contract(LOOTBOX_FACTORY_ADDRESS, LOOTBOX_FACTORY_ABI, signer)
    const submissionId = uuidv4()
    try {
      const [imagePublicPath, backgroundPublicPath] = await Promise.all([
        uploadLootboxLogo(submissionId, ticketState.logoFile),
        uploadLootboxCover(submissionId, ticketState.coverFile),
      ])

      console.log(`
      
      ticketState.name = ${ticketState.name}
      ticketState.symbol = ${ticketState.symbol}
      maxSharesSold = ${maxSharesSold}
      pricePerShare = ${pricePerShare}
      receivingWallet = ${receivingWallet}
      receivingWallet = ${receivingWallet}

      fundraisingTarget = ${fundraisingTarget}

      nativeTokenPrice = ${nativeTokenPrice.toString()}

      `)
      await lootbox.createLootbox(
        ticketState.name,
        ticketState.symbol,
        maxSharesSold.toString(), // uint256 _maxSharesSold,
        pricePerShare.toString(), // uint256 _sharePriceUSD,
        receivingWallet,
        receivingWallet
      )
      console.log(`Submitted lootbox creation!`)
      const filter = {
        fromBlock: blockNum,
        address: lootbox.address,
        topics: [
          ethers.utils.solidityKeccak256(
            ['string'],
            ['LootboxCreated(string,address,address,address,uint256,uint256)']
          ),
        ],
      }
      provider.on(filter, async (log) => {
        if (log !== undefined) {
          const decodedLog = decodeEVMLog({
            eventName: 'LootboxCreated',
            log: log,
            abi: `
            event LootboxCreated(
              string lootboxName,
              address indexed lootbox,
              address indexed issuer,
              address indexed treasury,
              uint256 maxSharesSold,
              uint256 sharePriceUSD
            )`,
            keys: ['lootboxName', 'lootbox', 'issuer', 'treasury', 'maxSharesSold', 'sharePriceUSD'],
          })
          const { issuer, lootbox, lootboxName, maxSharesSold, sharePriceUSD, treasury } = decodedLog as any
          const receiver = receivingWallet ? receivingWallet.toLowerCase() : ''
          const current = snapUserState.currentAccount ? (snapUserState.currentAccount as String).toLowerCase() : ''
          if (issuer.toLowerCase() === current && treasury.toLowerCase() === receiver) {
            console.log(`
            
            ---- 🎉🎉🎉 ----
            
            Congratulations! You've created a lootbox!
            Lootbox Address: ${lootbox}
    
            ---------------
            
            `)
            setLootboxAddress(lootbox)
            const basisPointsReturnTarget = new web3Utils.BN(basisPoints.toString())
              .add(new web3Utils.BN('100')) // make it whole
              .mul(new web3Utils.BN('10').pow(new web3Utils.BN((8 - 6).toString())))
              .mul(fundraisingTarget)
              .div(new web3Utils.BN('10').pow(new web3Utils.BN('8')))

            const ticketID = '0x'
            const numShares = ethers.utils.formatEther(maxSharesSold)
            const [stampUrl] = await Promise.all([
              stampNewLootbox({
                // backgroundImage: ticketState.coverUrl as Url,
                // logoImage: ticketState.logoUrl as Url,
                logoImage: imagePublicPath,
                backgroundImage: backgroundPublicPath,
                themeColor: ticketState.lootboxThemeColor as string,
                name: lootboxName,
                ticketID,
                lootboxAddress: lootbox,
                chainIdHex: manifest.chain.chainIDHex,
                numShares,
              }),
              createTokenURIData({
                address: lootbox,
                name: lootboxName,
                description: ticketState.description as string,
                // image: ticketState.logoUrl as string,
                image: imagePublicPath,
                backgroundColor: ticketState.lootboxThemeColor as string,
                // backgroundImage: ticketState.coverUrl as string,
                backgroundImage: backgroundPublicPath,
                lootbox: {
                  address: lootbox,
                  chainIdHex: manifest.chain.chainIDHex,
                  chainIdDecimal: convertHexToDecimal(manifest.chain.chainIDHex),
                  chainName: manifest.chain.chainName,
                  targetPaybackDate: paybackDate ? new Date(paybackDate) : new Date(),
                  fundraisingTarget: fundraisingTarget,
                  basisPointsReturnTarget: basisPoints.toString(),
                  returnAmountTarget: basisPointsReturnTarget.toString(),
                  pricePerShare: pricePerShare.toString(),
                  lootboxThemeColor: ticketState.lootboxThemeColor as string,
                  transactionHash: log.transactionHash as string,
                  blockNumber: log.blockNumber,
                },
                socials: {
                  twitter: socialState.twitter,
                  email: socialState.email,
                  instagram: socialState.instagram,
                  tiktok: socialState.tiktok,
                  facebook: socialState.facebook,
                  discord: socialState.discord,
                  youtube: socialState.youtube,
                  snapchat: socialState.snapchat,
                  twitch: socialState.twitch,
                  web: socialState.web,
                },
              }),
            ])
            console.log(`Stamp URL: ${stampUrl}`)
            if (stampUrl && !downloaded) {
              await downloadFile(`${lootboxName}-${lootbox}`, stampUrl)
              setDownloaded(true)
            }
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

  const goToLootboxAdminPage = () => {
    return `https://www.lootbox.fund/demo/0-2-3-demo/lootbox?lootbox=${lootboxAddress}`
  }

  if (!nativeTokenPrice) {
    getLatestPrice()
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
  if (
    checkNetworkStepDone() &&
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
      <StepChooseNetwork
        selectedNetwork={network}
        stage={stage.stepNetwork}
        onSelectNetwork={(network: NetworkOption) => {
          selectNetwork(network, 'stepNetwork')
        }}
        onNext={() => refStepFunding.current?.scrollIntoView()}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepNetwork: bool })}
      />
      <$Spacer></$Spacer>
      <StepChooseFunding
        ref={refStepFunding}
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        setFundraisingTarget={(target: BigNumber) => setFundraisingTarget(target)}
        receivingWallet={receivingWallet === undefined ? reputationWallet : receivingWallet}
        setReceivingWallet={setReceivingWallet}
        stage={stage.stepFunding}
        setValidity={(bool: boolean) => setValidity({ ...validity, stepFunding: bool })}
        onNext={() => refStepReturns.current?.scrollIntoView()}
      />
      <$Spacer></$Spacer>
      <StepChooseReturns
        ref={refStepReturns}
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        basisPoints={basisPoints}
        setBasisPoints={(basisPoints: number) => setBasisPoints(basisPoints)}
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
