import react, { useState } from 'react'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Input } from 'lib/components/Input'
import { buySharesState } from '../state'
import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $TokenInput, $FineText, $BalanceText, $TokenSymbol } from './shared'
import { ILootbox } from 'lib/types'
import { USD_DECIMALS } from 'lib/hooks/constants'

export interface ShareOutputProps {
  lootbox?: ILootbox
}

const ShareOutput = (props: ShareOutputProps) => {
  const snap = useSnapshot(buySharesState)
  const { screen } = useWindowSize()

  const shareDecimals = snap.lootbox.data?.shareDecimals
  const quantity: string = snap.lootbox.quantity || '0'
  const sharesSoldCount = snap.lootbox?.data?.sharesSoldCount
  const quantityBN = quantity && shareDecimals && new BN(quantity).multipliedBy(new BN(10).pow(shareDecimals))
  const totalShares = sharesSoldCount && quantityBN && new BN(sharesSoldCount).plus(quantityBN)
  const percentageShares =
    quantityBN && sharesSoldCount && shareDecimals && totalShares && totalShares.gt(0)
      ? quantityBN.dividedBy(totalShares).multipliedBy(100).toFixed(2)
      : new BN(0)

  const price = snap.lootbox.data?.sharePriceUSD
    ? new BN(snap.lootbox.data?.sharePriceUSD).div(new BN(10).pow(USD_DECIMALS))
    : undefined

  return (
    <$TokenInput screen={screen}>
      <$Horizontal flex={1}>
        <$Vertical flex={screen === 'desktop' ? 3 : 2}>
          <$Input readOnly value={quantity} type="number" placeholder="0.00" screen={screen} min={0}></$Input>
          <$FineText screen={screen}>{`Receive Shares (${percentageShares}%* of Earnings)`}</$FineText>
        </$Vertical>
        <$Vertical flex={1}>
          {props.lootbox ? (
            <$TokenSymbol screen={screen}>{props.lootbox.name}</$TokenSymbol>
          ) : (
            <$TokenSymbol screen={screen}>loading...</$TokenSymbol>
          )}
          <$BalanceText screen={screen} style={{ flex: 1 }}>
            {price ? <$FineText screen={screen}>{`$${price.decimalPlaces(2).toString()}`} USD</$FineText> : ''}
          </$BalanceText>
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default ShareOutput
