import { COLORS } from 'lib/theme'
import react from 'react'
import styled from 'styled-components'
import { $Horizontal } from '../Generics'

export interface SwapHeaderProps {}
const SwapHeader = (props: SwapHeaderProps) => {
	console.log(props)
	return (
		<$SwapHeader>
			<span style={{ flex: 3, fontSize: '1rem', fontWeight: 'bold', padding: '0px 0px 0px 10px' }}>BUY GUILDFX</span>
			<$BalanceText style={{ flex: 1,  }}>Balance: 0</$BalanceText>
			<span style={{ padding: "0px 5px 0px 0px" }}>⚙️</span>
		</$SwapHeader>
	)
}

const $SwapHeader = styled.div<{}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: sans-serif;
`

const $BalanceText = styled.span`
	font-size: 1rem;
	color: ${`${COLORS.surpressedFontColor}`};
	text-align: right;
    margin-right: 20px;
    font-weight: bold;
`

export default SwapHeader;