import react from "react"
import styled from "styled-components"

export const $Button = styled.button<{
	backgroundColor?: string;
	color?: string;
	colorHover?: string,
	backgroundColorHover?: string,
	disabled?: boolean;
}>`
	padding: 10px;
	box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
	border-radius: 10px;
	flex: 1;
	min-height: 40px;
	max-height: 50px;
	height: 40px;
	font-size: 1rem;
	font-weight: 700;
	font-family: sans-serif;
	border: 0px solid transparent;
	${props => props.disabled ? 'cursor: not-allowed' : 'cursor: pointer'};
	${props => props.color && `color: ${props.color}`};
	${props => props.backgroundColor && `background-color: ${props.backgroundColor}`};
	&:hover {
		${props => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
		${props => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
	}
`
export default $Button