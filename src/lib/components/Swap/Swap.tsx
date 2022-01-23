import React, { useEffect } from 'react'
import { Label, Input } from '@rebass/forms'
import styled from 'styled-components'
import SwapButton from "lib/components/Swap/SwapButton"
import SwapInput from "lib/components/Swap/SwapInput"
import SwapHeader from 'lib/components/Swap/SwapHeader'
import { useSnapshot } from 'valtio'
import {useTokenList} from 'lib/hooks/useTokenList'
import { TokenData } from 'lib/hooks/constants'
import { stateOfSwap } from './state'
import { getPriceFeed } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'

export const $SwapContainer = styled.section`
	width: 100%;
	height: 100%;
	border: 0px solid transparent;
	border-radius: 20px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
	min-height: 600px;
`

interface SwapProps {
	inputToken?: TokenData;
	outputToken?: TokenData;
}
const Swap = (props: SwapProps) => {
	
	const snap = useSnapshot(stateOfSwap)
	const snapUserState = useSnapshot(userState)

	const isLoggedIn = snapUserState.accounts.length > 0

	useEffect(() => {
		if (props.inputToken) {
			stateOfSwap.inputToken.data = props.inputToken
		}
		if (props.outputToken) {
			stateOfSwap.outputToken.data = props.inputToken
		}
	}), []
	
	const clickSwap = async () => {
		console.log("Getting price data...")
		await getPriceFeed("0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee")
		console.log("Success!")
	}

	return (
		<$SwapContainer>
			<SwapHeader />
			<SwapInput selectedToken={snap.inputToken.data} targetToken="inputToken" tokenDisabled={!isLoggedIn} />
			<SwapInput selectedToken={snap.outputToken.data} targetToken="outputToken" quantityDisabled tokenDisabled={!isLoggedIn} />
			<SwapButton onClick={clickSwap}></SwapButton>
		</$SwapContainer>
	)
}

export default Swap