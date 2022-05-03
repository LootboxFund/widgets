import react, { useEffect, useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Vertical } from 'lib/components/Generics'
import { Address } from '@wormgraph/helpers'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import useWindowSize from 'lib/hooks/useScreenSize'
import { NetworkOption } from 'lib/api/network'
import ReactTooltip from 'react-tooltip'
import { ethers as ethersObj } from 'ethers'
import HelpIcon from 'lib/theme/icons/Help.icon'
import CopyIcon from 'lib/theme/icons/Copy.icon'

export interface TermsFragment {
  slug: string
  text: string
  href?: string
}
const TERMS: TermsFragment[] = [
  {
    slug: 'agreeEthics',
    text: 'I agree to conduct business ethically & professionally as a fiduciary to my investors and fellow gamers.',
  },
  {
    slug: 'agreeLiability',
    text: 'I agree to the Lootbox Terms & Conditions and release Lootbox DAO from any liability as a permissionless protocol.',
  },
  { slug: 'agreeVerify', text: 'I have verified my Reputation address & Treasury wallet is correct' },
]

export type SubmitStatus = 'unsubmitted' | 'in_progress' | 'success' | 'failure'
export interface StepTermsConditionsProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  onNext: () => void
  termsState: Record<string, boolean>
  updateTermsState: (slug: string, bool: boolean) => void
  treasuryWallet: Address
  reputationWallet: Address
  updateTreasuryWallet: (wallet: Address) => void
  allConditionsMet: boolean
  onSubmit: () => void
  setValidity: (bool: boolean) => void
  submitStatus: SubmitStatus
  goToLootboxAdminPage: () => string
}
const StepTermsConditions = forwardRef((props: StepTermsConditionsProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const initialErrors = {
    treasuryWallet: '',
  }
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
  const checkAddrValid = async (addr: string) => {
    const ethers = window.ethers ? window.ethers : ethersObj
    return ethers.utils.isAddress(addr)
  }
  useEffect(() => {
    checkAddrValid(props.treasuryWallet).then((valid) => {
      if (valid && props.termsState.agreeVerify && props.termsState.agreeEthics && props.termsState.agreeLiability) {
        props.setValidity(true)
      } else if (!valid && props.treasuryWallet.length > 0) {
        props.setValidity(false)
        setErrors({
          ...errors,
          treasuryWallet: `Invalid Treasury Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`,
        })
      }
    })
  }, [])
  useEffect(() => {
    const { agreeEthics, agreeLiability, agreeVerify } = props.termsState
    if (agreeEthics && agreeLiability && agreeVerify) {
      props.setValidity(true)
    }
  }, [props.termsState])
  const updateTreasury = async (treasuryAddress: Address) => {
    props.updateTreasuryWallet(treasuryAddress)
    const validAddr = await checkAddrValid(treasuryAddress)
    if (validAddr) {
      props.setValidity(true)
      setErrors({
        ...errors,
        treasuryWallet: ``,
      })
    } else {
      props.setValidity(false)
      setErrors({
        ...errors,
        treasuryWallet: `Invalid Treasury Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`,
      })
    }
  }
  const updateCheckbox = (slug: string, checked: any) => {
    props.updateTermsState(slug, checked)
  }
  const submitWithCountdown = () => {
    setTimeLeft(90)
    props.onSubmit()
  }
  const renderActionBar = () => {
    if (props.submitStatus === 'failure') {
      return (
        <CreateLootboxButton
          allConditionsMet={props.allConditionsMet}
          themeColor={COLORS.dangerFontColor}
          onSubmit={props.onSubmit}
          text="Failed, try again?"
        />
      )
    } else if (props.submitStatus === 'success') {
      return (
        <$CreateLootboxButton
          allConditionsMet={true}
          onClick={() => window.open(props.goToLootboxAdminPage())}
          themeColor={COLORS.successFontColor}
        >
          View Your Lootbox
        </$CreateLootboxButton>
      )
    } else if (props.submitStatus === 'in_progress') {
      return (
        <$CreateLootboxButton allConditionsMet={false} disabled themeColor={props.selectedNetwork?.themeColor}>
          {`...submitting (${timeLeft})`}
        </$CreateLootboxButton>
      )
    }
    return (
      <CreateLootboxButton
        allConditionsMet={props.allConditionsMet}
        themeColor={props.selectedNetwork?.themeColor}
        onSubmit={() => submitWithCountdown()}
        text="Create Lootbox"
      />
    )
  }
  return (
    <$StepTermsConditions style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        customActionBar={
          (props.stage === 'in_progress' || props.stage === 'may_proceed') &&
          Object.values(errors).filter((e) => e).length === 0
            ? renderActionBar
            : undefined
        }
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={props.onNext}
        errors={Object.values(errors)}
      >
        <$Vertical flex={1}>
          <$StepHeading>{`7. Terms & Conditions`}</$StepHeading>
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
          <br />
          <br />
          <$Vertical>
            <$StepSubheading>
              Reputation Address (Locked to Current User)
              <HelpIcon tipID="reputationWallet" />
              <ReactTooltip id="reputationWallet" place="right" effect="solid">
                Your wallet address has an on-chain reputation based on how consistently you pay back profits to
                investors. A good reputation helps future fundraising, and even allows you to sponsor a friend.
              </ReactTooltip>
            </$StepSubheading>
            <$CopyableInput>
              <$InputMedium disabled value={props.reputationWallet}></$InputMedium>
              <CopyIcon text={props.reputationWallet} />
            </$CopyableInput>
          </$Vertical>
          <br />
          <br />
          <$Vertical>
            <$StepSubheading>
              Treasury Wallet (Receives Funds)
              <HelpIcon tipID="treasuryWallet" />
              <ReactTooltip id="treasuryWallet" place="right" effect="solid">
                This wallet address is where the funds from your Lootbox will be deposited. Double check that this
                address is correct.
              </ReactTooltip>
            </$StepSubheading>
            <$CopyableInput>
              <$InputMedium
                onChange={(e) => updateTreasury(e.target.value as Address)}
                value={props.treasuryWallet}
              ></$InputMedium>
              <CopyIcon text={props.treasuryWallet} />
            </$CopyableInput>
          </$Vertical>
        </$Vertical>
      </StepCard>
      {(props.submitStatus === 'in_progress' || props.submitStatus === 'success') && (
        <$TwitterAlert>
          If submission is taking too long, check our 👉
          <a href="https://twitter.com/LootboxAlerts" target="_blank" style={{ marginLeft: '5px', marginRight: '5px' }}>
            live Twitter feed
          </a>{' '}
          to find your newly created Lootbox. Takes ~3 mins.
        </$TwitterAlert>
      )}
    </$StepTermsConditions>
  )
})

