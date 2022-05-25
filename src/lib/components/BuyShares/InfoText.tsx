import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import styled from 'styled-components'
import { buySharesState } from './state'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { useState } from 'react'
import { $Button } from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'

const InfoText = () => {
  const snap = useSnapshot(buySharesState)
  const { screen } = useWindowSize()
  const [isHidden, setIsHidden] = useState(true)

  const shareDecimals = snap.lootbox.data?.shareDecimals
  const quantity: string = snap.lootbox.quantity || '0'
  const quantityFMT = new BN(quantity).toFixed(2)
  const sharesSoldMax = snap.lootbox?.data?.sharesSoldMax
  const quantityBN = quantity && shareDecimals && new BN(quantity).multipliedBy(new BN(10).pow(shareDecimals))
  const percentageShares =
    quantityBN && shareDecimals && sharesSoldMax ? quantityBN.dividedBy(sharesSoldMax).multipliedBy(100) : new BN(0)

  const maxShares = snap.lootbox.data?.sharesSoldMax
    ? new BN(snap.lootbox.data?.sharesSoldMax).div(new BN(10).pow(snap.lootbox.data.shareDecimals || 18))
    : new BN(0)

  return (
    <$InfoTextContainer>
      <$HideTings isHidden={isHidden}>
        <$Button
          onClick={() => setIsHidden(!isHidden)}
          screen={screen}
          backgroundColor={COLORS.white}
          color={`${COLORS.surpressedFontColor}80`}
          style={{
            position: 'absolute',
            bottom: screen === 'desktop'? '0' : '-35px',
            border: 'none',
            boxShadow: 'none',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.medium,
            textDecoration: 'underline',
            fontStyle: 'italic',
            width: '100%',
            background: 'transparent'
          }}
        >
          {isHidden? 'Read More': 'Hide'}
        </$Button>
      </$HideTings>
      <$Text>
        * {percentageShares.decimalPlaces(2).toString()}% of Earnings is calculated as{' '}
        <$Bold>{quantityFMT}</$Bold> out of <$Bold>{maxShares.toFixed(0)} Shares</$Bold>. This entitles the
        holder of this NFT to <$Bold>{percentageShares.decimalPlaces(2).toString()}% of all Lootbox dividends</$Bold>{' '}
        deposited by the issuer. There is no guarantee of a return, consult your financial advisor before investing.
      </$Text>
    </$InfoTextContainer>
  )
}

const BASE_STYLE = `
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  letter-spacing: 0em;
  text-align: left;
  display: inline;
`

const $Bold = styled.p`
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.surpressedFontColor};
  ${BASE_STYLE}
`

const $Text = styled.p`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  color: ${COLORS.surpressedFontColor}da;
  overflow: hidden;
  text-overflow: ellipsis;
  ${BASE_STYLE}
`

const $HideTings = styled.div<{ isHidden: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.isHidden
      ? `linear-gradient(
    180deg,
    rgba(196, 196, 196, 0) 0%,
    rgba(255, 255, 255, 0.47) 17.71%,
    rgba(255, 255, 255, 0.9) 40%,
    #ffffff 77.08%
  );`
      : 'none'};
`

const $InfoTextContainer = styled.div`
  position: relative;
  height: 100%;
`

export default InfoText
