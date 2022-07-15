import { NetworkOption, NETWORK_OPTIONS } from 'lib/api/network'
import react, { useState } from 'react'
import styled from 'styled-components'
import queryString from 'query-string'
import { $Vertical } from 'lib/components/Generics'
import { $TermCheckbox, $TermOfService } from '../StepTermsConditions'
import { BLOCKCHAINS, chainIdHexToSlug, ChainInfo, ChainSlugs, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { ethers } from 'ethers'
import StepCard, { $StepHeading, $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { StepStage } from '../StepCard/index'
import useWindowSize from 'lib/hooks/useScreenSize'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'
import LogRocket from 'logrocket'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { $InputMedium } from '../StepCustomize'
import CopyIcon from 'lib/theme/icons/Copy.icon'
import { v4 as uuidv4 } from 'uuid'
import { FormattedMessage, useIntl } from 'react-intl'
import { getWords } from '../constants'

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
  uploadLogo: (submissionId: string) => Promise<string>
  uploadCover: (submissionId: string) => Promise<string>
  selectedNetwork: NetworkOption | undefined
  stage: StepStage
  tournamentId?: string
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
  const [includeCoverImage, setIncludeCoverImage] = useState(true)
  const [includeThemeColor, setIncludeThemeColor] = useState(true)
  const [includeCampaignBio, setIncludeCampaignBio] = useState(true)
  const [includeCampaignWebsite, setIncludeCampaignWebsite] = useState(true)
  const [includeTournamentId, setIncludeTournamentId] = useState(true)
  const [loading, setLoading] = useState(false)
  const intl = useIntl()

  const generateMagicLink = async () => {
    setLoading(true)
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
    if (includeTournamentId && props.tournamentId) {
      queryParams.tournamentId = props.tournamentId
    }

    const submissionId = uuidv4()

    if (includeLogoImage) {
      try {
        const logoImage = await props.uploadLogo(submissionId)
        queryParams.logoImage = logoImage
      } catch (err) {
        LogRocket.captureException(err)
      }
    }
    if (includeCoverImage) {
      try {
        const coverImage = await props.uploadCover(submissionId)
        queryParams.coverImage = coverImage
      } catch (err) {
        LogRocket.captureException(err)
      }
    }

    const magicLink = queryString.stringifyUrl({
      url: `${window.location.origin}${window.location.pathname}`,
      query: queryParams,
    })
    console.log(`Magic link is = ${magicLink}`)
    setMagicLink(magicLink)
    setLoading(false)
  }
  if (!props.network || !props.selectedNetwork) {
    return null
  }
  const chainSlug = chainIdHexToSlug(props.network) as ChainSlugs
  const blockchain = BLOCKCHAINS[chainSlug] as ChainInfo

  const {
    magicNetworkText,
    magicLootboxTypeText,
    magicFundingTargetText,
    magicFundingLimitText,
    magicReceivingWalletText,
    magicReturnsTargetText,
    magicReturnsDateText,
    magicLogoImageText,
    magicCoverImageText,
    magicThemeColorText,
    magicCampaignBioText,
    magicCampaignWebsiteText,
    magicTournamentIdText,
  } = getWords({
    intl,
    blockchain: {
      chainName: blockchain.chainName,
      nativeSymbol: blockchain.nativeCurrency.symbol,
    },
    lootboxType: props.type ? `${props.type.charAt(0).toUpperCase() + props.type.slice(1)}` : '',
    returnDate: props.returnsDate || '',
    returnsTarget: ethers.utils.formatUnits(props.returnsTarget || '0', '2').toString(),
    receivingWallet: props.receivingWallet || '',
    fundingLimit: parseFloat(ethers.utils.formatUnits(props.fundingLimit || '0', '18').toString()).toFixed(4),
    fundingTarget: parseFloat(ethers.utils.formatUnits(props.fundingTarget || '0', '18').toString()).toFixed(4),
  })

  const generateMagicLinkButtonPrompt = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.generateMagicLinkButtonPrompt',
    defaultMessage: 'Generate',
    description: 'Button prompt to "generate" (AKA. "create") a magic link for a Lootbox',
  })

  if (!showMagicLinkGenerate) {
    return (
      <$StepMagicLink>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <$Button
            screen={screen}
            onClick={() => setShowMagicLinkGenerator(true)}
            disabled={loading}
            backgroundColor={`${COLORS.surpressedBackground}15`}
            color={`${COLORS.surpressedFontColor}70`}
            style={{ paddingLeft: '20px', paddingRight: '20px', fontWeight: TYPOGRAPHY.fontWeight.regular }}
          >
            <FormattedMessage
              id="createLootbox.stepMagicLink.generateMagicLink.createButton"
              defaultMessage="Create magic link"
              description="Button text to create a magic link. A magic link is a URL link (like www.lootbox.fund/xyz) that allows a user to create a Lootbox in 1 simple step"
            />
          </$Button>
        </div>
      </$StepMagicLink>
    )
  }
  return (
    <$StepMagicLink>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={() => {}} errors={[]}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <$StepHeading>
            <FormattedMessage
              id="createLootbox.stepMagicLink.generateMagicLink.header"
              defaultMessage="Create Magic Link"
              description="Header for the component that handles creating a magic link. A magic link is a URL link (like www.lootbox.fund/xyz) that allows a user to create a Lootbox in 1 simple step"
            />
            <HelpIcon tipID="stepNetwork" />
            <ReactTooltip id="stepNetwork" place="right" effect="solid">
              <FormattedMessage
                id="createLootbox.stepMagicLink.generateMagicLink.tooltip"
                defaultMessage="Create a magic link and share it with your community. Magic links easily allow anyone to create a Lootbox according to the settings you choose."
                description="Tool tip help message for the magic link section"
              />
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            <FormattedMessage
              id="createLootbox.stepMagicLink.generateMagicLink.subheader"
              defaultMessage="Easily allow anyone to create a Lootbox according to the settings you choose."
              description="Sub header for the component that handles creating a magic link."
            />
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
              text={magicNetworkText}
              locked={false}
            />
            <IncludeTerm
              slug="type"
              checked={includeType}
              onClick={setIncludeType}
              text={magicLootboxTypeText}
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
              text={magicFundingTargetText}
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
              text={magicFundingLimitText}
              locked={includeNetwork ? true : false}
            />
            <IncludeTerm
              slug="receivingWallet"
              checked={includeReceivingWallet}
              onClick={setIncludeReceivingWallet}
              text={magicReceivingWalletText}
              locked={false}
            />
            <IncludeTerm
              slug="returnsTarget"
              checked={includeReturnsTarget}
              onClick={setIncludeReturnsTarget}
              text={magicReturnsTargetText}
              locked={false}
            />
            <IncludeTerm
              slug="returnsDate"
              checked={includeReturnsDate}
              onClick={setIncludeReturnsDate}
              text={magicReturnsDateText}
              locked={false}
            />
            <IncludeTerm
              slug="logo"
              checked={includeLogoImage}
              onClick={setIncludeLogoImage}
              text={magicLogoImageText}
              locked={false}
            />
            <IncludeTerm
              slug="cover"
              checked={includeCoverImage}
              onClick={setIncludeCoverImage}
              text={magicCoverImageText}
              locked={false}
            />
            <IncludeTerm
              slug="themeColor"
              checked={includeThemeColor}
              onClick={setIncludeThemeColor}
              text={magicThemeColorText}
              locked={false}
            />
            <IncludeTerm
              slug="campaignBio"
              checked={includeCampaignBio}
              onClick={setIncludeCampaignBio}
              text={magicCampaignBioText}
              locked={false}
            />
            <IncludeTerm
              slug="campaignWebsite"
              checked={includeCampaignWebsite}
              onClick={setIncludeCampaignWebsite}
              text={magicCampaignWebsiteText}
              locked={false}
            />
            <IncludeTerm
              slug="tournamentId"
              checked={includeTournamentId}
              onClick={setIncludeTournamentId}
              text={magicTournamentIdText}
              locked={false}
            />
            <br />
            <br />
            <$Button
              screen={screen}
              onClick={() => generateMagicLink()}
              disabled={loading}
              color={COLORS.trustFontColor}
              backgroundColor={COLORS.trustBackground}
            >
              <LoadingText loading={loading} text={generateMagicLinkButtonPrompt} color={COLORS.trustFontColor} />
            </$Button>
          </$Vertical>
          <br />
          {magicLink && (
            <$Vertical>
              <$CopyableInput>
                <$InputMedium style={{ width: '100%' }} disabled value={magicLink}></$InputMedium>
                <CopyIcon text={magicLink} />
              </$CopyableInput>

              <br />
              <span
                style={{
                  fontSize: TYPOGRAPHY.fontSize.large,
                  fontFamily: TYPOGRAPHY.fontFamily.regular,
                  color: COLORS.surpressedFontColor,
                }}
              >
                <FormattedMessage
                  id="createLootbox.stepMagicLink.generateMagicLink.copy"
                  defaultMessage="Copy the link above ☝️ and send it to the person you want to create a Lootbox for."
                  description="Prompt for the user to copy the magic link, which is visually shown above (hence the finger upwards)"
                />
              </span>
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
      <$TermOfService style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.text}</$TermOfService>
    </div>
  )
}

const $CopyableInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
`

export default StepMagicLink
