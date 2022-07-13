import react from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import $Button from '../Generics/Button'
import { $Vertical } from '../Generics'
import { buySharesState } from './state'
import { userState } from 'lib/state/userState'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, chainIdHexToSlug } from '@wormgraph/helpers'
import { FormattedMessage, useIntl } from 'react-intl'
import { getWords } from 'lib/api/words'

export interface PurchaseCompleteProps {}
const PurchaseComplete = (props: PurchaseCompleteProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
  const intl = useIntl()
  const words = getWords(intl)

  const goToBuySharesComponent = () => (buySharesState.route = '/buyShares')
  const getBscScanUrl = (): string | undefined => {
    if (!snap.lastTransaction.hash) {
      return undefined
    } else if (snapUserState.network.currentNetworkIdHex) {
      const chainSlug = chainIdHexToSlug(snapUserState.network.currentNetworkIdHex)
      if (snapUserState.network.currentNetworkIdHex && chainSlug && BLOCKCHAINS[chainSlug]) {
        return `${BLOCKCHAINS[chainSlug].blockExplorerUrls[0]}tx/${snap.lastTransaction.hash}`
      }
      return undefined
    }
    return undefined
  }

  const getBscScanName = () => {
    let name = 'bscscan'
    if (snapUserState.network.currentNetworkIdHex) {
      const chainSlug = chainIdHexToSlug(snapUserState.network.currentNetworkIdHex)
      if (snapUserState.network.currentNetworkIdHex && chainSlug && BLOCKCHAINS[chainSlug]) {
        // return `${BLOCKCHAINS[chainSlug].blockExplorerUrls[0]}tx/${snap.lastTransaction.hash}`
        if (BLOCKCHAINS[chainSlug]?.chainName?.toLowerCase()?.startsWith('p')) {
          name = 'polyscan'
        }
      }
    }
    return name
  }

  const bscScanUrl = getBscScanUrl()

  const ViewOnBSCScan = () => (
    <$BlueLinkLink href={bscScanUrl} target="_blank">
      <FormattedMessage
        id="buyShares.purchaseComplete.viewOnBlockExplorer"
        defaultMessage="View on {blockExplorerName}"
        description="Hyperlink for user to click to view a transaction on a block explorer."
        values={{ blockExplorerName: getBscScanName() }}
      />
    </$BlueLinkLink>
  )

  const ErrorSection = () => (
    <$Vertical style={{ minHeight: '150px', justifyContent: 'center' }}>
      <$Sadge>🤕</$Sadge>
      <$ErrorText style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{words.anErrorOccured}!</$ErrorText>
      {snap.lastTransaction.failureMessage && <$ErrorText>{snap.lastTransaction.failureMessage}</$ErrorText>}
      {bscScanUrl && <ViewOnBSCScan />}
    </$Vertical>
  )

  const SuccessSection = () => (
    <$Vertical style={{ minHeight: '150px', justifyContent: 'center' }}>
      <$Sadge style={{ paddingBottom: '15px' }}>✅</$Sadge>
      {bscScanUrl && <ViewOnBSCScan />}
    </$Vertical>
  )

  return (
    <$Vertical>
      <$TokenPreviewCard>{!snap.lastTransaction.success ? <ErrorSection /> : <SuccessSection />}</$TokenPreviewCard>

      <$Button
        screen={screen}
        onClick={goToBuySharesComponent}
        backgroundColor={`${COLORS.warningBackground}`}
        backgroundColorHover={`${COLORS.warningBackground}ae`}
        color={`${COLORS.warningFontColor}`}
        colorHover={COLORS.white}
        style={{ height: '100px', minHeight: '60px', textTransform: 'capitalize' }}
      >
        {words.back}
      </$Button>
    </$Vertical>
  )
}

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

export const $BlueLinkLink = styled.a<{}>`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  margin: 10px 0px;
  color: #073effc0;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: bold;
`

export const $ErrorText = styled.span<{}>`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  margin: 10px 0px;
  color: ${COLORS.dangerFontColor};
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.large};
`

export const $Sadge = styled.span<{}>`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  margin: 10px 0px;
  color: ${COLORS.dangerFontColor};
  text-align: center;
  font-size: 2.6em;
`

export const $SecondaryLinkText = styled.span<{}>`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  margin-top: 10px;
  color: ${COLORS.surpressedFontColor};
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export default PurchaseComplete
