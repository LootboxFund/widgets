import { IntlShape, useIntl } from 'react-intl'
import { LootboxType } from './StepChooseType'

interface BlockChainWords {
  chainName: string
  nativeSymbol: string
}

/**
 * @deprecated should use Hook pattern, see useWords below
 */
export const getWords = ({
  intl,
  blockchain,
  lootboxType,
  returnDate,
  returnsTarget,
  receivingWallet,
  fundingLimit,
  fundingTarget,
}: {
  intl: IntlShape
  blockchain: BlockChainWords
  lootboxType: LootboxType | string
  returnDate: string
  returnsTarget: string
  receivingWallet: string
  fundingLimit: string
  fundingTarget: string
}) => {
  const magicNetworkText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.network',
      defaultMessage: 'Network set to {network}',
      description: 'Checklist item, displaying that the blockchain network has been already set when making a Lootbox',
    },
    { network: blockchain.chainName }
  )

  const magicLootboxTypeText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.type',
      defaultMessage: 'Funding type set to {type}',
      description: 'Checklist item, displaying that the lootbox type has been already set when making a Lootbox',
    },
    {
      type: lootboxType,
    }
  )

  const magicFundingTargetText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.fundingTarget',
      defaultMessage: 'Funding target set to {fundingTarget} {currency}',
      description:
        'Checklist item, displaying that the funding target has been already set when making a Lootbox. This is someithing like "10 ETH"',
    },
    {
      //   fundingTarget: parseFloat(ethers.utils.formatUnits(props.fundingTarget || '0', '18').toString()).toFixed(4),
      fundingTarget: fundingTarget,
      currency: blockchain.nativeSymbol,
    }
  )

  const magicFundingLimitText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.fundingLimit',
      defaultMessage: 'Funding limit set to {fundingLimit} {currency}',
      description:
        'Checklist item, displaying that the funding limit has been already set when making a Lootbox. (Funding limit is different than funding target)',
    },
    {
      //   fundingLimit: parseFloat(ethers.utils.formatUnits(props.fundingLimit || '0', '18').toString()).toFixed(4),
      fundingLimit: fundingLimit,
      currency: blockchain.nativeSymbol,
    }
  )

  const magicReceivingWalletText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.receivingWallet',
      defaultMessage: 'Receiving wallet set to {receivingWallet}',
      description: 'Checklist item, displaying that the receiving wallet has been already set when making a Lootbox',
    },
    {
      receivingWallet: receivingWallet,
    }
  )

  const magicReturnsTargetText = intl.formatMessage(
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

  const magicReturnsDateText = intl.formatMessage(
    {
      id: 'createLootbox.stepMagicLink.returnsDate',
      defaultMessage: 'Returns date set to {returnsDate}',
      description: 'Checklist item, displaying that the returns date has been already set when making a Lootbox.',
    },
    {
      returnsDate: returnDate,
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

export const useWords = () => {
  const intl = useIntl()

  const pleaseUploadALogoImage = intl.formatMessage({
    id: 'createLootbox.stepCustomize.logoFile.error',
    defaultMessage: 'Please upload a logo image',
    description: 'Error message for user if they forgot to upload a logo file (image file)',
  })

  const pleaseUploadACoverPhoto = intl.formatMessage({
    id: 'createLootbox.stepCustomize.coverFile.error',
    defaultMessage: 'Please upload a cover photo',
    description: 'Error message for user if they forgot to upload a cover file (image file)',
  })

  const biographyMustBeAtLeast20Characters = intl.formatMessage({
    id: 'createLootbox.stepCustomize.biography.error',
    defaultMessage: 'Biography must be at least 12 characters',
    description: 'Error message for user if they forgot to enter a valid biography for their Lootbox',
  })

  const themeColorMustBeAValidHexColor = intl.formatMessage({
    id: 'createLootbox.stepCustomize.themeColor.error',
    defaultMessage: 'Theme color must be a valid hex color',
    description:
      'Error message for user if they forgot to enter a valid themecolor which should be HEX format (i.e. #fefefe)',
  })

  const invalidEmail = intl.formatMessage({
    id: 'step.socials.email.invalid',
    defaultMessage: 'Invalid email',
    description: 'When a user enters an invalid email address, this message is shown.',
  })

  const emailIsMandatory = intl.formatMessage({
    id: 'step.socials.email.empty',
    defaultMessage: 'Email is mandatory',
    description: 'When a user does not enter an email address, this message is shown.',
  })

  const submittingElapsedTimeFn = (timeElapsed: number) =>
    intl.formatMessage(
      {
        id: 'step.terms.submit.pending-submissino',
        defaultMessage: '... submitting ({timeElapsed})',
        description: 'Message shown to user when they are waiting for they Lootbox to be made',
      },
      { timeElapsed: timeElapsed }
    )

  const preparingElapsedTimeFn = (timeElapsed: number) =>
    intl.formatMessage(
      {
        id: 'step.terms.submit.success-preparing',
        defaultMessage: '... Preparing your Lootbox ({timeLeft})',
        description: 'Success message shown to user when create Lootbox succeeds',
      },
      {
        timeElapsed: timeElapsed,
      }
    )

  const viewYourLootbox = intl.formatMessage({
    id: 'step.terms.submit.success',
    defaultMessage: 'View Your Lootbox',
    description: 'Success message shown to user when create Lootbox succeeds',
  })

  const failedTryAgain = intl.formatMessage({
    id: 'step.terms.submit.failed',
    defaultMessage: 'Failed, try again?',
    description: 'Failure message shown to user when create Lootbox fails',
  })

  const joinLootboxTournament = intl.formatMessage({
    id: 'quickCreateLootbox.singleStep.heading',
    defaultMessage: 'Join Lootbox Tournament',
    description: 'Header for quickly creating a Lootbox to join a tournament',
  })

  const lootboxName = intl.formatMessage({
    id: 'createLootbox.customizeTicket.inputName',
    defaultMessage: 'Lootbox Name',
    description: 'Label for name input creating a Lootbox - this is a name for the Lootbox',
  })

  const lootboxNameHelp = intl.formatMessage({
    id: 'createLootbox.customizeTicket.inputName.toolTip',
    defaultMessage:
      'The name of your Lootbox. It can be your name, your mission, or just something catchy. Keep in mind that you will likely have multiple Lootboxes in the future, so try to have a uniquely identifyable name to reduce confusion.',
    description: 'Tooltip for name input in creating a Lootbox',
  })

  const biography = intl.formatMessage({
    id: 'createLootbox.customizeTicket.inputBiography',
    defaultMessage: 'Biography',
    description: 'Label for biography input. This is a field the user can input a description of their Lootbox.',
  })

  const biographyHelp = intl.formatMessage({
    id: 'createLootbox.customizeTicket.inputBiography.tooltip',
    defaultMessage: 'Write a 3-5 sentence introduction of yourself',
    description: 'tooltip for people who might be confused about what the Lootbox biography field is',
  })

  const uploadLogoFn = (icon: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.customizeTicket.inputLogo.prompt',
        defaultMessage: '{icon} Upload Logo',
        description: 'Label for input field for Lootbox logo (image file)',
      },
      {
        icon,
      }
    )

  const uploadCoverFn = (icon: string) =>
    intl.formatMessage(
      {
        id: 'createLootbox.customizeTicket.inputCover.prompt',
        defaultMessage: '{icon} Upload Cover',
        description: 'Label for input field for Lootbox cover file (image file)',
      },
      { icon }
    )

  return {
    pleaseUploadALogoImage,
    pleaseUploadACoverPhoto,
    biographyMustBeAtLeast20Characters,
    themeColorMustBeAValidHexColor,
    invalidEmail,
    emailIsMandatory,
    submittingElapsedTimeFn,
    preparingElapsedTimeFn,
    viewYourLootbox,
    failedTryAgain,
    joinLootboxTournament,
    lootboxName,
    lootboxNameHelp,
    biography,
    biographyHelp,
    uploadLogoFn,
    uploadCoverFn,
  }
}
