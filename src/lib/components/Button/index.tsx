import react from "react"
import styled from "styled-components"
import { COLORS } from "lib/theme"

export interface ButtonProps {
	style: React.CSSProperties
	onClick: () => void
}
const Button = (props: ButtonProps) => {
	const walletState = "connected"
	const inputToken = "bnb"
	if (walletState === "disconnected") {
		return (
			<$Button 
				onClick={props.onClick}
				backgroundColor={`${COLORS.dangerBackground}40`}
				backgroundColorHover={`${COLORS.dangerBackground}80`}
				color={`${COLORS.dangerFontColor}60`}
				colorHover={COLORS.dangerFontColor}
				>
				Connect Wallet
			</$Button>
		)
	}
	if (walletState === "connected" && !inputToken) {
		return (
			<$Button 
				onClick={props.onClick}
				backgroundColor={`${COLORS.surpressedBackground}40`}
				color={`${COLORS.surpressedFont}80`}
				style={{ fontWeight: 'lighter', cursor: 'not-allowed' }}
				>
				Select a Token
			</$Button>
		)
	}
	return (
		<$Button
			onClick={props.onClick}
			backgroundColor={`${COLORS.trustBackground}C0`}
			backgroundColorHover={`${COLORS.trustBackground}`}
			color={COLORS.trustFontColor}
		>
			PURCHASE
		</$Button>
	)
}

const $Button = styled.button<{
	backgroundColor?: string;
	color?: string;
	colorHover?: string,
	backgroundColorHover?: string,
}>`
	padding: 20px;
	box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
	border-radius: 10px;
	width: 100%;
	font-size: 1rem;
	font-weight: 700;
	border: 0px solid transparent;
	cursor: pointer;
	${props => props.color && `color: ${props.color}`};
	${props => props.backgroundColor && `background-color: ${props.backgroundColor}`};
	&:hover {
		${props => props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
		${props => props.colorHover && `color: ${props.colorHover}`};
	}
`
export default Button