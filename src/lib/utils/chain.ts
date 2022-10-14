import { BLOCKCHAINS, ChainIDHex, chainIdHexToSlug, ChainSlugs } from '@wormgraph/helpers'

export const getBlockExplorerUrl = (chainIDHex: ChainIDHex) => {
  const chainSlug = chainIdHexToSlug(chainIDHex)
  if (chainSlug && BLOCKCHAINS[chainSlug]) {
    return BLOCKCHAINS[chainSlug].blockExplorerUrls[0]
  }
  return ChainSlugs.POLYGON_MAINNET // Default polygon
}
