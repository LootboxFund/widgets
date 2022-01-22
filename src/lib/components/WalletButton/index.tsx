import react from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import Web3 from 'web3'
import { useSnapshot } from 'valtio'
import { state } from 'lib/state/valtio'


export interface WalletButtonProps {}
const WalletButton = (props: WalletButtonProps) => {
	console.log(props)

	const snap = useSnapshot(state)

	const connectWallet = async () => {
		console.log("Connecting to wallet...")
		const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
		console.log(web3.version)
		console.log(web3.eth.accounts)
		++state.count
	}

	return (
		<$WalletButton>
			<$Button 
				onClick={connectWallet}
				color={`${COLORS.dangerFontColor}90`}
				colorHover={COLORS.dangerFontColor}
				backgroundColor={`${COLORS.dangerBackground}80`}
				backgroundColorHover={`${COLORS.dangerBackground}`}
				style={{ minHeight: '50px', border: `1px solid ${COLORS.dangerFontColor}40`, fontWeight: 500, fontSize: '1.2rem' }}
				>
				Connect Wallet
			</$Button>
			<span>{snap.count}</span>
		</$WalletButton>
	)
}

const $WalletButton = styled.div<{}>`
	display: flex;
	width: 200px;
`

export default WalletButton;