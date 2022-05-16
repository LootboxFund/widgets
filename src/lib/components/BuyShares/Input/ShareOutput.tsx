import react, { useState } from 'react'
import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { $Input } from 'lib/components/Generics/Input'
import { buySharesState } from '../state'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $TokenInput, $FineText, $TokenSymbol } from './shared'
import { ILootbox } from 'lib/types'
import { COLORS } from 'lib/theme'

export interface ShareOutputProps {
  lootbox?: ILootbox
}

const ShareOutput = (props: ShareOutputProps) => {
  const snap = useSnapshot(buySharesState)
  const { screen } = useWindowSize()

  const shareDecimals = snap.lootbox.data?.shareDecimals
  const quantity: string = snap.lootbox.quantity || '0'
  const sharesSoldMax = snap.lootbox?.data?.sharesSoldMax
  const quantityBN = quantity && shareDecimals && new BN(quantity).multipliedBy(new BN(10).pow(shareDecimals))

  const percentageShares =
    quantityBN && shareDecimals && sharesSoldMax
      ? quantityBN.dividedBy(sharesSoldMax).multipliedBy(100).toFixed(2)
      : new BN(0).toString()

  // const sharePerUSD =
  //   snap?.lootbox?.data?.sharePriceWei && snap?.inputToken?.data?.usdPrice
  //     ? new BN(snap.lootbox.data.sharePriceWei)
  //         .multipliedBy(new BN(10).pow(USD_DECIMALS))
  //         .div(new BN(snap.inputToken.data.usdPrice))
  //     : undefined

  return (
    <$TokenInput screen={screen}>
      <$Horizontal flex={1}>
        <$Vertical flex={screen === 'desktop' ? 3 : 2}>
          <$Input readOnly value={quantity} type="number" placeholder="0.00" screen={screen} min={0}></$Input>
          <$FineText screen={screen}>{`Receive Shares (${percentageShares}%* of Earnings)`}</$FineText>
        </$Vertical>
        <$Vertical flex={1}>
          <$Button
            backgroundColor={`${COLORS.white}10`}
            backgroundColorHover={`${COLORS.surpressedBackground}50`}
            color={props.lootbox?.name ? COLORS.black : COLORS.surpressedFontColor}
            disabled={true}
            screen={screen}
            justifyContent="center"
          >
            <$TokenSymbol screen={screen} padding={'10px'}>
              {props.lootbox?.name ? props.lootbox.name : <$FineText screen={screen}>loading...</$FineText>}
            </$TokenSymbol>
          </$Button>

          {/* {sharePerUSD ? (
            <$FineText screen={screen} style={{ marginTop: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
              {`${sharePerUSD?.toExponential(1)?.toString()}`} Shares/USD
            </$FineText>
          ) : (
            ''
          )} */}
        </$Vertical>
      </$Horizontal>
    </$TokenInput>
  )
}

export default ShareOutput
