import react from 'react'
import { addCustomEVMChain } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { DEFAULT_CHAIN_ID_HEX } from '../../hooks/constants'
import $Button from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { truncateAddress } from 'lib/api/helpers'
import { Address, BLOCKCHAINS } from '@wormgraph/helpers'

export interface BuySharesHeaderProps {}
const BuySharesHeader = (props: BuySharesHeaderProps) => {
  const { screen } = useWindowSize()
  const snapUserState = useSnapshot(userState)

  const isWalletConnected = snapUserState.accounts.length > 0

  const validChain =
    snapUserState.network.currentNetworkIdHex &&
    Object.values(BLOCKCHAINS)
      .map((b) => b.chainIdHex)
      .includes(snapUserState.network.currentNetworkIdHex)

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
      const accountTruncated = truncateAddress(snapUserState.currentAccount as Address)
      return `(${accountTruncated})`
    }
    return
  }

  return (
    <$BuySharesHeader>
      <$BuySharesHeaderTitle>🎁 BUY LOOTBOX SHARES</$BuySharesHeaderTitle>
      {validChain ? (
        <>
          <$NetworkText style={{ flex: 2 }}>
            <b>Network:</b> {snapUserState.network.currentNetworkDisplayName}{' '}
            <span
              onClick={() => navigator.clipboard.writeText((snapUserState.currentAccount as Address) || '')}
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
    </$BuySharesHeader>
  )
}

export const $BuySharesHeaderTitle = styled.span<{}>`
  flex: 3;
  font-size: 1rem;
  font-weight: bold;
  padding: 0px 0px 0px 10px;
`

export const $BuySharesHeader = styled.div<{}>`
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

export default BuySharesHeader
