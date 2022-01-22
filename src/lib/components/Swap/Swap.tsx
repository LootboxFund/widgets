import React, { useEffect } from 'react'
import { Label, Input } from '@rebass/forms'
import styled from 'styled-components'
import SwapButton from "lib/components/Swap/SwapButton"
import SwapInput from "lib/components/Swap/SwapInput"
import SwapHeader from 'lib/components/Swap/SwapHeader'
import { useSnapshot } from 'valtio'
import {useTokenList} from 'lib/hooks/useTokenList'
import { TokenData } from 'lib/hooks/useTokenList/tokenMap'
import { stateOfSwap } from './state'

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
	const tokenList = useTokenList()

	useEffect(() => {
		if (props.inputToken) {
			stateOfSwap.inputToken.data = props.inputToken
		}
		if (props.outputToken) {
			stateOfSwap.outputToken.data = props.inputToken
		}
	}), []
	
	const clickSwap = () => {
		console.log(tokenList)
	}

	return (
		<$SwapContainer>
			<SwapHeader />
			<SwapInput selectedToken={snap.inputToken.data} targetToken="inputToken" />
			<SwapInput selectedToken={snap.outputToken.data} targetToken="outputToken" quantityDisabled />
			<SwapButton onClick={clickSwap}></SwapButton>
		</$SwapContainer>
	)
}

export default Swap