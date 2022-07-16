import { Address, ChainInfo } from '@wormgraph/helpers'
import { useIntl } from 'react-intl'
import { LootboxType } from './StepChooseType'

export const useMagicWords = () => {
  const intl = useIntl()

  const magicNetworkText = (chainName: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.network',
        defaultMessage: 'Network set to {network}',
        description:
          'Checklist item, displaying that the blockchain network has been already set when making a Lootbox',
      },
      // { network: blockchain.chainName }
      { network: chainName }
    )

  const magicLootboxTypeText = (lootboxType: LootboxType | string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.type',
        defaultMessage: 'Funding type set to {type}',
        description: 'Checklist item, displaying that the lootbox type has been already set when making a Lootbox',
      },
      {
        type: lootboxType,
      }
    )

  const magicFundingTargetText = (fundingTarget: string, nativeSymbol: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.fundingTarget',
        defaultMessage: 'Funding target set to {fundingTarget} {currency}',
        description:
          'Checklist item, displaying that the funding target has been already set when making a Lootbox. This is someithing like "10 ETH"',
      },
      {
        //   fundingTarget: parseFloat(ethers.utils.formatUnits(props.fundingTarget || '0', '18').toString()).toFixed(4),
        fundingTarget: fundingTarget,
        currency: nativeSymbol,
      }
    )

  const magicFundingLimitText = (fundingLimit: string, nativeSymbol: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.fundingLimit',
        defaultMessage: 'Funding limit set to {fundingLimit} {currency}',
        description:
          'Checklist item, displaying that the funding limit has been already set when making a Lootbox. (Funding limit is different than funding target)',
      },
      {
        //   fundingLimit: parseFloat(ethers.utils.formatUnits(props.fundingLimit || '0', '18').toString()).toFixed(4),
        fundingLimit: fundingLimit,
        currency: nativeSymbol,
      }
    )

  const magicReceivingWalletText = (receivingWallet: Address | string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.receivingWallet',
        defaultMessage: 'Receiving wallet set to {receivingWallet}',
        description: 'Checklist item, displaying that the receiving wallet has been already set when making a Lootbox',
      },
      {
        receivingWallet: receivingWallet,
      }
    )

  const magicReturnsTargetText = (returnsTarget: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.returnsTarget',
        defaultMessage: 'Returns target set to {returnsTarget}%',
        description:
          'Checklist item, displaying that the returns target has been already set when making a Lootbox. This is a percentage.',
      },
      {
        //   returnsTarget: ethers.utils.formatUnits(props.returnsTarget || '0', '2').toString(),
        returnsTarget: returnsTarget,
      }
    )

  const magicReturnsDateText = (returnsDate: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.stepMagicLink.returnsDate',
        defaultMessage: 'Returns date set to {returnsDate}',
        description: 'Checklist item, displaying that the returns date has been already set when making a Lootbox.',
      },
      {
        returnsDate: returnsDate,
      }
    )

  const magicLogoImageText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.logoImage',
    defaultMessage: 'Lootbox logo image is set',
    description: 'Checklist item, displaying that the logo image has been already set when making a Lootbox',
  })

  const magicCoverImageText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.coverImage',
    defaultMessage: 'Lootbox cover image is set',
    description: 'Checklist item, displaying that the cover image has been already set when making a Lootbox',
  })

  const magicCampaignBioText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.campaignBio',
    defaultMessage: 'Lootbox description is set',
    description: 'Checklist item, displaying that the campaign bio has been already set when making a Lootbox',
  })

  const magicCampaignWebsiteText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.campaignWebsite',
    defaultMessage: 'Website in the Lootbox social links is set',
    description: 'Checklist item, displaying that the campaign website has been already set when making a Lootbox',
  })

  const magicTournamentIdText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.tournamentId',
    defaultMessage: 'This Lootbox is associated to a Tournament.',
    description: 'Checklist item, displaying that the lootbox is in an esports tournament',
  })

  const magicThemeColorText = intl.formatMessage({
    id: 'createLootbox.stepMagicLink.themeColor',
    defaultMessage: 'Lootbox theme color is set',
    description: 'Checklist item, displaying that the theme color has been already set when making a Lootbox',
  })

  return {
    magicNetworkText,
    magicLootboxTypeText,
    magicFundingTargetText,
    magicFundingLimitText,
    magicReceivingWalletText,
    magicReturnsTargetText,
    magicReturnsDateText,
    magicLogoImageText,
    magicCoverImageText,
    magicCampaignBioText,
    magicCampaignWebsiteText,
    magicTournamentIdText,
    magicThemeColorText,
  }
}
