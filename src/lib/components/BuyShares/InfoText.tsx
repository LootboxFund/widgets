import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import styled from 'styled-components'
import { buySharesState } from './state'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { useState } from 'react'
import { $Button } from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { parseEth } from './helpers'
import { useIntl } from 'react-intl'
import { getWords } from 'lib/api/words'

const InfoText = () => {
  const intl = useIntl()
  const snap = useSnapshot(buySharesState)
  const { screen } = useWindowSize()
  const [isHidden, setIsHidden] = useState(true)

  const words = getWords(intl)
  const shareDecimals = snap.lootbox.data?.shareDecimals
  const quantity: string = snap.lootbox.quantity || '0'
  const quantityFMT = new BN(quantity).toFixed(2)
  const sharesSoldMax = snap.lootbox?.data?.sharesSoldMax
  const quantityBN = quantity && shareDecimals && new BN(quantity).multipliedBy(new BN(10).pow(shareDecimals))
  const quantityWithFee = snap.inputToken?.quantityWithLootboxFee
  const quantityWithFeeFmt = quantityWithFee ? parseEth(quantityWithFee) : '0'
  const symbol = snap.inputToken?.data?.symbol
  const percentageShares =
    quantityBN && shareDecimals && sharesSoldMax ? quantityBN.dividedBy(sharesSoldMax).multipliedBy(100) : new BN(0)

  const maxShares = snap.lootbox.data?.sharesSoldMax
    ? new BN(snap.lootbox.data?.sharesSoldMax).div(new BN(10).pow(snap.lootbox.data.shareDecimals || 18))
    : new BN(0)

  const feeText = intl.formatMessage({
    id: 'buyShares.feeText',
    defaultMessage: 'fee',
    description: 'Lootbox takes a fee from investments into a Lootbox. This is the fee.',
  })

  const percentage = percentageShares.decimalPlaces(2).toString()

  const lootboxPercentageText = intl.formatMessage(
    {
      id: 'buyShares.lootboxPercentageText',
      defaultMessage: '{percentage}% of all Lootbox dividends',
      description: "The percentage of the Lootbox's earnings that can be redeemed from an NFT.",
    },
    {
      percentage,
    }
  )

  const maxSharesText = intl.formatMessage(
    {
      id: 'buyShares.maxSharesText',
      defaultMessage: '{maxShares} Maximum Shares',
      description: 'The maximum number of shares that can be sold in a Lootbox.',
    },
    {
      maxShares: maxShares.toFixed(0),
    }
  )

  const disclaimerText = intl.formatMessage(
    {
      id: 'buyShares.disclaimer',
      defaultMessage: `* Lootbox takes a {feeText} of investments into a Lootbox. You are spending {tokenQuantityText} for {sharesText} of this Lootbox. You will also be charged a native gas fee for this transaction which Lootbox does not control or receive. The holder of this NFT is entitled to {lootboxPercentageText} deposited by the issuer. This is calculated as {sharesText} out of {maxSharesText} available. This {lootboxPercentageValue}% may be different, depending on the final amount of shares sold at the end of the Fundraising period. There is no guarantee of a return, consult your financial advisor before investing.`,
      description: '',
    },
    {
      feeText: <$Bold>3.2% {feeText}</$Bold>,
      tokenQuantityText: (
        <$Bold>
          {quantityWithFeeFmt} {symbol || 'tokens'}
        </$Bold>
      ),
      sharesText: (
        <$Bold>
          {quantityFMT} {words.shares}
        </$Bold>
      ),
      lootboxPercentageText: <$Bold>{lootboxPercentageText}</$Bold>,
      maxSharesText: <$Bold>{maxSharesText}</$Bold>,
      lootboxPercentageValue: percentage,
    }
  )

  return (
    <$InfoTextContainer>
      <$HideTings isHidden={isHidden}>
        {isHidden ? (
          <$Button
            onClick={() => setIsHidden(!isHidden)}
            screen={screen}
            backgroundColor={COLORS.white}
            color={`${COLORS.surpressedFontColor}80`}
            style={{
              position: 'absolute',
              bottom: '0px',
              border: 'none',
              boxShadow: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              fontSize: TYPOGRAPHY.fontSize.medium,
              textDecoration: 'underline',
              fontStyle: 'italic',
              width: '100%',
              background: 'transparent',
              textTransform: 'capitalize',
            }}
          >
            {words.readMore}
          </$Button>
        ) : undefined}
      </$HideTings>
      <$Text>
        {disclaimerText}

        {/* * Lootbox takes a <$Bold>3.2% fee</$Bold> of investments into a Lootbox. You are spending{' '}
        <$Bold>
          {quantityWithFeeFmt} {symbol || 'tokens'}
        </$Bold>{' '}
        for <$Bold>{quantityFMT} Shares</$Bold> of this Lootbox. You will also be charged a native gas fee for this
        transaction which Lootbox does not control or receive. The holder of this NFT is entitled to{' '}
        <$Bold>{percentageShares.decimalPlaces(2).toString()}% of all Lootbox dividends</$Bold> deposited by the issuer.
        This is calculated as <$Bold>{quantityFMT} Shares</$Bold> out of{' '}
        <$Bold>{maxShares.toFixed(0)} Maximum Shares</$Bold> available. This{' '}
        {percentageShares.decimalPlaces(2).toString()}% may be different, depending on the final amount of shares sold
        at the end of the Fundraising period. There is no guarantee of a return, consult your financial advisor before
        investing. */}

        {!isHidden ? (
          <span
            onClick={() => setIsHidden(!isHidden)}
            style={{
              position: 'relative',
              border: 'none',
              boxShadow: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              fontSize: TYPOGRAPHY.fontSize.small,
              lineHeight: TYPOGRAPHY.fontSize.medium,
              textDecoration: 'underline',
              fontStyle: 'italic',
              paddingLeft: '30px',
              cursor: 'pointer',
            }}
          >
            {words.hide}
          </span>
        ) : undefined}
      </$Text>
    </$InfoTextContainer>
  )
}

const BASE_STYLE = `
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.small};
  line-height: ${TYPOGRAPHY.fontSize.medium};
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
  display: ${(props) => (props.isHidden ? 'auto' : 'none')};
  };
`

const $InfoTextContainer = styled.div`
  position: relative;
  height: 100%;
  padding-top: 10px;
`

export default InfoText
