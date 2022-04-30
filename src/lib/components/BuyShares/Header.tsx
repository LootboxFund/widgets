import react from 'react'
import { addCustomEVMChain } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { DEFAULT_CHAIN_ID_HEX } from '../../hooks/constants'
import $Button from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { truncateAddress } from 'lib/api/helpers'
import { Address, BLOCKCHAINS } from '@wormgraph/helpers'
import { $Vertical, $Horizontal } from '../Generics'
import { buySharesState } from './state'

export interface BuySharesHeaderProps {}
const BuySharesHeader = (props: BuySharesHeaderProps) => {
  const { screen } = useWindowSize()
  const snapUserState = useSnapshot(userState)
  const snapBuySharesState = useSnapshot(buySharesState)

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
        <$ButtonWrapper>
          <$Button
            screen={screen}
            onClick={switchChain}
            backgroundColor={`${COLORS.dangerFontColor}80`}
            backgroundColorHover={`${COLORS.dangerFontColor}`}
            color={COLORS.white}
            style={{
              marginRight: '10px',
              height: '20px',
              fontSize: TYPOGRAPHY.fontSize.medium,
              fontWeight: TYPOGRAPHY.fontWeight.light,
            }}
          >
            Switch Network
          </$Button>
        </$ButtonWrapper>
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

  const variant = snapBuySharesState.lootbox?.data?.variant
  const name = snapBuySharesState.lootbox?.data?.name

  let subHeader: string

  if (variant && name) {
    subHeader = `${variant} Lootbox - ${name}`
  } else {
    subHeader = (variant ? `${variant} Lootbox` : undefined) || name || 'Buy Shares'
  }
  return (
    <$BuySharesHeader>
      <$Horizontal>
        <$Icon>🎁</$Icon>
        <$Vertical>
          <$BuySharesHeaderTitle>Mint your Profit Sharing NFT</$BuySharesHeaderTitle>
          {subHeader ? <$BuySharesHeaderSubTitle>{subHeader}</$BuySharesHeaderSubTitle> : undefined}
        </$Vertical>
      </$Horizontal>

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
        </>
      ) : (
        renderSwitchNetworkButton()
      )}
    </$BuySharesHeader>
  )
}

export const $BuySharesHeaderTitle = styled.span<{}>`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
`

export const $BuySharesHeaderSubTitle = styled.span`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.small};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  color: ${COLORS.surpressedFontColor};
`

export const $BuySharesHeader = styled.div<{}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $NetworkText = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.small};
  color: ${COLORS.surpressedFontColor};
  text-align: right;
  margin-right: 10px;
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $Icon = styled.span`
  flex: 1;
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  margin-right: 10px;
`

const $ButtonWrapper = styled.div`
  max-width: 230px;
  margin-left: auto;
`

export default BuySharesHeader
