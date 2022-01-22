import react, { useState } from 'react'
import styled from 'styled-components'
import { $SwapContainer } from 'lib/components/Swap/Swap'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import RowToken, { $BigCoinTicker, $ThinCoinName } from 'lib/components/Swap/TokenPicker/RowToken'
import {addCustomToken, useTokenList} from 'lib/hooks/useTokenList'
import { TokenData } from 'lib/hooks/useTokenList/tokenMap'
import { $Horizontal } from '../../Generics'
import $Button from '../../Button'
import { $SwapHeader, $SwapHeaderTitle } from '../SwapHeader'
import { $BlueLinkText } from '../TokenPicker'
import {  stateOfSwap } from '../state'

export interface AddTokenProps {}
const AddToken = (props: AddTokenProps) => {
	console.log(props)
	const [searchString, setSearchString] = useState("")
	const addToken = () => {
		addCustomToken({
			address: '0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31',
			decimals: 18,
			name: 'Voxel Network',
			symbol: 'VXL',
			chainId: 56,
			logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/15881.png',
			usdPrice: 0.1238
		})
		stateOfSwap.route = '/search'
	}
	return (
		<$SwapContainer>
			<$SwapHeader>
				<$SwapHeaderTitle>ADD TOKEN</$SwapHeaderTitle>
				<span onClick={() => stateOfSwap.route = '/swap'} style={{ padding: "0px 5px 0px 0px", cursor: 'pointer' }}>X</span>
			</$SwapHeader>
			
			<$Input value={searchString} onChange={(e) => setSearchString(e.target.value)} placeholder='Search Tokens...' style={{ fontWeight: 'lighter', border: `2px solid ${COLORS.warningBackground}30`, fontSize: '1.5rem', flex: 4, maxHeight: '50px' }}></$Input>
			
			<$TokenPreviewCard>
				<$CoinIcon src="https://s2.coinmarketcap.com/static/img/coins/64x64/15881.png" style={{ width: '50px', height: '50px' }}></$CoinIcon>
				<$BigCoinTicker>VXL</$BigCoinTicker>
				<$ThinCoinName>Voxel Network</$ThinCoinName>
				<$BlueLinkText>0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31</$BlueLinkText>
			</$TokenPreviewCard>

			<$Button 
				onClick={() => addToken()}
				backgroundColor={`${COLORS.dangerBackground}E0`}
				backgroundColorHover={`${COLORS.dangerBackground}`}
				color={`${COLORS.white}`}
				colorHover={COLORS.white}
				style={{ height: '100px', minHeight: '60px', fontSize: '1.5rem' }}
				>
				Import Token
			</$Button>
		</$SwapContainer>
	)
}

const $ManageTokenList = styled.span<{}>`
	font-size: 1.1rem;
	font-weight: 500;
	font-family: sans-serif;
	margin-top: 10px;
	color: ${`${COLORS.surpressedFontColor}C0`};
	flex: 1;
	text-align: center;
`

const $TokenPreviewCard = styled.div<{}>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: ${`${COLORS.surpressedBackground}10`};
	border-radius: 10px;
	padding: 30px;
	flex: 1;
	gap: 10px;
`

export default AddToken;
