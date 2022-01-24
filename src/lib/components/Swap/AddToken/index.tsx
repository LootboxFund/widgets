import react, { useState } from 'react'
import styled from 'styled-components'
import { $SwapContainer } from 'lib/components/Swap/Swap'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import RowToken, { $BigCoinTicker, $ThinCoinName } from 'lib/components/Swap/TokenPicker/RowToken'
import { addCustomToken, useTokenList } from 'lib/hooks/useTokenList'
import { $Horizontal } from '../../Generics'
import $Button from '../../Button'
import { $SwapHeader, $SwapHeaderTitle } from '../SwapHeader'
import { $BlueLinkText } from '../TokenPicker'
import { stateOfSwap } from '../state'
import useWindowSize from 'lib/hooks/useScreenSize'
import { truncateAddress } from 'lib/api/helpers'

export interface AddTokenProps {}
const AddToken = (props: AddTokenProps) => {
  const { screen } = useWindowSize()
  console.log(props)
  const [searchString, setSearchString] = useState('')
  const addToken = () => {
    addCustomToken({
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      decimals: 18,
      name: 'Pancake Swap',
      symbol: 'CAKE',
      chainIdHex: '0x38',
      chainIdDecimal: '56',
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
      priceOracle: '0xb6064ed41d4f67e353768aa239ca86f4f73665a1',
    })
    stateOfSwap.route = '/search'
  }
  return (
    <$SwapContainer>
      <$SwapHeader>
        <$SwapHeaderTitle>ADD TOKEN</$SwapHeaderTitle>
        <span onClick={() => (stateOfSwap.route = '/swap')} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$SwapHeader>

      <$Input
        screen={screen}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Search Tokens..."
        style={{
          fontWeight: 'lighter',
          border: `2px solid ${COLORS.warningBackground}30`,
          fontSize: screen === 'desktop' ? '1.5rem' : '1rem',
          flex: 4,
          maxHeight: '50px',
          maxWidth: screen === 'desktop' ? '100%' : '90%',
        }}
      ></$Input>

      <$TokenPreviewCard>
        <$CoinIcon
          screen={screen}
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png"
          style={{ width: '50px', height: '50px' }}
        ></$CoinIcon>
        <$BigCoinTicker screen={screen}>CAKE</$BigCoinTicker>
        <$ThinCoinName screen={screen}>Pancake Swap</$ThinCoinName>
        <$BlueLinkText onClick={() => navigator.clipboard.writeText('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')}>
          {truncateAddress(
            '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
            screen === 'desktop'
              ? {
                  prefixLength: 10,
                  suffixLength: 10,
                }
              : {
                  prefixLength: 6,
                  suffixLength: 8,
                }
          )}
        </$BlueLinkText>
      </$TokenPreviewCard>

      <$Button
        screen={screen}
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

export default AddToken
