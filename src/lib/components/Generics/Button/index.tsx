import { ScreenSize } from 'lib/hooks/useScreenSize'
import react from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'

export const $Button = styled.button<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
  screen: ScreenSize
  justifyContent?: string
}>`
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  flex: 1;
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  line-height: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  border: 0px solid transparent;
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => props.color && `color: ${props.color}`};
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor}`};
  &:hover {
    ${(props) => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
    ${(props) => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
  }
`
export default $Button
