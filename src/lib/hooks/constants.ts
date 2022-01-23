

export type TokenData = {
	address: string
	decimals: number
	name: string
	symbol: string
	chainId: number
	logoURI: string
	usdPrice?: number
	priceOracle?: string
}


export const CHAIN = {
	BSC_TESTNET: {
		CHAIN_ID: 97
	},
	BSC_MAINNET: {
		CHAIN_ID: 56
	}
}


export const BSC_MAINNET_FULL_TOKEN_LIST: TokenData[] = [
	{
		address: "0x0native",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
		name: "Binance Smart Chain",
		symbol: "BNB",
		usdPrice: 348,
		priceOracle: "0x0000000"
	},
	{
		address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
		name: "Wrapped Ethereum",
		symbol: "ETH",
		usdPrice: 2400,
		priceOracle: "0x0000000"
	},
	{
		address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
		name: "USD Coin",
		symbol: "USDC",
		usdPrice: 1,
		priceOracle: "0x0000000"
	},
	{
		address: "0x55d398326f99059ff775485246999027b3197955",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
		name: "Tether",
		symbol: "USDT",
		usdPrice: 0.997,
		priceOracle: "0x0000000"
	},
	{
		address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
		name: "Dai",
		symbol: "DAI",
		usdPrice: 0.997,
		priceOracle: "0x0000000"
	}
]


export const DEMO_CUSTOM_TOKENS_BSC_MAINNET: TokenData[] = [
    {
		address: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
		name: "Dogecoin",
		symbol: "DOGE",
		usdPrice: 0.126,
		priceOracle: "0x0000000"
	},
    {
		address: "0x23396cf899ca06c4472205fc903bdb4de249d6fc",
		chainId: 56,
		decimals: 18,
		logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7129.png",
		name: "Terra USD",
		symbol: "UST",
		usdPrice: 1.003,
		priceOracle: "0x0000000"
	}
]

export const tokenMap: Record<string, TokenData[]> = {
	[CHAIN.BSC_MAINNET.CHAIN_ID]: BSC_MAINNET_FULL_TOKEN_LIST,
	[CHAIN.BSC_TESTNET.CHAIN_ID]: [],
}