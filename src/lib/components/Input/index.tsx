import { ScreenSize } from 'lib/hooks/useScreenSize'
import { COLORS } from 'lib/theme'
import React from 'react'
import styled from 'styled-components'

export const $Input = styled.input<{ screen: ScreenSize }>`
  flex: 1;
  height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px 10px')};
  font-size: ${(props) => (props.screen === 'desktop' ? '2rem' : '1.5rem')};
  font-weight: bold;
  border: 0px solid transparent;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
  font-family: sans-serif;
  width: 100%;
`

export default $Input
