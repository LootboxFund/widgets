import { COLORS } from '@wormgraph/helpers'
import { ScreenSize } from 'lib/hooks/useScreenSize'
import styled from 'styled-components'

const $SmallerButton = styled.button<{ screen?: ScreenSize; themeColor?: string }>`
  width: 100%;
  max-width: 300px;
  padding: 8px 10px;
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 0.5px solid #cdcdcd;
  cursor: pointer;
  background-color: ${(props) => props.themeColor || '#ffffff'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 10px;
  text-align: center;
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) => (props.themeColor ? COLORS.white : COLORS.surpressedFontColor)};
`

export default $SmallerButton
