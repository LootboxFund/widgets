import react, { useState } from 'react'
import styled from 'styled-components'
import { $CrowdSaleContainer } from 'lib/components/CrowdSale/CrowdSale'
import $Input from 'lib/components/Input'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/CrowdSale/CrowdSaleInput'
import RowToken from 'lib/components/CrowdSale/TokenPicker/RowToken'
import { useCustomTokenList, useTokenList } from 'lib/hooks/useTokenList'
import { TokenDataFE } from 'lib/hooks/constants'
import { $Horizontal, $ScrollContainer } from '../../Generics'
import $Button from '../../Button'
import { $CrowdSaleHeader, $CrowdSaleHeaderTitle } from '../CrowdSaleHeader'
import { getUserBalanceOfNativeToken, getUserBalanceOfToken, crowdSaleState } from '../state'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import { useWeb3 } from 'lib/hooks/useWeb3Api'
import useWindowSize from 'lib/hooks/useScreenSize'
import { Address } from '@guildfx/helpers'
import { getERC20Allowance } from 'lib/hooks/useContract'

export interface TokenPickerProps {
  /** If specified, locks the picker to only these addresses */
  specificAddresses?: Address[]
}

const arrayIsEmpty = (arr: any[] | undefined) => {
  return !arr || arr.length === 0
}

const TokenPicker = (props: TokenPickerProps) => {
  const web3 = useWeb3()
  const snap = useSnapshot(crowdSaleState)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const tokenList = useTokenList()
  const customTokenList = useCustomTokenList()

  const [searchString, setSearchString] = useState('')

  const selectToken = async (token: TokenDataFE, isDisabled: boolean) => {
    if (isDisabled) return
    if (snapUserState.currentAccount && snap.targetToken) {
      const promise =
        token.address === '0x0native'
          ? Promise.all([getUserBalanceOfNativeToken(snapUserState.currentAccount), Promise.resolve('0')])
          : Promise.all([
              getUserBalanceOfToken(token.address, snapUserState.currentAccount),
              getERC20Allowance(snap.crowdSaleAddress, token.address),
            ])
      promise.then(async ([tokenBalance, tokenAllowance]) => {
        if (snap.targetToken !== null) {
          const balanceInEther = (await web3).utils.fromWei(tokenBalance.toString(), 'ether')
          crowdSaleState[snap.targetToken].displayedBalance = balanceInEther
          crowdSaleState[snap.targetToken].allowance = tokenAllowance
        }
      })
      if (snap.targetToken !== null) {
        crowdSaleState[snap.targetToken].data = token
      }
      crowdSaleState.route = '/crowdSale'
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

  const currentToken = snap.targetToken !== null ? crowdSaleState[snap.targetToken].data : null
  return (
    <$CrowdSaleContainer>
      <$CrowdSaleHeader>
        <$CrowdSaleHeaderTitle>SELECT TOKEN</$CrowdSaleHeaderTitle>
        <span
          onClick={() => (crowdSaleState.route = '/crowdSale')}
          style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}
        >
          X
        </span>
      </$CrowdSaleHeader>
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
    </$CrowdSaleContainer>
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
