import type { providers } from 'ethers';
/**
 * Fetches and decodes the result of an ENS contenthash lookup on mainnet to a URI
 * @param ensName to resolve
 * @param provider provider to use to fetch the data
 */
export default function resolveENSContentHash(ensName: string, provider: providers.Provider): Promise<string>;
