import { useUserInfo, useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { $Horizontal } from '../Generics'

export interface SwapHeaderProps {}
const SwapHeader = (props: SwapHeaderProps) => {
	console.log(props)
	const snapUserState = useSnapshot(userState)
	return (
		<$SwapHeader>
			<$SwapHeaderTitle>BUY GUILDFX</$SwapHeaderTitle>
			<$BalanceText style={{ flex: 1,  }}>Balance: {snapUserState.displayedBalance}</$BalanceText>
			<span style={{ padding: "0px 5px 0px 0px" }}>⚙️</span>
		</$SwapHeader>
	)
}

export const $SwapHeaderTitle = styled.span<{  }>`
	flex: 3;
	font-size: 1rem;
	font-weight: bold;
	padding: 0px 0px 0px 10px;
`

export const $SwapHeader = styled.div<{}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: sans-serif;
`

export const $BalanceText = styled.span`
	font-size: 1rem;
	color: ${`${COLORS.surpressedFontColor}`};
	text-align: right;
    margin-right: 20px;
    font-weight: bold;
`

export default SwapHeader;