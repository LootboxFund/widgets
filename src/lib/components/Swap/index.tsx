import Header from 'lib/components/Header'
// import { Trans } from '@lingui/macro'
import useActiveWeb3React from 'lib/hooks/useActiveWeb3React'
import useTokenList, { DEFAULT_TOKEN_LIST } from 'lib/hooks/useTokenList'
import { TokenInfo } from '@uniswap/token-lists'
import Wallet from 'components/Wallet'
import { useMemo, useState } from 'react'
import { BoundaryProvider } from 'components/Popover'
import Input from './Input'
import Output from './Output'
import ReverseButton from './ReverseButton'
import SwapButton from './SwapButton'
// import Toolbar from './Toolbar'

interface DefaultTokenAmount {
	address?: string | { [chainId: number]: string }
	amount?: number
}

interface SwapDefaults {
	tokenList: string | TokenInfo[]
	input: DefaultTokenAmount
	output: DefaultTokenAmount
}

const DEFAULT_INPUT: DefaultTokenAmount = { address: 'ETH' }
const DEFAULT_OUTPUT: DefaultTokenAmount = {}

function useSwapDefaults(defaults: Partial<SwapDefaults> = {}): SwapDefaults {
	const tokenList = defaults.tokenList || DEFAULT_TOKEN_LIST
	const input: DefaultTokenAmount = defaults.input || DEFAULT_INPUT
	const output: DefaultTokenAmount = defaults.output || DEFAULT_OUTPUT
	input.amount = input.amount || 0
	output.amount = output.amount || 0
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => ({ tokenList, input, output }), [])
}

export interface SwapProps {
defaults?: Partial<SwapDefaults>
}

export interface CrowdSaleProps {
	defaults?: Partial<SwapDefaults>
}
const CrowdSale = ({ defaults }: CrowdSaleProps) => {
	const { tokenList } = useSwapDefaults(defaults)
  	useTokenList(tokenList)
  	const [boundary, setBoundary] = useState<HTMLDivElement | null>(null)
	const { active, account } = useActiveWeb3React()
	console.log(`active: `, active)
	console.log(`account: `, account)
	return (
		<>
			<Header logo title={<p>Swap</p>}>
				<h1 style={{ color: "red" }}>Swap Here</h1>
				<Wallet disabled={!account} />
			</Header>
			<div ref={setBoundary}>
			<BoundaryProvider value={boundary}>
				{/* <Input disabled={!active} /> */}
				<ReverseButton disabled={!active} />
				
				{/* <Output disabled={!active}>
					<Toolbar disabled={!active} />
					<SwapButton />
				</Output> */}
			</BoundaryProvider>
      		</div>
			<h1>Working?</h1>
		</>
	)
}

export default CrowdSale