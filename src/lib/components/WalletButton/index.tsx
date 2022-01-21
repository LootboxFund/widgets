import react from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'

export interface WalletButtonProps {}
const WalletButton = (props: WalletButtonProps) => {
	return (
		<$WalletButton>
			<$Button 
				color={`${COLORS.dangerFontColor}90`}
				colorHover={COLORS.dangerFontColor}
				backgroundColor={`${COLORS.dangerBackground}80`}
				backgroundColorHover={`${COLORS.dangerBackground}`}
				style={{ minHeight: '50px', border: `1px solid ${COLORS.dangerFontColor}40`, fontWeight: 500, fontSize: '1.2rem' }}
				>
				Connect Wallet
			</$Button>
		</$WalletButton>
	)
}

const $WalletButton = styled.div<{}>`
	display: flex;
	width: 200px;
`

export default WalletButton;