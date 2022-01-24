import react, { useState } from 'react'
import styled from 'styled-components'
import { $SwapContainer } from 'lib/components/Swap/Swap'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import RowToken from 'lib/components/Swap/TokenPicker/RowToken'
import { stateOfTokenList, useCustomTokenList, useTokenList } from 'lib/hooks/useTokenList'
import { TokenData } from 'lib/hooks/constants'
import { $Horizontal } from '../../Generics'
import $Button from '../../Button'
import { useSnapshot } from 'valtio'
import { $SwapHeader, $SwapHeaderTitle } from '../SwapHeader'
import { stateOfSwap } from '../state'
import useWindowSize from 'lib/hooks/useScreenSize'

export interface ManageTokensProps {}
const ManageTokens = (props: ManageTokensProps) => {
  console.log(props)
  const snap = useSnapshot(stateOfTokenList)
  const { screen } = useWindowSize()
  const customTokenList = snap.customTokenList
  const [searchString, setSearchString] = useState('')
  const searchFilter = (token: TokenData) => {
    return (
      token.symbol.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
      token.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
      token.address.toLowerCase().indexOf(searchString.toLowerCase()) > -1
    )
  }
  return (
    <$SwapContainer>
      <$SwapHeader>
        <$SwapHeaderTitle>CUSTOM TOKENS</$SwapHeaderTitle>
        <span onClick={() => (stateOfSwap.route = '/swap')} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$SwapHeader>
      <>
        <$Horizontal>
          <$Input
            screen={screen}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Filter Custom Tokens..."
            style={{
              fontWeight: 'lighter',
              border: `2px solid ${COLORS.warningBackground}30`,
              fontSize: screen === 'desktop' ? '1.5rem' : '1rem',
              flex: 4,
            }}
          ></$Input>
          <$Button
            screen={screen}
            onClick={() => (stateOfSwap.route = '/add')}
            backgroundColor={`${COLORS.warningBackground}E0`}
            color={COLORS.white}
            backgroundColorHover={`${COLORS.warningBackground}`}
            style={{
              flex: 1,
              marginLeft: '10px',
              minHeight: screen === 'desktop' ? '70px' : '50px',
              height: '70px',
              fontSize: screen === 'desktop' ? '1.5rem' : '1rem',
              fontWeight: 800,
            }}
          >
            + New
          </$Button>
        </$Horizontal>

        {customTokenList.filter(searchFilter).map((token) => (
          <RowToken key={token.symbol} token={token} copyable deleteable />
        ))}
        {customTokenList.filter(searchFilter).length === 0 && (
          <$NoTokensPrompt>No Custom Tokens Added Yet</$NoTokensPrompt>
        )}
      </>
    </$SwapContainer>
  )
}

const $NoTokensPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${COLORS.surpressedFontColor}60;
  font-family: sans-serif;
`

export default ManageTokens
