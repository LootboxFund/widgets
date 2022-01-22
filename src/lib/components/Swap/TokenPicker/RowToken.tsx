import react from 'react'
import styled from 'styled-components'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import { COLORS } from 'lib/theme'
import { $Horizontal } from '../../Generics'
import { TokenData } from 'lib/hooks/useTokenList/tokenMap'
import { stateOfSwap } from '../state'
import { useSnapshot } from 'valtio'
import { removeCustomToken } from 'lib/hooks/useTokenList'

export interface RowTokenProps {
	token: TokenData;
	disabled?: boolean;
	copyable?: boolean;
	deleteable?: boolean;
}
const RowToken = (props: RowTokenProps) => {
	const snap = useSnapshot(stateOfSwap)
	const removeToken = () => {
		console.log(props.token.chainId)
		removeCustomToken(props.token.address, props.token.chainId)
	}
	return (
		<$RowToken disabled={props.disabled}>
			<$Horizontal>
				<$CoinIcon src={props.token.logoURI} style={{ width: '30px', height: '30px' }}></$CoinIcon>
				<$BigCoinTicker>{props.token.symbol}</$BigCoinTicker>
			</$Horizontal>
			<$ThinCoinName>{props.token.name}</$ThinCoinName>
			{
				props.copyable || props.deleteable
				?
				<div>
					{
						props.copyable && <$CopyButton onClick={() => navigator.clipboard.writeText(props.token.address)}>📑</$CopyButton>
					}
					{
						props.deleteable && <$DeleteButton onClick={removeToken}>🗑</$DeleteButton>
					}
				</div>
				:
				null
			}
				
			
		</$RowToken>
	)
}

const $RowToken = styled.div<{ disabled?: boolean; }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	flex: 1;
	background-color: ${`${COLORS.black}04`};
	padding: 20px;
	border-radius: 10px;
	max-height: 50px;
	${props => props.disabled ? 'cursor: not-allowed' : 'cursor: pointer'};
	${props => props.disabled ? 'background-color: rgba(0,0,0,0.1);' : 'background-color: rgba(0,0,0,0.03);'};
	&:hover {
		${props => props.disabled ? 'background-color: rgba(0,0,0,0.1);' : `background-color: ${`${COLORS.warningBackground}30`}`};
	}
`

export const $BigCoinTicker = styled.span<{}>`
	font-size: 1.5rem;
	font-weight: bold;
	font-family: sans-serif;
`

export const $ThinCoinName = styled.span<{}>`
	font-size: 1.2rem;
	font-weight: 400;
	font-family: sans-serif;
	color: ${COLORS.surpressedFontColor};
`

export const $CopyButton = styled.span<{}>`
	border-radius: 10px;
	padding: 10px;
	margin: 0px 5px;
	cursor: pointer;
	text-align: center;
	&:hover {
		background-color: ${`${COLORS.surpressedBackground}30`};
	}
`
export const $DeleteButton = styled.span<{}>`
	border-radius: 10px;
	padding: 10px;
	margin: 0px 5px;
	cursor: pointer;
	text-align: center;
	&:hover {
		background-color: ${`${COLORS.surpressedBackground}30`};
	}
`

export default RowToken;