import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { initDApp, updateStateToChain, useUserInfo, useWeb3, useWeb3Eth, useWeb3Utils } from 'lib/hooks/useWeb3Api'
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
import { getPriceFeed } from 'lib/hooks/useContract'
import { Address, BLOCKCHAINS, chainIdHexToSlug, ContractAddress, convertHexToDecimal } from '@lootboxfund/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { checkIfValidEmail } from 'lib/api/helpers'
import { manifest } from '../../../manifest'

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  useEffect(() => {
    window.onload = () => {
      console.log('Initializing DApp...')
      initDApp('https://data-seed-prebsc-1-s1.binance.org:8545/').catch((err) => console.error(err))
    }
  }, [])

  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const web3 = useWeb3()
  const web3Eth = useWeb3Eth()
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
  const selectNetwork = (network: NetworkOption, step: FormStep) => {
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
  if (!nativeTokenPrice) {
    getLatestPrice()
  }
  const checkNetworkStepDone = () => {
    return network && reputationWallet && reputationWallet.length > 0
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

  // STEP 2: Choose Funding
  const refStepFunding = useRef<HTMLDivElement | null>(null)
  const [receivingWallet, setReceivingWallet] = useState<Address | undefined>(
    (snapUserState.currentAccount || undefined) as Address
  )
  if (snapUserState.currentAccount && receivingWallet === undefined) {
    setReceivingWallet(snapUserState.currentAccount as Address)
  }
  const checkFundingStepDone = () => {
    return validateFundraisingTarget(fundraisingTarget) && validateReceivingWallet(reputationWallet, web3Utils)
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

  // STEP 3: Choose Returns
  const refStepReturns = useRef<HTMLDivElement | null>(null)
  const [basisPoints, setBasisPoints] = useState(10)
  const checkReturnsStepDone = () => validateReturnTarget(basisPoints) && validatePaybackPeriod(paybackDate)
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

  // STEP 4: Customize Ticket
  const refStepCustomize = useRef<HTMLDivElement | null>(null)
  const INITIAL_TICKET: Record<string, string | number> = {
    name: '',
    symbol: '',
    biography: '',
    pricePerShare: 0.05,
    lootboxThemeColor: '#B48AF7',
    logoUrl:
      'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media',
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
    validateCover(ticketState.coverUrl as string)
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

  const { requestAccounts } = useUserInfo()
  const connectWallet = async () => {
    const result = await requestAccounts()
    if (result.success) {
      const userAccounts = await window.web3.eth.getAccounts()
      userState.currentAccount = userAccounts[0]
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
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
    setSubmitStatus('in_progress')
    const LOOTBOX_FACTORY_ADDRESS = manifest.lootbox.contracts.LootboxFactory.address
    const blockNum = await web3Eth.getBlockNumber()
    const pricePerShare = new web3Utils.BN(web3Utils.toWei(ticketState.pricePerShare.toString(), 'gwei')).div(
      new web3Utils.BN('10')
    )
    const maxSharesSold = fundraisingTarget
      .mul(new web3Utils.BN(nativeTokenPrice.toString()))
      .div(pricePerShare)
      .mul(new web3Utils.BN('11'))
      .div(new web3Utils.BN('10'))
      .toString()

    const lootbox = new web3Eth.Contract(LOOTBOX_FACTORY_ABI, LOOTBOX_FACTORY_ADDRESS, {
      from: snapUserState.currentAccount,
      gas: '1000000',
    })
    try {
      console.log(`----> creating lootbox with info...`)
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
      const x = await lootbox.methods
        .createLootbox(
          ticketState.name,
          ticketState.symbol,
          maxSharesSold, // uint256 _maxSharesSold,
          pricePerShare, // uint256 _sharePriceUSD,
          receivingWallet,
          receivingWallet
        )
        .send()
      let options = {
        filter: {
          value: [],
        },
        fromBlock: blockNum,
        topics: [web3Utils.sha3('LootboxCreated(string,address,address,address,uint256,uint256)')],
        from: snapUserState.currentAccount,
      }
      lootbox.events.LootboxCreated(options).on('data', (event: any) => {
        const { issuer, lootbox, lootboxName, maxSharesSold, sharePriceUSD, treasury } = event.returnValues

        if (issuer === snapUserState.currentAccount && treasury === receivingWallet) {
          console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created a lootbox!
          Lootbox Address: ${lootbox}
  
          ---------------
          
          `)
          setLootboxAddress(lootbox)
          setSubmitStatus('success')
          const basisPointsReturnTarget = new web3Utils.BN(basisPoints.toString())
            .add(new web3Utils.BN('100')) // make it whole
            .mul(new web3Utils.BN('10').pow(new web3Utils.BN((8 - 6).toString())))
            .mul(fundraisingTarget)
            .div(new web3Utils.BN('10').pow(new web3Utils.BN('8')))

          createTokenURIData({
            address: lootbox,
            name: lootboxName,
            description: ticketState.description as string,
            image: ticketState.logoUrl as string,
            backgroundColor: ticketState.lootboxThemeColor as string,
            backgroundImage: ticketState.coverUrl as string,
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
              transactionHash: event.transactionHash as string,
              blockNumber: event.blockNumber,
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
          })
        }
      })
    } catch (e) {
      console.log(e)
      setSubmitStatus('failure')
    }
  }

  const goToLootboxAdminPage = () => {
    return `https://www.lootbox.fund/demo/0-2-0-demo/lootbox?lootbox=${lootboxAddress}`
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
