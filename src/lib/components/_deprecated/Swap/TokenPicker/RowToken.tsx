import react from 'react'
import styled from 'styled-components'
import { $CoinIcon } from 'lib/components/_deprecated/Swap/SwapInput'
import { COLORS } from 'lib/theme'
import { $Horizontal } from '../../../Generics'
import { TokenDataFE } from 'lib/hooks/constants'
import { swapState } from '../state'
import { useSnapshot } from 'valtio'
import { removeCustomToken } from 'lib/hooks/useTokenList'
import useWindowSize from 'lib/hooks/useScreenSize'
import { ScreenSize } from '../../../../hooks/useScreenSize/index'

export interface RowTokenProps {
  token: TokenDataFE
  disabled?: boolean
  copyable?: boolean
  deleteable?: boolean
}
const RowToken = (props: RowTokenProps) => {
  const snap = useSnapshot(swapState)
  const { screen } = useWindowSize()
  const removeToken = () => {
    removeCustomToken(props.token.address, props.token.chainIdHex)
  }
  return (
    <$RowToken screen={screen} disabled={props.disabled}>
      <$Horizontal verticalCenter>
        <$CoinIcon
          screen={screen}
          src={props.token.logoURI}
          style={{ width: screen === 'desktop' ? '30px' : '30px', height: screen === 'desktop' ? '30px' : '30px' }}
        ></$CoinIcon>
        <$BigCoinTicker screen={screen}>{props.token.symbol}</$BigCoinTicker>
      </$Horizontal>
      <$ThinCoinName screen={screen}>{props.token.name}</$ThinCoinName>
      {props.copyable || props.deleteable ? (
        <div>
          {props.copyable && (
            <$CopyButton screen={screen} onClick={() => navigator.clipboard.writeText(props.token.address)}>
              📑
            </$CopyButton>
          )}
          {props.deleteable && (
            <$DeleteButton screen={screen} onClick={removeToken}>
              🗑
            </$DeleteButton>
          )}
        </div>
      ) : null}
    </$RowToken>
  )
}

const $RowToken = styled.div<{ disabled?: boolean; screen: ScreenSize }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  background-color: ${`${COLORS.black}04`};
  padding: ${(props) => (props.screen === 'desktop' ? '20px' : '15px')};
  border-radius: 10px;
  max-height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => (props.disabled ? 'background-color: rgba(0,0,0,0.1);' : 'background-color: rgba(0,0,0,0.03);')};
  &:hover {
    ${(props) =>
      props.disabled ? 'background-color: rgba(0,0,0,0.1);' : `background-color: ${`${COLORS.warningBackground}30`}`};
  }
`

export const $BigCoinTicker = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1rem')};
  font-weight: bold;
  font-family: sans-serif;
`

export const $ThinCoinName = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '1.2rem' : '0.9rem')};
  font-weight: 400;
  font-family: sans-serif;
  color: ${COLORS.surpressedFontColor};
`

export const $CopyButton = styled.span<{ screen: ScreenSize }>`
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: ${`${COLORS.surpressedBackground}30`};
  }
`
export const $DeleteButton = styled.span<{ screen: ScreenSize }>`
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: ${`${COLORS.surpressedBackground}30`};
  }
`

export default RowToken
