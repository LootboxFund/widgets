import styled, { css } from 'styled-components'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { ScreenSize } from 'lib/hooks/useScreenSize/index'

export const $TokenInput = styled.div<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  padding: 10px 20px 15px 10px;
  background-color: ${`${COLORS.surpressedBackground}20`};
  border: 0px solid transparent;
  border-radius: 10px;
  display: flex;
  max-height: 150px;
`

export const $FineText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.medium : TYPOGRAPHY.fontSize.small)};
  // font-size: ${TYPOGRAPHY.fontSize.medium};
  padding: 0px 0px 0px 10px;
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  word-break: break-word;
  color: ${COLORS.surpressedFontColor};
`

export const $CoinIcon = styled.img<{ screen: ScreenSize }>`
  width: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  height: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  margin: ${(props) => (props.screen === 'desktop' ? 'auto 10px auto 0' : 'auto 5px auto 0')};
`

export const $BalanceText = styled.span<{ screen: ScreenSize }>`
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.medium : TYPOGRAPHY.fontSize.small)};
  color: ${`${COLORS.surpressedFontColor}`};
  text-align: right;
  margin-right: 5px;
  margin-top: 10px;
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $TokenSymbol = styled.span<{ screen: ScreenSize; padding?: string }>`
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.medium : TYPOGRAPHY.fontSize.small)};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  display: block;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: auto 0px;
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${COLORS.black};
`
