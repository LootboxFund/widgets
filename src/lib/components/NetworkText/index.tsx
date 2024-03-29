import { Address } from '@wormgraph/helpers'
import { truncateAddress } from 'lib/api/helpers'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import react from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import useWords from 'lib/hooks/useWords'

export interface NetworkTextProps {}
const NetworkText = (props: NetworkTextProps) => {
  const words = useWords()
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
        onClick={() => {
          try {
            navigator.clipboard.writeText((snapUserState.currentAccount as Address) || '')
          } catch (e) {
            console.error(e)
          }
        }}
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
