import react, { useState } from 'react'
import styled from 'styled-components'
import { $CrowdSaleContainer } from 'lib/components/CrowdSale/CrowdSale'
import { COLORS } from 'lib/theme'
import { $CoinIcon } from 'lib/components/CrowdSale/CrowdSaleInput'
import { $BigCoinTicker, $ThinCoinName } from 'lib/components/CrowdSale/TokenPicker/RowToken'
import $Button from '../Button'
import { $CrowdSaleHeader, $CrowdSaleHeaderTitle } from './CrowdSaleHeader'
import { crowdSaleState, addOutputTokenToWallet } from './state'
import { userState } from 'lib/state/userState'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'

export interface PurchaseCompleteProps {}
const PurchaseComplete = (props: PurchaseCompleteProps) => {
  const { screen } = useWindowSize()
  const snap = useSnapshot(crowdSaleState)
  const snapUserState = useSnapshot(userState)
  const goToCrowdSaleComponent = () => (crowdSaleState.route = '/crowdSale')
  const getBscScanUrl = () => {
    if (snapUserState.currentNetworkIdHex && BLOCKCHAINS[snapUserState.currentNetworkIdHex]) {
      return `${BLOCKCHAINS[snapUserState.currentNetworkIdHex].blockExplorerUrls[0]}${
        snap.lastTransaction.hash ? `tx/${snap.lastTransaction.hash}` : ''
      }`
    }
    return undefined
  }
  return (
    <$CrowdSaleContainer>
      <$CrowdSaleHeader>
        {snap.lastTransaction.success ? (
          <$CrowdSaleHeaderTitle>Success!</$CrowdSaleHeaderTitle>
        ) : (
          <$CrowdSaleHeaderTitle>❌ Transaction Failed!</$CrowdSaleHeaderTitle>
        )}

        <span onClick={goToCrowdSaleComponent} style={{ padding: '0px 5px 0px 0px', cursor: 'pointer' }}>
          X
        </span>
      </$CrowdSaleHeader>
      <$TokenPreviewCard>
        <$CoinIcon
          screen={screen}
          // src="https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png"
          src={snap.outputToken.data?.logoURI}
          style={{ width: '50px', height: '50px' }}
        ></$CoinIcon>
        <$BigCoinTicker screen={screen}>{snap.outputToken.data?.symbol}</$BigCoinTicker>
        <$BlueLinkLink href={getBscScanUrl()} target="_blank">
          View on BscScan
        </$BlueLinkLink>
        <$Button
          screen={screen}
          onClick={addOutputTokenToWallet}
          backgroundColor={`${COLORS.surpressedBackground}`}
          backgroundColorHover={`${COLORS.surpressedBackground}ae`}
          color={`${COLORS.white}`}
          colorHover={COLORS.white}
        >
          Add to Wallet
        </$Button>
      </$TokenPreviewCard>

      <$Button
        screen={screen}
        onClick={goToCrowdSaleComponent}
        backgroundColor={`${COLORS.warningBackground}`}
        backgroundColorHover={`${COLORS.warningBackground}ae`}
        color={`${COLORS.warningFontColor}`}
        colorHover={COLORS.white}
        style={{ height: '100px', minHeight: '60px' }}
      >
        Back
      </$Button>
    </$CrowdSaleContainer>
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
