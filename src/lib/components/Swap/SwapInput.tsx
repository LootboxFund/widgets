import react from 'react'
import styled, { css } from 'styled-components'
import { COLORS } from "lib/theme"
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Button'

export interface SwapInputProps {
	selectedToken?: string;
}
const SwapInput = (props: SwapInputProps) => {
	return (
		<$SwapInput>
			<$Horizontal flex={1}>
				<$Vertical flex={3}>
					<$Input value={23355} type="number"></$Input>
					<$FineText>$345,466</$FineText>
				</$Vertical>
				{
					props.selectedToken
					?
					<$Button
						backgroundColor={`${COLORS.white}10`}
						backgroundColorHover={`${COLORS.surpressedBackground}50`}
						color={COLORS.black}
						style={{ height: '30px', fontSize: '1rem', fontWeight: 'bold', padding: '5px 20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
					>
						<$CoinIcon src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png">
						</$CoinIcon>
						ETH
					</$Button>
					:
					<$Button
						backgroundColor={`${COLORS.dangerFontColor}80`}
						backgroundColorHover={`${COLORS.dangerFontColor}`}
						color={COLORS.trustFontColor}
						style={{ height: '20px', fontSize: '1rem', fontWeight: 'lighter', padding: '5px 20px' }}
					>
						
						Select Token 
					</$Button>
				}
				
			</$Horizontal>
		</$SwapInput>
	)
}

const $SwapInput = styled.div<{}>`
	flex: 1;
	font-size: 1.5rem;
	padding: 10px 10px 15px 10px;
	background-color: ${`${COLORS.surpressedBackground}20`};
	border: 0px solid transparent;
	border-radius: 10px;
	display: flex;
`

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

export const $FineText = styled.span<{  }>`
	font-size: 0.9rem;
	padding: 0px 0px 0px 10px;
	font-weight: lighter;
	font-family: sans-serif;
`

export const $CoinIcon = styled.img<{}>`
	width: 1.5rem;
	height: 1.5rem;
	margin-right: 10px;
`

export default SwapInput;