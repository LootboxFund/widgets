import react, { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { $Input } from 'lib/components/Generics/Input'
import { BuySharesState, buySharesState, fillLootboxEstimate } from '../state'
import useWindowSize from 'lib/hooks/useScreenSize'
import { $TokenInput, $FineText, $TokenSymbol } from './shared'
import { ILootbox } from 'lib/types'
import { COLORS, TYPOGRAPHY } from 'lib/theme'

export interface ShareOutputProps {
  lootbox?: ILootbox
}

const ShareOutput = (props: ShareOutputProps) => {
  const snap = useSnapshot(buySharesState) as BuySharesState
  const { screen } = useWindowSize()
  // const [isSoldOut, setIsSoldOut] = useState(false)

  // useEffect(() => {
  //   const nativeEstimate = fillLootboxEstimate()
  //   if (nativeEstimate.eq(new BN('0'))) {
  //     console.log('is sold out', nativeEstimate.toString())
  //     setIsSoldOut(true)
  //   }
  // }, [snap?.lootbox?.data?.sharesSoldCount])

  const shareDecimals = snap.lootbox.data?.shareDecimals
  const quantity: string = snap.lootbox.quantity || '0'
  const sharesSoldTarget = snap.lootbox?.data?.sharesSoldTarget
  const quantityBN = quantity && shareDecimals && new BN(quantity).multipliedBy(new BN(10).pow(shareDecimals))

  const percentageShares =
    quantityBN && shareDecimals && sharesSoldTarget
      ? quantityBN.dividedBy(sharesSoldTarget).multipliedBy(100).toFixed(2)
      : new BN(0).toString()

  // const sharePerUSD =
  //   snap?.lootbox?.data?.sharePriceWei && snap?.inputToken?.data?.usdPrice
  //     ? new BN(snap.lootbox.data.sharePriceWei)
  //         .multipliedBy(new BN(10).pow(USD_DECIMALS))
  //         .div(new BN(snap.inputToken.data.usdPrice))
  //     : undefined

  const fillUpLootbox = () => {
    const nativeEstimate = fillLootboxEstimate()
    console.log('native estimate', nativeEstimate.toString())
    const nativeFmt = new BN(nativeEstimate).dividedBy(new BN(10).pow(new BN(shareDecimals || 18))).toString()
    buySharesState.inputToken.quantity = nativeFmt
    // FE set input value
    const el = document.getElementById("buy-share-input") as HTMLInputElement | undefined
    if (el) {
      setTimeout(() => {
        // weird hack, don't know why, but need to wait a sec be rendered...
        el.value = nativeFmt
      }, 1)
    }
  }

  return (
    <$TokenInput screen={screen}>
      <$Horizontal flex={1}>
        <$Vertical flex={screen === 'desktop' ? 3 : 2}>
          <$Input readOnly value={quantity} type="number" placeholder="0.00" screen={screen} min={0}></$Input>
          <$FineText screen={screen}>{`Receive Shares (${percentageShares}%* of Earnings)`}</$FineText>
        </$Vertical>
        <$Vertical flex={1} spacing={2}>
          <$Button
            backgroundColor={`${COLORS.white}10`}
            backgroundColorHover={`${COLORS.surpressedBackground}50`}
            color={props.lootbox?.name ? COLORS.black : COLORS.surpressedFontColor}
            disabled={true}
            screen={screen}
            justifyContent="center"
          >
            <$TokenSymbol screen={screen} padding={'10px'}>
              {props.lootbox?.name ? props.lootbox.name : <$FineText screen={screen} style={{color: `${COLORS.surpressedFontColor}aa`}}>loading...</$FineText>}
            </$TokenSymbol>
          </$Button>
          <$TokenSymbol screen={screen} padding={'10px'} onClick={fillUpLootbox} style={{cursor: 'pointer', color: `${COLORS.trustBackground}ee`, textAlign: 'right', fontWeight: TYPOGRAPHY.fontWeight.regular}}>
              Max
          </$TokenSymbol>
        
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
