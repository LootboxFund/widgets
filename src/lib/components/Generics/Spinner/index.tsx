import { ScreenSize } from 'lib/hooks/useScreenSize'
import react from 'react'
import styled from 'styled-components'
import { $Horizontal } from '..'

export const $Spinner = styled.div<{
  color?: string
  size?: string
  margin?: string
}>`
  width: ${(props) => props.size || '16px'};
  height: ${(props) => props.size || '16px'};
  margin-right: 12px;
  border: 4px solid transparent;
  border-top-color: ${(props) => props.color || '#ffffff'};
  border-radius: 50%;
  ${(props) => props.margin && `margin: ${props.margin};`}

  animation: button-loading-spinner 1s ease infinite;

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }
`

export const LoadingText = ({ loading, text, color }: { loading: boolean; text: string; color: string }) => {
  return (
    <$Horizontal justifyContent="center">
      {loading ? <$Spinner color={color} margin="auto 12px auto 0px"></$Spinner> : null}
      {text}
    </$Horizontal>
  )
}

export default $Spinner
