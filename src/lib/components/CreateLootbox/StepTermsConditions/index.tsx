import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon } from '../StepChooseNetwork';
import Web3Utils from 'web3-utils';
import { useWeb3Utils } from 'lib/hooks/useWeb3Api';
import { NetworkOption } from '../state';

export interface TermsFragment {
  slug: string;
  text: string;
  href?: string;
}
const TERMS: TermsFragment[] = [
  { slug: 'agreeEthics', text: 'I agree to conduct business ethically & professionally as a fiduciary to my investors and fellow gamers.' },
  { slug: 'agreeLiability', text: 'I agree to the Lootbox Terms & Conditions and release Lootbox DAO from any liability as a permissionless protocol.' },
  { slug: 'agreeVerify', text: 'I have verified my Reputation address & Treasury wallet is correct' }
]

interface Errors {
  treasuryWallet: string;
}
export interface StepTermsConditionsProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  onNext: () => void;
  termsState: Record<string, boolean>;
  updateTermsState: (slug: string, bool: boolean) => void;
  treasuryWallet: string;
  reputationWallet: string;
  updateTreasuryWallet: (wallet: string) => void;
  allConditionsMet: boolean;
  onSubmit: () => void;
  setValidity: (bool: boolean) => void;
}
const StepTermsConditions = (props: StepTermsConditionsProps) => {
  const { screen } = useWindowSize()
  const web3Utils = useWeb3Utils()
  const initialErrors = {
    treasuryWallet: ''
  }
  const [errors, setErrors] = useState(initialErrors)
  const checkAddrValid = async (addr: string) => {
    return web3Utils.isAddress(addr) 
  }
  useEffect(() => {
    checkAddrValid(props.treasuryWallet).then(valid => { 
      if (valid) {
        props.setValidity(true)
      } else if (props.treasuryWallet.length > 0) {
        props.setValidity(false)
        setErrors({
          ...errors,
          treasuryWallet: `Invalid Treasury Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`
        })
      }
    })
  }, [])
  useEffect(() => {
    const { agreeEthics, agreeLiability, agreeVerify } = props.termsState;
    if (agreeEthics && agreeLiability && agreeVerify) {
      props.setValidity(true)
    }
  }, [props.termsState])
  const updateTreasury = async (treasuryAddress: string) => {
    props.updateTreasuryWallet(treasuryAddress)
    const validAddr = await checkAddrValid(treasuryAddress)
    if (validAddr) {
      props.setValidity(true)
      setErrors({
        ...errors,
        treasuryWallet: ``
      })
    } else {
      props.setValidity(false)
      setErrors({
        ...errors,
        treasuryWallet: `Invalid Treasury Wallet, check if the address is compatible with ${props.selectedNetwork?.name}`
      })
    }
  }
  const updateCheckbox = (slug: string, checked: any) => {
    console.log(`checked ==== ${checked}`)
    props.updateTermsState(slug, checked)
  }
	return (
		<$StepTermsConditions>
      <StepCard
        customActionBar={
          (props.stage === "in_progress" || props.stage === "may_proceed") && Object.values(errors).filter(e => e).length === 0
          ?
          () => <CreateLootboxButton allConditionsMet={props.allConditionsMet} themeColor={props.selectedNetwork?.themeColor} onSubmit={props.onSubmit} />
          :
          undefined
        }
        themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}
        errors={Object.values(errors)}>
        <$Vertical flex={1}>
          <$StepHeading>{`6. Terms & Conditions`}</$StepHeading>
          <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>

          <br /><br />
          {
            TERMS.map((term) => {
              return (
                <div key={term.slug} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <$TermCheckbox onClick={(e) => updateCheckbox(term.slug, e.currentTarget.checked)} value={term.slug} type="checkbox"></$TermCheckbox>
                  <$TermOfService key={term.slug}>{term.text}</$TermOfService>
                </div>
              )
            })
          }
          <br /><br />
          <$Vertical>
            <$StepSubheading>Reputation Address (Locked to Current User)</$StepSubheading>
            <$CopyableInput>
              <$InputMedium disabled value={props.reputationWallet}></$InputMedium>
              <$CopyButton>📄</$CopyButton>
            </$CopyableInput>
          </$Vertical>
          <br /><br />
          <$Vertical>
            <$StepSubheading>Treasury Wallet (Receives Funds)</$StepSubheading>
            <$CopyableInput>
              <$InputMedium onChange={(e) => updateTreasury(e.target.value)} value={props.treasuryWallet}></$InputMedium>
              <$CopyButton>📄</$CopyButton>
            </$CopyableInput>
          </$Vertical>
        </$Vertical>
      </StepCard>
		</$StepTermsConditions>
	)
}

const $StepTermsConditions = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

const $TermCheckbox = styled.input`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  margin-right: 20px;
  cursor: pointer;
`

const $TermOfService = styled.span`
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
  cursor: pointer;
`

interface CreateLootboxButtonProps {
  allConditionsMet: boolean;
  themeColor?: string;
  onSubmit: () => void;
}
export const CreateLootboxButton = (props: CreateLootboxButtonProps) => {
  return <$CreateLootboxButton disabled={!props.allConditionsMet} allConditionsMet={props.allConditionsMet} onClick={props.onSubmit} themeColor={props.themeColor}>Create Lootbox</$CreateLootboxButton>
}

const $CreateLootboxButton = styled.button<{ themeColor?: string, allConditionsMet: boolean }>`
  background-color: ${props => props.allConditionsMet ? props.themeColor : `${props.themeColor}30`};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${props => props.allConditionsMet ? 'pointer' : 'not-allowed'};
  color: ${props => props.allConditionsMet ? COLORS.white : `${props.themeColor}40` };
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  margin: 20px;
  padding: 20px;
`

export default StepTermsConditions;