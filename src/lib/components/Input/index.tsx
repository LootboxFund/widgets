import { COLORS } from "lib/theme"
import React from "react"
import styled from "styled-components"

export const $Input = styled.input<{}>`
	flex: 1;
	height: 50px;
	padding: 10px;
	font-size: 2rem;
	font-weight: bold;
	border: 0px solid transparent;
	border-radius: 10px;
	background-color: rgba(0,0,0,0);
	font-family: sans-serif;
`

export default $Input