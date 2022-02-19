import react, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import { initDApp, updateStateToChain, useUserInfo, useWeb3, useWeb3Utils } from 'lib/hooks/useWeb3Api'
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
import StepTermsConditions from 'lib/components/CreateLootbox/StepTermsConditions';
import LOOTBOX_FACTORY_ABI from 'lib/abi/LootboxFactory.json'
import { NetworkOption } from './state'
import { BigNumber } from 'bignumber.js';

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize();
  const web3 = useWeb3()
  const web3Utils = useWeb3Utils()
  const isWalletConnected = snapUserState.accounts.length > 0;
 
  useEffect(() => {
    window.onload = () => {
      initDApp()
        .catch((err) => console.error(err))
    }
  }, [])

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
      setPaybackDate(defaultPaybackDate.toDateString())
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
  const reputationWallet = "0xReputationWallet"
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
  const createLootbox = () => {
    // const ERC20 = new window.web3.eth.Contract(LOOTBOX_FACTORY_ABI, LOOTBOX_FACTORY_ADDRESS)
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
          console.log(network)
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
        onSubmit={() => console.log('onSubmit')}
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
