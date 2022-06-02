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
