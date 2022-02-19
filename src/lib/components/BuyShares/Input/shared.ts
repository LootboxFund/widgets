import styled, { css } from 'styled-components'
import { COLORS } from 'lib/theme'
import { ScreenSize } from 'lib/hooks/useScreenSize/index'

export const $TokenInput = styled.div<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.3rem')};
  padding: 10px 10px 15px 10px;
  background-color: ${`${COLORS.surpressedBackground}20`};
  border: 0px solid transparent;
  border-radius: 10px;
  display: flex;
  max-height: 150px;
`

export const $FineText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '0.9rem' : '0.8rem')};
  padding: 0px 0px 0px 10px;
  font-weight: lighter;
  font-family: sans-serif;
  word-break: break-word;
`

export const $CoinIcon = styled.img<{ screen: ScreenSize }>`
  width: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  height: ${(props) => (props.screen === 'desktop' ? '1.5rem' : '1.2rem')};
  margin-right: ${(props) => (props.screen === 'desktop' ? '10px' : '5px')};
`

export const $BalanceText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '0.8rem' : '0.7rem')};
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 5px;
  margin-top: 10px;
  font-weight: lighter;
  font-family: sans-serif;
`

export const $TokenSymbol = styled.span<{ screen: ScreenSize; padding?: string }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '1rem' : '0.9rem')};
  font-weight: bold;
  display: block;
  font-family: sans-serif;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto 0px;
`
