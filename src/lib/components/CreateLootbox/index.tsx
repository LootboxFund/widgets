import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import { initDApp, updateStateToChain, useUserInfo, useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import WalletButton from 'lib/components/WalletButton';
import {StepStage} from 'lib/components/StepCard';
import StepChooseFunding from 'lib/components/CreateLootbox/StepChooseFunding';
import { NetworkOption } from './StepChooseNetwork'
import StepChooseNetwork from 'lib/components/CreateLootbox/StepChooseNetwork';
import StepChooseReturns from 'lib/components/CreateLootbox/StepChooseReturns';
import StepCustomize from 'lib/components/CreateLootbox/StepCustomize';
import StepSocials from 'lib/components/CreateLootbox/StepSocials';
import StepTermsConditions from 'lib/components/CreateLootbox/StepTermsConditions';


export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize();
  const web3 = useWeb3()
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
      setFundraisingTarget("")
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: "in_progress"
      })
    }
  }, [network])

  // STEP 2: Choose Funding
  const [fundraisingTarget, setFundraisingTarget] = useState<string>("");
  const [receivingWallet, setReceivingWallet] = useState<string>("");
  useEffect(() => {
    const thisStep = "stepFunding";
    if (fundraisingTarget && receivingWallet) {
      setStage({
        ...stage,
        [thisStep]: "may_proceed",
        [linkedListFormSteps[thisStep]]: checkReturnsStepDone() ? "may_proceed" : "in_progress"
      })
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
  const [returnTarget, setReturnTarget] = useState<number>();
  const [paybackDate, setPaybackDate] = useState<string>();
  useEffect(() => {
    const thisStep = "stepReturns";
    if (returnTarget && paybackDate) {
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
  }, [returnTarget, paybackDate])
  const checkReturnsStepDone = () => returnTarget && paybackDate

  // STEP 4: Customize Ticket
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
    console.log('---- validity')
    console.log(validity)
    console.log('---- stage')
    console.log(stage)
    
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

  // if (!isWalletConnected) {
  //   return <WalletButton></WalletButton>
  // }
  return (
    <$CreateLootbox>
      <StepChooseNetwork
        selectedNetwork={network}
        stage={stage.stepNetwork}
        onSelectNetwork={(network: NetworkOption) => selectNetwork(network, 'stepNetwork')}
        onNext={() => console.log("onNext")}
        setValidity={(bool: boolean) => setValidity({...validity, stepNetwork: bool})}
      />
      <$Spacer></$Spacer>
      <StepChooseFunding
        selectedNetwork={network}
        fundraisingTarget={fundraisingTarget}
        setFundraisingTarget={(amount: string) => setFundraisingTarget(amount)}
        receivingWallet={receivingWallet}
        setReceivingWallet={setReceivingWallet}
        stage={stage.stepFunding}
        setValidity={(bool: boolean) => setValidity({...validity, stepFunding: bool})}
        onNext={() => console.log("onNext")}
      />
      <$Spacer></$Spacer>
      <StepChooseReturns
        selectedNetwork={network}
        returnTarget={returnTarget}
        setReturnTarget={(amount: number) => setReturnTarget(amount)}
        paybackDate={paybackDate}
        setPaybackDate={(date: string) => setPaybackDate(date)}
        stage={stage.stepReturns}
        setValidity={(bool: boolean) => setValidity({...validity, stepReturns: bool})}
        onNext={() => console.log("onNext")}
      />
      <$Spacer></$Spacer>
      <StepCustomize
        ticketState={ticketState}
        updateTicketState={updateTicketState}
        selectedNetwork={network}
        stage={stage.stepCustomize}
        maxPricePerShare={10}
        setValidity={(bool: boolean) => setValidity({...validity, stepCustomize: bool})}
        onNext={() => console.log("onNext")}
      />
      <$Spacer></$Spacer>
      <StepSocials
        socialState={socialState}
        updateSocialState={updateSocialState}
        selectedNetwork={network}
        stage={stage.stepSocials}
        setValidity={(bool: boolean) => setValidity({...validity, stepSocials: bool})}
        onNext={() => console.log("onNext")}
      />
      <$Spacer></$Spacer>
      <StepTermsConditions
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
