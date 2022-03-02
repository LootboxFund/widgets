import react from 'react'
import styled from 'styled-components'
import { $BuySharesContainer } from 'lib/components/BuyShares/BuyShares'
import { COLORS } from 'lib/theme'
import $Button from '../Generics/Button'
import { $Vertical } from '../Generics'
import { $BuySharesHeader, $BuySharesHeaderTitle } from './Header'
import { buySharesState, addTicketToWallet } from './state'
import { userState } from 'lib/state/userState'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS, chainIdHexToSlug } from '@lootboxfund/helpers'

export interface PurchaseCompleteProps {}
const PurchaseComplete = (props: PurchaseCompleteProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(buySharesState)
  const snapUserState = useSnapshot(userState)
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
  const bscScanUrl = getBscScanUrl()

  const ErrorSection = () => (
    <$Vertical>
      <$Sadge>🤕</$Sadge>
      <$ErrorText>An Error Occured!</$ErrorText>
      {snap.lastTransaction.failureMessage && <$ErrorText>{snap.lastTransaction.failureMessage}</$ErrorText>}
    </$Vertical>
  )

  const addToWallet = async () => {
    // try {
    //   await addTicketToWallet(snap.)
    // } catch (err) {
    //   console.error(err)
    // }
  }
  return (
    <$BuySharesContainer>
      <$BuySharesHeader>
        {snap.lastTransaction.success ? (
          <$BuySharesHeaderTitle>Success!</$BuySharesHeaderTitle>
        ) : (
          <$BuySharesHeaderTitle>❌ Transaction Failed!</$BuySharesHeaderTitle>
        )}

        <span onClick={goToBuySharesComponent} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$BuySharesHeader>
      <$TokenPreviewCard>
        {!snap.lastTransaction.success && <ErrorSection />}

        {bscScanUrl && (
          <$BlueLinkLink href={bscScanUrl} target="_blank">
            View on BscScan
          </$BlueLinkLink>
        )}

        {snap.lastTransaction.success && (
          <$Button
            screen={screen}
            onClick={addToWallet}
            backgroundColor={`${COLORS.surpressedBackground}`}
            backgroundColorHover={`${COLORS.surpressedBackground}ae`}
            color={`${COLORS.white}`}
            colorHover={COLORS.white}
          >
            Add to Wallet
          </$Button>
        )}
      </$TokenPreviewCard>

      <$Button
        screen={screen}
        onClick={goToBuySharesComponent}
        backgroundColor={`${COLORS.warningBackground}`}
        backgroundColorHover={`${COLORS.warningBackground}ae`}
        color={`${COLORS.warningFontColor}`}
        colorHover={COLORS.white}
        style={{ height: '100px', minHeight: '60px' }}
      >
        Back
      </$Button>
    </$BuySharesContainer>
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
  font-family: sans-serif;
  margin: 10px 0px;
  color: #073effc0;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const $ErrorText = styled.span<{}>`
  font-family: sans-serif;
  margin: 10px 0px;
  color: ${COLORS.dangerFontColor};
  text-align: center;
`

export const $Sadge = styled.span<{}>`
  font-family: sans-serif;
  margin: 10px 0px;
  color: ${COLORS.dangerFontColor};
  text-align: center;
  font-size: 3rem;
`

export const $SecondaryLinkText = styled.span<{}>`
  font-family: sans-serif;
  margin-top: 10px;
  color: ${COLORS.surpressedFontColor};
  text-align: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export default PurchaseComplete
