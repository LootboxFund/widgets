import { useSnapshot } from 'valtio'
import BN from 'bignumber.js'
import styled from 'styled-components'
import { buySharesState } from './state'

const InfoText = () => {
  const snap = useSnapshot(buySharesState)

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

  if (quantityBN && sharesSoldMax && quantityBN?.gt(sharesSoldMax)) return <></>
  return (
    <$Text>
      * {percentageShares.decimalPlaces(2).toString()}% of Earnings is calculated as <$Bold>{quantityFMT} Shares</$Bold>{' '}
      out of <$Bold>{maxShares.toFixed(0)} Shares Total</$Bold>. This entitles the holder of this NFT to{' '}
      <$Bold>{percentageShares.decimalPlaces(2).toString()}% of all Lootbox dividends</$Bold> deposited by the issuer.{' '}
      There is no guarantee of a return, consult your financial advisor before investing.
    </$Text>
  )
}

const BASE_STYLE = `
  font-family: sans-serif;
  font-size: 16px;
  font-style: normal;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  
  display: inline;
`

const $Bold = styled.p`
  font-weight: 700;
  color: #575757;
  ${BASE_STYLE}
`

const $Text = styled.p`
  font-family: sans-serif;
  font-weight: 400;
  color: #575757da;
  ${BASE_STYLE}
`

const $BoldText = styled.p``

export default InfoText
