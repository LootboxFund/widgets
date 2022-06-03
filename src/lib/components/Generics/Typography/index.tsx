import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'

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

export const $h1 = styled.h1<{ textAlign?: 'center' | 'start' }>`
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: ${(props) => props.textAlign || 'start'};
  color: ${COLORS.surpressedFontColor};
`

export const $p = styled.p`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor}ce;
`

export const $span = styled.span<{
  lineHeight?: string
  width?: string
  textAlign?: 'center' | 'start'
  color?: string
}>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${(props) => props.lineHeight || TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${(props) => props.color || COLORS.surpressedFontColor}ce;
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.textAlign && `text-align: ${props.textAlign};`}
`
