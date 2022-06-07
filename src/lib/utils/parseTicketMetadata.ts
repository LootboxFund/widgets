import { ContractAddress, ITicketMetadataDeprecated } from '@wormgraph/helpers'
import { LootboxMetadata } from '../api/graphql/generated/types'

interface ExtendedTicketMetadataDeprecated {
  data: ITicketMetadataDeprecated
}

export const parseLootboxMetadata = (metadata: LootboxMetadata | ExtendedTicketMetadataDeprecated): LootboxMetadata => {
  // @ts-ignore - because of the extended metadata
  if (metadata?.data != null) {
    // Deprecated metadata structure - needed for backwards compatibility
    const castedMetada = metadata as ExtendedTicketMetadataDeprecated
    const coercedMetadata: LootboxMetadata = {
      external_url: '', // Not used in FE
      description: castedMetada?.data?.description || '',
      name: castedMetada?.data?.name || '',
      background_color: castedMetada?.data?.backgroundColor || '',
      image: castedMetada?.data?.image || '',
      animation_url: '',
      youtube_url: '',
      lootboxCustomSchema: {
        version: '0',
        chain: {
          address: castedMetada?.data?.address || ('' as ContractAddress),
          title: '',
          chainIdHex: castedMetada?.data?.lootbox?.chainIdHex || '',
          chainIdDecimal: castedMetada?.data?.lootbox?.chainIdDecimal || '',
          chainName: castedMetada?.data?.lootbox?.chainName || '',
        },
        lootbox: {
          name: castedMetada?.data?.name || '',
          description: castedMetada?.data?.description || '',
          image: castedMetada?.data?.image || '',
          backgroundColor: castedMetada?.data?.backgroundColor || '',
          backgroundImage: castedMetada?.data?.backgroundImage || '',
          badgeImage: castedMetada?.data?.badgeImage || '',
          targetPaybackDate: castedMetada?.data?.lootbox?.targetPaybackDate || 0,
          createdAt: castedMetada?.data?.lootbox?.createdAt || 0,
          fundraisingTarget: castedMetada?.data?.lootbox?.fundraisingTarget || '',
          fundraisingTargetMax: castedMetada?.data?.lootbox?.fundraisingTargetMax || '',
          basisPointsReturnTarget: castedMetada?.data?.lootbox?.basisPointsReturnTarget || '',
          returnAmountTarget: castedMetada?.data?.lootbox?.returnAmountTarget || '',
          pricePerShare: castedMetada?.data?.lootbox?.pricePerShare || '',
          lootboxThemeColor: castedMetada?.data?.lootbox?.lootboxThemeColor || '',
          transactionHash: castedMetada?.data?.lootbox?.transactionHash || '',
          blockNumber: castedMetada?.data?.lootbox?.blockNumber || '',
          factory: '',
        },
        socials: {
          twitter: castedMetada?.data?.socials?.twitter || '',
          email: castedMetada?.data?.socials?.email || '',
          instagram: castedMetada?.data?.socials?.instagram || '',
          tiktok: castedMetada?.data?.socials?.tiktok || '',
          facebook: castedMetada?.data?.socials?.facebook || '',
          discord: castedMetada?.data?.socials?.discord || '',
          youtube: castedMetada?.data?.socials?.youtube || '',
          snapchat: castedMetada?.data?.socials?.snapchat || '',
          twitch: castedMetada?.data?.socials?.twitch || '',
          web: castedMetada?.data?.socials?.web || '',
        },
      },
    }
    return coercedMetadata
  } else {
    // New metadata structure
    return metadata as LootboxMetadata
  }
}
