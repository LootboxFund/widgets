import react from 'react'
import { addCustomEVMChain } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import { truncateAddress } from 'lib/api/helpers'
import { Address, BLOCKCHAINS } from '@wormgraph/helpers'
import { $Vertical, $Horizontal } from '../Generics'
import { buySharesState } from './state'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'

export interface BuySharesHeaderProps {}
const BuySharesHeader = (props: BuySharesHeaderProps) => {
  const snapUserState = useSnapshot(userState)
  const snapBuySharesState = useSnapshot(buySharesState)
  const words = useWords()

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
          <$BuySharesHeaderTitle>
            <FormattedMessage
              id="buyShares.header.title"
              defaultMessage="Mint your Profit Sharing NFT"
              description="Title of the Buy Shares component. Minting is the act of creating a Lootbox NFT on the blockchain."
            />
          </$BuySharesHeaderTitle>
          {subHeader ? <$BuySharesHeaderSubTitle>{subHeader}</$BuySharesHeaderSubTitle> : undefined}
        </$Vertical>
      </$Horizontal>

      <>
        <$NetworkText style={{ flex: 2 }}>
          <b>{words.network}:</b> {snapUserState.network.currentNetworkDisplayName}{' '}
          <span
            onClick={() => navigator.clipboard.writeText((snapUserState.currentAccount as Address) || '')}
            style={{ cursor: 'pointer' }}
          >
            {renderTinyAccount()}
          </span>
        </$NetworkText>
      </>
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
