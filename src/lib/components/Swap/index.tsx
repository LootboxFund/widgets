import React from 'react'
import { Label, Input } from '@rebass/forms'
import styled from 'styled-components'
import Button from "lib/components/Button"

const $SwapContainer = styled.section`
	width: 100%;
	height: 100%;
	border: 1px solid #ccc;
	border-radius: 10px;
	padding: 20px;
`

const Swap = () => {
	return (
		<$SwapContainer>
			<h1>Swap</h1>
			<Label htmlFor='inputAmount'>Input</Label>
			<Input
				id='inputAmount'
				name='inputAmount'
				type='number'
				placeholder="0"
			/>
			<Label htmlFor='outputAmount'>Output</Label>
			<Input
				id='outputAmount'
				name='outputAmount'
				type='number'
				placeholder="0"
			/>
			<Button onClick={() => console.log("hello")}><p>Swap</p></Button>
		</$SwapContainer>
	)
}

export default Swap