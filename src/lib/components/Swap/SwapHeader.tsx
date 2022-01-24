import { addCustomEVMChain, useUserInfo, useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { $Horizontal } from '../Generics'
import { BLOCKCHAINS, DEFAULT_CHAIN_ID_HEX } from '../../hooks/constants'
import $Button from 'lib/components/Button'

export interface SwapHeaderProps {}
const SwapHeader = (props: SwapHeaderProps) => {
  console.log(props)
  const snapUserState = useSnapshot(userState)

  const isWalletConnected = snapUserState.accounts.length > 0

  const validChain =
    snapUserState.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.currentNetworkIdHex)

  const switchChain = async () => {
    await addCustomEVMChain(DEFAULT_CHAIN_ID_HEX)
  }

  const renderSwitchNetworkButton = () => {
    if (isWalletConnected) {
      return (
        <$Button
          onClick={switchChain}
          backgroundColor={`${COLORS.dangerFontColor}80`}
          backgroundColorHover={`${COLORS.dangerFontColor}`}
          color={COLORS.white}
          style={{ marginRight: '10px', height: '20px', fontSize: '1rem', fontWeight: 'lighter' }}
        >
          Switch Network
        </$Button>
      )
    }
    return
  }

  return (
    <$SwapHeader>
      <$SwapHeaderTitle>BUY GUILDFX</$SwapHeaderTitle>
      {validChain ? (
        <>
          <$NetworkText style={{ flex: 2 }}>
            <b>Network:</b> {snapUserState.currentNetworkDisplayName}
          </$NetworkText>
          <span style={{ padding: '0px 5px 0px 0px' }}>⚙️</span>
        </>
      ) : (
        renderSwitchNetworkButton()
      )}
    </$SwapHeader>
  )
}

export const $SwapHeaderTitle = styled.span<{}>`
  flex: 3;
  font-size: 1rem;
  font-weight: bold;
  padding: 0px 0px 0px 10px;
`

export const $SwapHeader = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: sans-serif;
`

export const $NetworkText = styled.span`
  font-size: 1rem;
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 10px;
  font-weight: lighter;
  font-family: sans-serif;
  text-decoration: underline;
  cursor: pointer;
`

export default SwapHeader
