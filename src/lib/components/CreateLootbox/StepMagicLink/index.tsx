import { NetworkOption, NETWORK_OPTIONS } from 'lib/api/network'
import react, { useState } from 'react'
import styled from 'styled-components'
import queryString from 'query-string'
import { $Vertical } from 'lib/components/Generics'
import { $TermCheckbox, $TermOfService } from '../StepTermsConditions'
import { BLOCKCHAINS, chainIdHexToSlug, ChainInfo, ChainSlugs } from '@wormgraph/helpers'
import { ethers } from 'ethers'
import StepCard, { $StepHeading, $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { StepStage } from '../StepCard/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'

export const validNetworks = NETWORK_OPTIONS.map(({ chainIdHex }) => chainIdHex)
export const validTypes = ['escrow', 'instant', 'tournament']

export interface StepMagicLinkProps {
  network: typeof validNetworks[number] | undefined
  type: typeof validTypes[number] | undefined
  fundingTarget: string | undefined
  fundingLimit: string | undefined
  receivingWallet: string | undefined
  returnsTarget: string | undefined
  returnsDate: string | undefined
  logoImage: string | undefined
  coverImage: string | undefined
  themeColor: string | undefined
  campaignBio: string | undefined
  campaignWebsite: string | undefined
  uploadImages: () => [string, string]
  selectedNetwork: NetworkOption | undefined
  stage: StepStage
}
const StepMagicLink = (props: StepMagicLinkProps) => {
  const { screen } = useWindowSize()
  const [magicLink, setMagicLink] = useState('')
  const [showMagicLinkGenerate, setShowMagicLinkGenerator] = useState(false)
  const [includeNetwork, setIncludeNetwork] = useState(true)
  const [includeType, setIncludeType] = useState(true)
  const [includeFundingTarget, setIncludeFundingTarget] = useState(true)
  const [includeFundingLimit, setIncludeFundingLimit] = useState(true)
  const [includeReceivingWallet, setIncludeReceivingWallet] = useState(true)
  const [includeReturnsTarget, setIncludeReturnsTarget] = useState(true)
  const [includeReturnsDate, setIncludeReturnsDate] = useState(true)
  const [includeLogoImage, setIncludeLogoImage] = useState(true)
  const [includeCoverImage, setIncludeCoverImage] = useState(false)
  const [includeThemeColor, setIncludeThemeColor] = useState(false)
  const [includeCampaignBio, setIncludeCampaignBio] = useState(true)
  const [includeCampaignWebsite, setIncludeCampaignWebsite] = useState(true)

  const generateMagicLink = async () => {
    let queryParams: any = {}
    if (includeNetwork || includeFundingTarget || includeFundingLimit) {
      queryParams.network = props.network
      queryParams.fundingTarget = props.fundingTarget
      queryParams.fundingLimit = props.fundingLimit
    }
    if (includeType) {
      queryParams.type = props.type
    }
    if (includeReceivingWallet) {
      queryParams.receivingWallet = props.receivingWallet
    }
    if (includeReturnsTarget) {
      queryParams.returnsTarget = props.returnsTarget
    }
    if (includeReturnsDate) {
      queryParams.returnsDate = props.returnsDate
    }
    if (includeThemeColor) {
      queryParams.themeColor = props.themeColor
    }
    if (includeCampaignBio) {
      queryParams.campaignBio = props.campaignBio
    }
    if (includeCampaignWebsite) {
      queryParams.campaignWebsite = props.campaignWebsite
    }
    const [logoImage, coverImage] = await props.uploadImages()
    if (includeLogoImage) {
      queryParams.logoImage = logoImage
    }
    if (includeCoverImage) {
      queryParams.coverImage = coverImage
    }
    const magicLink = queryString.stringifyUrl({ url: window.location.origin, query: queryParams })
    console.log(`Magic link is = ${magicLink}`)
    setMagicLink(magicLink)
  }
  if (!props.network || !props.selectedNetwork) {
    return null
  }
  const chainSlug = chainIdHexToSlug(props.network) as ChainSlugs
  const blockchain = BLOCKCHAINS[chainSlug] as ChainInfo
  if (!showMagicLinkGenerate) {
    return (
      <$StepMagicLink>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <button onClick={() => setShowMagicLinkGenerator(true)}>Show Magic Link</button>
        </div>
      </$StepMagicLink>
    )
  }
  return (
    <$StepMagicLink>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={() => {}} errors={[]}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <$StepHeading>
            Create Magic Link
            <HelpIcon tipID="stepNetwork" />
            <ReactTooltip id="stepNetwork" place="right" effect="solid">
              Choose a Lootbox type based on your use case. Read the descriptions of each type to find which is right
              for you.
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            Easily allow anyone to create a Lootbox according to the settings you choose.
          </$StepSubheading>
          <br />
          <br />
          <$Vertical>
            <IncludeTerm
              slug="network"
              checked={includeNetwork}
              onClick={(bool: boolean) => {
                setIncludeNetwork(bool)
                setIncludeFundingTarget(bool)
                setIncludeFundingLimit(bool)
              }}
              text={`Set network to ${blockchain.chainName}`}
              locked={false}
            />
            <IncludeTerm
              slug="type"
              checked={includeType}
              onClick={setIncludeType}
              text={`Set Lootbox type to ${props.type}`}
              locked={false}
            />
            <IncludeTerm
              slug="fundingTarget"
              checked={includeFundingTarget}
              onClick={(bool: boolean) => {
                setIncludeNetwork(bool)
                setIncludeFundingTarget(bool)
                setIncludeFundingLimit(bool)
              }}
              text={`Set funding target to ${parseFloat(
                ethers.utils.formatUnits(props.fundingTarget || '0', '18').toString()
              ).toFixed(4)} ${blockchain.nativeCurrency.symbol}`}
              locked={includeNetwork ? true : false}
            />
            <IncludeTerm
              slug="fundingLimit"
              checked={includeFundingLimit}
              onClick={(bool: boolean) => {
                setIncludeNetwork(bool)
                setIncludeFundingTarget(bool)
                setIncludeFundingLimit(bool)
              }}
              text={`Set funding limit to ${parseFloat(
                ethers.utils.formatUnits(props.fundingLimit || '0', '18').toString()
              ).toFixed(4)} ${blockchain.nativeCurrency.symbol}`}
              locked={includeNetwork ? true : false}
            />
            <IncludeTerm
              slug="receivingWallet"
              checked={includeReceivingWallet}
              onClick={setIncludeReceivingWallet}
              text={`Set receiving wallet to ${props.receivingWallet}`}
              locked={false}
            />
            <IncludeTerm
              slug="returnsTarget"
              checked={includeReturnsTarget}
              onClick={setIncludeReturnsTarget}
              text={`Set returns target to ${ethers.utils.formatUnits(props.returnsTarget || '0', '2').toString()}%`}
              locked={false}
            />
            <IncludeTerm
              slug="returnsDate"
              checked={includeReturnsDate}
              onClick={setIncludeReturnsDate}
              text={`Set returns date to ${props.returnsDate}`}
              locked={false}
            />
            <IncludeTerm
              slug="logo"
              checked={includeLogoImage}
              onClick={setIncludeLogoImage}
              text={`Set logo image automatically`}
              locked={false}
            />
            <IncludeTerm
              slug="cover"
              checked={includeCoverImage}
              onClick={setIncludeCoverImage}
              text={`Set cover image automatically`}
              locked={false}
            />
            <IncludeTerm
              slug="themeColor"
              checked={includeThemeColor}
              onClick={setIncludeThemeColor}
              text={`Set theme color automatically`}
              locked={false}
            />
            <IncludeTerm
              slug="campaignBio"
              checked={includeCampaignBio}
              onClick={setIncludeCampaignBio}
              text={`Set the Lootbox description automatically`}
              locked={false}
            />
            <IncludeTerm
              slug="campaignWebsite"
              checked={includeCampaignWebsite}
              onClick={setIncludeCampaignWebsite}
              text={`Set the website in the Lootbox social links automatically`}
              locked={false}
            />
            <button onClick={() => generateMagicLink()}>Generate</button>
          </$Vertical>
          <br />
          {magicLink && (
            <$Vertical>
              <input value={magicLink}></input>
              <span>Copy</span>
            </$Vertical>
          )}
        </div>
      </StepCard>
    </$StepMagicLink>
  )
}

const $StepMagicLink = styled.div<{}>`
  font-family: sans-serif;
  width: 100%;
`

interface IncludeTermProps {
  slug: string
  checked: boolean
  onClick: (bool: boolean) => void
  text: string
  locked: Boolean
}
const IncludeTerm = (props: IncludeTermProps) => {
  let termStyles: any = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontFamily: 'sans-serif',
  }
  if (props.locked) {
    termStyles = { ...termStyles, opacity: '0.2', cursor: 'not-allowed' }
  }
  return (
    <div key={props.slug} style={termStyles}>
      <$TermCheckbox
        onClick={(e) => {
          props.onClick(e.currentTarget.checked)
        }}
        checked={props.checked}
        type="checkbox"
      ></$TermCheckbox>
      <$TermOfService>{props.text}</$TermOfService>
    </div>
  )
}

export default StepMagicLink
