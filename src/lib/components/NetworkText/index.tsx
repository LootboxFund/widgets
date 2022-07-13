import { Address } from '@wormgraph/helpers'
import { truncateAddress } from 'lib/api/helpers'
import { getWords } from 'lib/api/words'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import react from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'

export interface NetworkTextProps {}
const NetworkText = (props: NetworkTextProps) => {
  const intl = useIntl()
  const words = getWords(intl)
  const snapUserState = useSnapshot(userState)
  const renderTinyAccount = () => {
    if (snapUserState.currentAccount) {
      const accountTruncated = truncateAddress(snapUserState.currentAccount as Address)
      return `(${accountTruncated})`
    }
    return
  }
  return (
    <$NetworkText style={{ flex: 2 }}>
      <b>
        {words.network}
        {':'}
      </b>{' '}
      {snapUserState.network.currentNetworkDisplayName}{' '}
      <span
        onClick={() => navigator.clipboard.writeText((snapUserState.currentAccount as Address) || '')}
        style={{ cursor: 'pointer' }}
      >
        {renderTinyAccount()}
      </span>
    </$NetworkText>
  )
}

export const $NetworkText = styled.span`
  font-size: 0.8rem;
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export default NetworkText