export const $StepTermsConditions = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

export const $TermCheckbox = styled.input`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 20px;
  cursor: pointer;
`

const $TwitterAlert = styled.span`
  font-size: 1rem;
  font-weight: 400;
  color: ${COLORS.surpressedFontColor};
  display: inline-block;
  margin-top: 20px;
`

export const $TermOfService = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  margin-top: 2px;
`

const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: 1rem;
  flex: 1;
  margin-right: 20px;
  height: 40px;
`

const $CopyableInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`

const $CopyButton = styled.button`
  width: 20px;
  height: 20px;
  border: none;
  padding: 0px;
  font-size: 2rem;
  margin: 0px;
  cursor: copy;
`

interface CreateLootboxButtonProps {
  allConditionsMet: boolean
  themeColor?: string
  onSubmit: () => void
  text: string
}
export const CreateLootboxButton = (props: CreateLootboxButtonProps) => {
  return (
    <$CreateLootboxButton
      disabled={!props.allConditionsMet}
      allConditionsMet={props.allConditionsMet}
      onClick={props.onSubmit}
      themeColor={props.themeColor}
    >
      {props.text}
    </$CreateLootboxButton>
  )
}

const $CreateLootboxButton = styled.button<{ themeColor?: string; allConditionsMet: boolean }>`
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

export default StepTermsConditions
