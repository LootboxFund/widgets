import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import { initDApp, updateStateToChain, useUserInfo, useWeb3, useWeb3Eth, useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import WalletButton from 'lib/components/WalletButton';
import {StepStage} from 'lib/components/StepCard';
import StepChooseFunding from 'lib/components/CreateLootbox/StepChooseFunding';
import StepChooseNetwork from 'lib/components/CreateLootbox/StepChooseNetwork';
import StepChooseReturns from 'lib/components/CreateLootbox/StepChooseReturns';
import StepCustomize from 'lib/components/CreateLootbox/StepCustomize';
import StepSocials from 'lib/components/CreateLootbox/StepSocials';
import StepTermsConditions, { SubmitStatus } from 'lib/components/CreateLootbox/StepTermsConditions';
import LOOTBOX_FACTORY_ABI from 'lib/abi/LootboxFactory.json'
import { NetworkOption } from './state'
import { BigNumber } from 'bignumber.js';
import { createTokenURIData } from 'lib/api/storage'
import { Address } from 'lib/types/baseTypes'
import { getPriceFeed } from 'lib/hooks/useContract'

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
 
  useEffect(() => {
    window.onload = () => {
      console.log("Initializing DApp...")
      initDApp('https://data-seed-prebsc-1-s1.binance.org:8545/')
        .catch((err) => console.error(err))
    }
  }, [])

  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize();
  const web3 = useWeb3()
  const web3Eth = useWeb3Eth()
  const web3Utils = useWeb3Utils()
  const isWalletConnected = snapUserState.accounts.length > 0;

  const [lootboxAddress, setLootboxAddress] = useState<Address>("")
  const [nativeTokenPrice, setNativeTokenPrice] = useState<BigNumber>()
  
  type FormStep = "stepNetwork" | "stepFunding" | "stepReturns" | "stepCustomize" | "stepSocials" | "stepTerms"
  
  // FORM: Step by Step Form
  const linkedListFormSteps: Record<FormStep,FormStep> = {
    stepNetwork: "stepFunding",
    stepFunding: "stepReturns",
    stepReturns: "stepCustomize",
    stepCustomize: "stepSocials",
    stepSocials: "stepTerms",
    stepTerms: "stepTerms"
  }
  const INITIAL_FORM_STATE: Record<FormStep, StepStage> = {
    stepNetwork: "in_progress",
    stepFunding: "not_yet",
    stepReturns: "not_yet",
    stepCustomize: "not_yet",
    stepSocials: "not_yet",
    stepTerms: "not_yet",
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

  // Prevent: Step 2 Warning used before declaration
  const now = new Date();
  const numberOfDaysToAdd = 30;
  const defaultPaybackDate = new Date(now.setDate(now.getDate() + numberOfDaysToAdd));
  const [paybackDate, setPaybackDate] = useState<string>();

  // STEP 1: Choose Network
  const [network, setNetwork] = useState<NetworkOption>()
  const selectNetwork = (network: NetworkOption, step: FormStep) => {
    setNetwork(network)
    setStage({
      ...stage,
      [step]: "may_proceed"
    })
  }
  useEffect(() => {
    const thisStep = "stepNetwork";
    if (network) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: "in_progress"
      })
    }
  }, [network])

  useEffect(() => {
    getLatestPrice()
  }, [network])
  
  const getLatestPrice = async () => {
    if (network?.priceFeed) {
        const nativeTokenPrice = await getPriceFeed(network.priceFeed)
        setNativeTokenPrice(nativeTokenPrice)
    }
  }

  // STEP 2: Choose Funding
  const refStepFunding = useRef<HTMLDivElement | null>(null)
  const [fundraisingTarget, setFundraisingTarget] = useState(web3Utils.toBN(web3Utils.toWei("1", "ether")));
  const [receivingWallet, setReceivingWallet] = useState<string>("");
  useEffect(() => {
    const thisStep = "stepFunding";
    if (fundraisingTarget && receivingWallet) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: checkReturnsStepDone() ? "may_proceed" : "in_progress"
      })
      // setPaybackDate(defaultPaybackDate.toDateString())
      // setValidity({...validity, stepReturns: true})
    } else if (stage[thisStep] === "may_proceed") {
      setStage({
        ...stage,
        [thisStep]: "in_progress"
      })
    }
  }, [fundraisingTarget, receivingWallet])
  const checkFundingStepDone = () => {
    return fundraisingTarget && receivingWallet
  }

  // STEP 3: Choose Returns
  const refStepReturns = useRef<HTMLDivElement | null>(null)
  const [basisPoints, setBasisPoints] = useState(10);
  useEffect(() => {
    const thisStep = "stepReturns";
    if (basisPoints && paybackDate) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: checkCustomizeStepDone() ? "may_proceed" : "in_progress"
      })
    } else if (stage[thisStep] === "may_proceed") {
      setStage({
        ...stage,
        [thisStep]: "in_progress"
      })
    }
  }, [basisPoints, paybackDate])
  const checkReturnsStepDone = () => basisPoints && paybackDate

  // STEP 4: Customize Ticket
  const refStepCustomize = useRef<HTMLDivElement | null>(null)
  const INITIAL_TICKET: Record<string, string | number> = {
    name: "",
    symbol: '',
    biography: '',
    pricePerShare: 0.05,
    lootboxThemeColor: "#B48AF7",
    logoUrl: "https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media",
    coverUrl: "https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-background.png?alt=media",
  }
  const [ticketState, setTicketState] = useState(INITIAL_TICKET);
  const updateTicketState = (slug: string, value: string | number) => {
    setTicketState({ ...ticketState, [slug]: value })
  }
  useEffect(() => {
    const thisStep = "stepCustomize";
    if (ticketState.name && ticketState.symbol && ticketState.biography && ticketState.pricePerShare && ticketState.lootboxThemeColor && ticketState.logoUrl && ticketState.coverUrl) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: checkSocialStateDone() ? "may_proceed" : "in_progress"
      })
    } else if (stage[thisStep] === "may_proceed") {
      setStage({
        ...stage,
        [thisStep]: "in_progress"
      })
    }
  }, [ticketState])
  const checkCustomizeStepDone = () => ticketState.name && ticketState.symbol && ticketState.biography && ticketState.pricePerShare && ticketState.lootboxThemeColor && ticketState.logoUrl && ticketState.coverUrl

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
    web: ''
  }
  const [socialState, setSocialState] = useState(INITIAL_SOCIALS);
  const updateSocialState = (slug: string, text: string) => {
    setSocialState({ ...socialState, [slug]: text })
  }
  useEffect(() => {
    const thisStep = "stepSocials";
    if (socialState.email) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: checkTermsStepDone() ? "may_proceed" : "in_progress"
      })
    } else if (stage[thisStep] === "may_proceed") {
      setStage({
        ...stage,
        [thisStep]: "in_progress"
      })
    }
  }, [socialState.email])
  const checkSocialStateDone = () => socialState.email

  // STEP 6: Terms & Conditions
  const refStepTerms = useRef<HTMLDivElement | null>(null)
  const INITIAL_TERMS: Record<string, boolean> = {
    agreeEthics: false,
    agreeLiability: false,
    agreeVerify: false
  }
  const reputationWallet = snapUserState.currentAccount || ""
  const [termsState, setTermsState] = useState(INITIAL_TERMS);
  const updateTermsState = (slug: string, bool: boolean) => {
    setTermsState({ ...termsState, [slug]: bool })
  }
  useEffect(() => {
    const thisStep = "stepTerms";
    if (termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && receivingWallet) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed"
      })
    } else if (stage[thisStep] === "may_proceed") {
      setStage({
        ...stage,
        [thisStep]: "in_progress"
      })
    }
  }, [termsState])
  const checkTermsStepDone = () => termsState.agreeEthics && termsState.agreeLiability && termsState.agreeVerify && receivingWallet

  // STEP 7: Submit
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("unsubmitted")
  const checkAllConditionsMet = () => {
    
    const allValidationsPassed = Object.values(validity).every(condition => condition === true)

    const conditionsMet: boolean[] = [];
    stage.stepNetwork === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepFunding === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepReturns === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepCustomize === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepSocials === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    stage.stepTerms === "may_proceed" ? conditionsMet.push(true) : conditionsMet.push(false)
    const allConditionsMet = conditionsMet.every(condition => condition === true)

    return allValidationsPassed && allConditionsMet
  }

  const createLootbox = async () => {
    setSubmitStatus("in_progress")
    const LOOTBOX_FACTORY_ADDRESS = "0x3CA4819532173db8D15eFCf0dd2C8CFB3F0ECDD0"
    const blockNum = await web3Eth.getBlockNumber()
    const pricePerShare = new web3Utils.BN(
      web3Utils.toWei(ticketState.pricePerShare.toString(), "gwei")
    ).div(new web3Utils.BN("10"))    
    const maxSharesSold = fundraisingTarget
      .mul(
        nativeTokenPrice
      )
      .div(pricePerShare)
      .mul(new web3Utils.BN("11"))
      .div(new web3Utils.BN("10"))
      .toString()

    const lootbox = new web3Eth.Contract(
      LOOTBOX_FACTORY_ABI,
      LOOTBOX_FACTORY_ADDRESS,
      { from: snapUserState.currentAccount, gas: '1000000' }
    )
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

      `)
      const x = await lootbox.methods.createLootbox(
        ticketState.name,
        ticketState.symbol,
        maxSharesSold, // uint256 _maxSharesSold,
        pricePerShare, // uint256 _sharePriceUSD,
        receivingWallet,
        receivingWallet
      ).send();
      let options = {
        filter: {
            value: [],
        },
        fromBlock: blockNum,
        topics: [web3Utils.sha3("LootboxCreated(string,address,address,address,uint256,uint256)")],
        from: snapUserState.currentAccount,
      };
      lootbox.events.LootboxCreated(options).on('data', (event: any) => {
        const {
          issuer,
          lootbox,
          lootboxName,
          maxSharesSold,
          sharePriceUSD,
          treasury
        } = event.returnValues;
        
        if (issuer === snapUserState.currentAccount && treasury === receivingWallet) {
          console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created a lootbox!
          Lootbox Address: ${lootbox}
  
          ---------------
          
          `)
          setLootboxAddress(lootbox)
          setSubmitStatus("success")
          const basisPointsReturnTarget = new web3Utils.BN(basisPoints.toString())
            .add(new web3Utils.BN("100")) // make it whole
            .mul(new web3Utils.BN("10").pow(new web3Utils.BN((8 - 6).toString())))
            .mul(fundraisingTarget)
            .div(new web3Utils.BN("10").pow(new web3Utils.BN("8")))
          console.log(`basisPointsReturnTarget = ${basisPointsReturnTarget}`)
          createTokenURIData({
            address: lootbox,
            name: lootboxName,
            description: ticketState.description as string,
            image: ticketState.logoUrl as string,
            backgroundColor: ticketState.lootboxThemeColor as string,
            backgroundImage: ticketState.coverUrl as string,
            lootbox: {
              address: lootbox,
              chainIdHex: "chainIdHex",
              chainIdDecimal: "chainIdDecimal",
              chainName: "chainName",
              targetPaybackDate: paybackDate ? new Date(paybackDate) : new Date(),
              fundraisingTarget: fundraisingTarget,
              basisPointsReturnTarget: basisPoints.toString(),
              returnAmountTarget: basisPointsReturnTarget.toString(),
              pricePerShare: pricePerShare.toString(),
              lootboxThemeColor: ticketState.lootboxThemeColor as string,
              transactionHash: event.transactionHash as string,
              blockNumber: event.blockNumber
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
            }
          })
        }
      })
    } catch (e) {
      console.log(e)
      setSubmitStatus("failure")
    }
  }

  const goToLootboxAdminPage = () => {
    return `https://lootbox-fund.webflow.io/demo/0-2-0-demo/fundraiser?lootbox=${lootboxAddress}`
  }

  // if (!isWalletConnected) {
  //   return <WalletButton></WalletButton>
  // }
  return (
    <$CreateLootbox>
      <StepChooseNetwork
        selectedNetwork={network}
        stage={stage.stepNetwork}
        onSelectNetwork={(network: NetworkOption) => {
          selectNetwork(network, 'stepNetwork')
        }}
        onNext={() => refStepFunding.current?.scrollIntoView()}
        setValidity={(bool: boolean) => setValidity({...validity, stepNetwork: bool})}
      />
      <$Spacer></$Spacer>
      <StepChooseFunding
        ref={refStepFunding}
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        setFundraisingTarget={(target: BigNumber) => setFundraisingTarget(target)}
        receivingWallet={receivingWallet}
        setReceivingWallet={setReceivingWallet}
        stage={stage.stepFunding}
        setValidity={(bool: boolean) => setValidity({...validity, stepFunding: bool})}
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
        setValidity={(bool: boolean) => setValidity({...validity, stepReturns: bool})}
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
        setValidity={(bool: boolean) => setValidity({...validity, stepCustomize: bool})}
        onNext={() => refStepSocials.current?.scrollIntoView()}
      />
      <$Spacer></$Spacer>
      <StepSocials
        ref={refStepSocials}
        socialState={socialState}
        updateSocialState={updateSocialState}
        selectedNetwork={network}
        stage={stage.stepSocials}
        setValidity={(bool: boolean) => setValidity({...validity, stepSocials: bool})}
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
        treasuryWallet={receivingWallet}
        updateTreasuryWallet={setReceivingWallet}
        setValidity={(bool: boolean) => setValidity({...validity, stepTerms: bool})}
        onNext={() => console.log("onNext")}
        submitStatus={submitStatus}
        onSubmit={() => createLootbox()}
        goToLootboxAdminPage={goToLootboxAdminPage}
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
