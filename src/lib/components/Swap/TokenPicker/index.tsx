import react, { useState } from 'react'
import styled from 'styled-components'
import { $SwapContainer } from 'lib/components/Swap/Swap'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import RowToken from 'lib/components/Swap/TokenPicker/RowToken'
import { useCustomTokenList, useTokenList } from 'lib/hooks/useTokenList'
import { TokenData } from 'lib/hooks/constants'
import { $Horizontal, $ScrollContainer } from '../../Generics'
import $Button from '../../Button'
import { $SwapHeader, $SwapHeaderTitle } from '../SwapHeader'
import { getUserBalanceOfNativeToken, getUserBalanceOfToken, stateOfSwap } from '../state'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import { useWeb3 } from 'lib/hooks/useWeb3Api'

export interface TokenPickerProps {}
const TokenPicker = (props: TokenPickerProps) => {
  console.log(props)

  const web3 = useWeb3()
  const snap = useSnapshot(stateOfSwap)
  const snapUserState = useSnapshot(userState)
  const snapSwapState = useSnapshot(stateOfSwap)

  const tokenList = useTokenList()
  const customTokenList = useCustomTokenList()

  const [searchString, setSearchString] = useState('')

  const selectToken = async (token: TokenData) => {
    console.log('selectToken')
    console.log(snap)
    console.log(token)
    console.log(`
			
			${token.address}

		`)
    let tokenBalance = 0
    if (snapUserState.currentAccount && snapSwapState.targetToken && stateOfSwap[snapSwapState.targetToken]) {
      if (token.address === '0x0native') {
        console.log('Get native token')
        tokenBalance = await getUserBalanceOfNativeToken(snapUserState.currentAccount)
      } else {
        // get coin balance
        // userState.displayedBalance
        tokenBalance = await getUserBalanceOfToken(token.address, snapUserState.currentAccount)
      }
      if (snap.targetToken !== null) {
        stateOfSwap[snap.targetToken].data = token
        console.log(`
          
        ---- tokenBalance

        `)
        console.log(tokenBalance)
        const balanceInEther = (await web3).utils.fromWei(tokenBalance.toString(), 'ether')
        console.log(balanceInEther)
        stateOfSwap[snapSwapState.targetToken].displayedBalance = balanceInEther
        stateOfSwap.route = '/swap'
      }
    }
  }
  const searchFilter = (token: TokenData) => {
    return (
      token.symbol.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
      token.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
    )
  }
  const currentToken = snap.targetToken !== null ? stateOfSwap[snap.targetToken].data : null
  return (
    <$SwapContainer>
      <$SwapHeader>
        <$SwapHeaderTitle>SELECT TOKEN</$SwapHeaderTitle>
        <span onClick={() => (stateOfSwap.route = '/swap')} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$SwapHeader>
      <>
        <$Horizontal>
          <$Input
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search Tokens..."
            style={{
              fontWeight: 'lighter',
              border: `2px solid ${COLORS.warningBackground}30`,
              fontSize: '1.5rem',
              flex: 4,
            }}
          ></$Input>
          <$Button
            onClick={() => (stateOfSwap.route = '/add')}
            backgroundColor={`${COLORS.warningBackground}E0`}
            color={COLORS.white}
            backgroundColorHover={`${COLORS.warningBackground}`}
            style={{ flex: 1, marginLeft: '10px', height: '70px', fontSize: '1.5rem', fontWeight: 800 }}
          >
            + New
          </$Button>
        </$Horizontal>
        <$ScrollContainer>
          {tokenList
            .concat(customTokenList)
            .filter(searchFilter)
            .map((token) => {
              const disabled =
                [snap.inputToken.data?.address, snap.outputToken.data?.address].includes(token.address) &&
                (currentToken ? currentToken.address !== token.address : true)
              return (
                <div key={token.symbol} onClick={() => !disabled && selectToken(token)}>
                  <RowToken token={token} disabled={disabled} />
                </div>
              )
            })}
        </$ScrollContainer>
      </>
      <$BlueLinkText onClick={() => (stateOfSwap.route = '/customs')}>Manage Token Lists</$BlueLinkText>
    </$SwapContainer>
  )
}

export const $BlueLinkText = styled.span<{}>`
  font-size: 1.1rem;
  font-weight: 500;
  font-family: sans-serif;
  margin-top: 10px;
  color: #073effc0;
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export default TokenPicker
