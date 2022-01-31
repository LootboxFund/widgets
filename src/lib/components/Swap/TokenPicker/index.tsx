import react, { useState } from 'react'
import styled from 'styled-components'
import { $SwapContainer } from 'lib/components/Swap/Swap'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/Swap/SwapInput'
import RowToken from 'lib/components/Swap/TokenPicker/RowToken'
import { useCustomTokenList, useTokenList } from 'lib/hooks/useTokenList'
import { TokenDataFE } from 'lib/hooks/constants'
import { $Horizontal, $ScrollContainer } from '../../Generics'
import $Button from '../../Button'
import { $SwapHeader, $SwapHeaderTitle } from '../SwapHeader'
import { getUserBalanceOfNativeToken, getUserBalanceOfToken, swapState } from '../state'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import useWindowSize from 'lib/hooks/useScreenSize'
import { Address } from '@guildfx/helpers'

export interface TokenPickerProps {
  /** If specified, locks the picker to only these addresses */
  specificAddresses: Address[] | undefined
}

const arrayIsEmpty = (arr: any[] | undefined) => {
  return !arr || arr.length === 0
}

const TokenPicker = (props: TokenPickerProps) => {
  const web3 = useWeb3()
  const snap = useSnapshot(swapState)
  const snapUserState = useSnapshot(userState)
  const snapSwapState = useSnapshot(swapState)
  const { screen } = useWindowSize()

  const tokenList = useTokenList()
  const customTokenList = useCustomTokenList()

  const [searchString, setSearchString] = useState('')

  const selectToken = async (token: TokenDataFE, isDisabled: boolean) => {
    if (isDisabled) return
    let tokenBalance = 0
    if (snapUserState.currentAccount && snapSwapState.targetToken) {
      if (token.address === '0x0native') {
        tokenBalance = await getUserBalanceOfNativeToken(snapUserState.currentAccount)
      } else {
        tokenBalance = await getUserBalanceOfToken(token.address, snapUserState.currentAccount)
      }
      if (snap.targetToken !== null) {
        swapState[snap.targetToken].data = token
        const balanceInEther = (await web3).utils.fromWei(tokenBalance.toString(), 'ether')
        swapState[snapSwapState.targetToken].displayedBalance = balanceInEther
        swapState.route = '/swap'
      }
    }
  }
  const searchFilter = (token: TokenDataFE) => {
    return (
      token.symbol.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
      token.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
      token.address.toLowerCase().indexOf(searchString.toLowerCase()) > -1
    )
  }
  const filterSpecificAddresses = (token: TokenDataFE) => {
    if (arrayIsEmpty(props.specificAddresses) || !props.specificAddresses) {
      return true
    } else {
      return (
        props.specificAddresses.map((address: string) => address.toLowerCase()).indexOf(token.address.toLowerCase()) >
        -1
      )
    }
  }

  const currentToken = snap.targetToken !== null ? swapState[snap.targetToken].data : null
  return (
    <$SwapContainer>
      <$SwapHeader>
        <$SwapHeaderTitle>SELECT TOKEN</$SwapHeaderTitle>
        <span onClick={() => (swapState.route = '/swap')} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$SwapHeader>
      <>
        <$Horizontal>
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
            }}
          ></$Input>
          {arrayIsEmpty(props.specificAddresses) && (
            <$Button
              screen={screen}
              onClick={() => (swapState.route = '/add')}
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
          )}
        </$Horizontal>
        <$ScrollContainer>
          {tokenList
            .concat(customTokenList)
            .filter(searchFilter)
            .filter(filterSpecificAddresses)
            .map((token) => {
              const disabled =
                [snap.inputToken.data?.address, snap.outputToken.data?.address].includes(token.address) &&
                (currentToken ? currentToken.address !== token.address : true)

              return (
                <div key={token.symbol} onClick={() => selectToken(token, disabled)}>
                  <RowToken token={token} disabled={disabled} />
                </div>
              )
            })}
        </$ScrollContainer>
      </>
      <$BlueLinkText onClick={() => (swapState.route = '/customs')}>Manage Token Lists</$BlueLinkText>
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
