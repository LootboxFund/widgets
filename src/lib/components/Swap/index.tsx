import React from 'react'
import { Label, Input } from '@rebass/forms'
import styled from 'styled-components'
import SwapButton from "lib/components/Swap/SwapButton"
import SwapInput from "lib/components/Swap/SwapInput"
import SwapHeader from 'lib/components/Swap/SwapHeader'

const $SwapContainer = styled.section`
	width: 100%;
	height: 100%;
	border: 0px solid transparent;
	border-radius: 20px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`

const Swap = () => {
	return (
		<$SwapContainer>
			<SwapHeader />
			<SwapInput />
			<SwapInput selectedToken="BNB" />
			<SwapButton onClick={() => console.log("hello")}></SwapButton>
		</$SwapContainer>
	)
}

export default Swap