import { ChainIDDecimal, ChainIDHex, Address, ContractAddress } from '@wormgraph/helpers'
import { NETWORK_OPTIONS } from 'lib/api/network'
import { StepStage } from './StepCard'
import { ethers } from 'ethers'
import { validNetworks, validTypes } from './StepMagicLink'

export interface InitialFormStateCreateLootbox {
  stepNetwork: StepStage
  stepType: StepStage
  stepFunding: StepStage
  stepReturns: StepStage
  stepCustomize: StepStage
  stepSocials: StepStage
  stepTerms: StepStage
}
export interface InitialFormValidityCreateLootbox {
  stepNetwork: boolean
  stepType: boolean
  stepFunding: boolean
  stepReturns: boolean
  stepCustomize: boolean
  stepSocials: boolean
  stepTerms: boolean
}
export const extractURLState_CreateLootboxPage = () => {
  const url = new URL(window.location.href)
  const INITIAL_FORM_STATE: InitialFormStateCreateLootbox = {
    stepNetwork: 'in_progress',
    stepType: 'not_yet',
    stepFunding: 'not_yet',
    stepReturns: 'not_yet',
    stepCustomize: 'not_yet',
    stepSocials: 'not_yet',
    stepTerms: 'not_yet',
  }
  const INITIAL_VALIDITY: InitialFormValidityCreateLootbox = {
    stepNetwork: false,
    stepType: false,
    stepFunding: false,
    stepReturns: false,
    stepCustomize: false,
    stepSocials: false,
    stepTerms: false,
  }
  const params = {
    network: url.searchParams.get('network'),
    type: url.searchParams.get('type'),
    fundingTarget: url.searchParams.get('fundingTarget'),
    fundingLimit: url.searchParams.get('fundingLimit'),
    receivingWallet: url.searchParams.get('receivingWallet'),
    returnsTarget: url.searchParams.get('returnsTarget'),
    returnsDate: url.searchParams.get('returnsDate'),
    logoImage: url.searchParams.get('logoImage'),
    coverImage: url.searchParams.get('coverImage'),
    campaignBio: url.searchParams.get('campaignBio'),
    campaignWebsite: url.searchParams.get('campaignWebsite'),
    themeColor: url.searchParams.get('themeColor'),
  }
  if (validNetworks.includes(params.network || '')) {
    INITIAL_FORM_STATE.stepNetwork = 'may_proceed'
    INITIAL_VALIDITY.stepNetwork = true
  }
  if (validTypes.includes(params.type || '')) {
    INITIAL_FORM_STATE.stepType = 'may_proceed'
    INITIAL_VALIDITY.stepType = true
  }
  if (
    (params.fundingTarget && !isNaN(parseFloat(params.fundingTarget))) ||
    (params.fundingLimit && !isNaN(parseFloat(params.fundingLimit)))
  ) {
    INITIAL_FORM_STATE.stepFunding = 'may_proceed'
    INITIAL_VALIDITY.stepFunding = true
  }
  if (
    params.returnsTarget &&
    !isNaN(parseInt(params.returnsTarget)) &&
    ethers.utils.isAddress(params.receivingWallet || '')
  ) {
    INITIAL_FORM_STATE.stepReturns = 'may_proceed'
    INITIAL_VALIDITY.stepReturns = true
  }
  return { INITIAL_FORM_STATE, INITIAL_VALIDITY, INITIAL_URL_PARAMS: params }
}
