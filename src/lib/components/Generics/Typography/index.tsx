import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'

const DARK_FONT_COLOR = '#1a1a1a'

export const $ErrorMessage = styled.span`
  color: ${COLORS.dangerFontColor}ae;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $Header = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor};
`

export const $h0 = styled.h1<{ textAlign?: 'center' | 'start'; color?: string }>`
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: ${(props) => props.textAlign || 'start'};
  color: ${(props) => props.color || DARK_FONT_COLOR};
`

export const $h1 = styled.h1<{ textAlign?: 'center' | 'start'; color?: string }>`
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: ${(props) => props.textAlign || 'start'};
  color: ${(props) => props.color || DARK_FONT_COLOR};
`

export const $h2 = styled.h2`
  font-size: ${TYPOGRAPHY.fontSize.xlarge};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${DARK_FONT_COLOR};
`

export const $h3 = styled.h2<{ textAlign?: string; color?: string }>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor};
  ${(props) => props.textAlign && `text-align: ${props.textAlign};`}
  ${(props) => props.color && `color: ${props.color};`}
`

export const $p = styled.p<{ textAlign?: 'center' | 'start'; color?: string; whitespace?: 'pre' | 'pre-line' }>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: ${(props) => props.textAlign || 'start'};
  color: ${(props) => props.color || `${COLORS.surpressedFontColor}`};
  ${(props) => props.whitespace && `white-space: ${props.whitespace};`}
`

export const $span = styled.span<{
  lineHeight?: string
  width?: string
  textAlign?: 'center' | 'start' | 'end'
  color?: string
  bold?: boolean
}>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${(props) => props.lineHeight || TYPOGRAPHY.fontSize.large};
  font-weight: ${(props) => (props.bold ? TYPOGRAPHY.fontWeight.bold : TYPOGRAPHY.fontWeight.regular)};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${(props) => props.color || COLORS.surpressedFontColor};
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.textAlign && `text-align: ${props.textAlign};`}
`
