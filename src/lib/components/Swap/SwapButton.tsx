import { $Button } from "lib/components/Button"
import { COLORS } from "lib/theme"

export interface SwapButtonProps {
	onClick: () => void
}
const SwapButton = (props: SwapButtonProps) => {
	const walletState = "disconnected"
	const inputToken = ""
	if (walletState === "disconnected") {
		return (
			<$Button 
				onClick={props.onClick}
				backgroundColor={`${COLORS.dangerBackground}40`}
				backgroundColorHover={`${COLORS.dangerBackground}80`}
				color={`${COLORS.dangerFontColor}60`}
				colorHover={COLORS.dangerFontColor}
				style={{ height: '100px', minHeight: '60px' }}
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
				color={`${COLORS.surpressedFontColor}80`}
				style={{ fontWeight: 'lighter', cursor: 'not-allowed', minHeight: '60px', height: '100px' }}
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
			style={{ minHeight: '60px', height: '100px' }}
		>
			PURCHASE
		</$Button>
	)
}

export default SwapButton;