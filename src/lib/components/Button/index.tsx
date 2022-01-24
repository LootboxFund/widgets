import { ScreenSize } from 'lib/hooks/useScreenSize'
import react from 'react'
import styled from 'styled-components'

export const $Button = styled.button<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
  screen: ScreenSize
}>`
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  flex: 1;
  min-height: ${(props) => (props.screen === 'desktop' ? '40px' : '40px')};
  max-height: ${(props) => (props.screen === 'desktop' ? '50px' : '0.35px')};
  height: ${(props) => (props.screen === 'desktop' ? '40px' : '30px')};
  font-size: ${(props) => (props.screen === 'desktop' ? '1rem' : '0.9rem')};
  font-weight: 700;
  font-family: sans-serif;
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
