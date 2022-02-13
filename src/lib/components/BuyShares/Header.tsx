import { addCustomEVMChain, useUserInfo, useWeb3 } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, DEFAULT_CHAIN_ID_HEX } from '../../hooks/constants'
import $Button from 'lib/components/Button'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import useWindowSize from 'lib/hooks/useScreenSize'
import { truncateAddress } from 'lib/api/helpers'
import { buySharesState } from './state'

export interface CrowdSaleHeaderProps {}
const CrowdSaleHeader = (props: CrowdSaleHeaderProps) => {
  const { screen } = useWindowSize()
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
          screen={screen}
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

  const renderTinyAccount = () => {
    if (snapUserState.currentAccount) {
      const accountTruncated = truncateAddress(snapUserState.currentAccount)
      return `(${accountTruncated})`
    }
    return
  }

  return (
    <$CrowdSaleHeader>
      <$CrowdSaleHeaderTitle>BUY {buySharesState.outputToken.data?.symbol || ''}</$CrowdSaleHeaderTitle>
      {validChain ? (
        <>
          <$NetworkText style={{ flex: 2 }}>
            <b>Network:</b> {snapUserState.currentNetworkDisplayName}{' '}
            <span
              onClick={() => navigator.clipboard.writeText(snapUserState.currentAccount || '')}
              style={{ cursor: 'pointer' }}
            >
              {renderTinyAccount()}
            </span>
          </$NetworkText>
          {/* <span style={{ padding: '0px 5px 0px 0px' }}>⚙️</span> */}
        </>
      ) : (
        renderSwitchNetworkButton()
      )}
    </$CrowdSaleHeader>
  )
}

export const $CrowdSaleHeaderTitle = styled.span<{}>`
  flex: 3;
  font-size: 1rem;
  font-weight: bold;
  padding: 0px 0px 0px 10px;
`

export const $CrowdSaleHeader = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: sans-serif;
`

export const $NetworkText = styled.span`
  font-size: 0.8rem;
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export default CrowdSaleHeader
