import { ScreenSize } from 'lib/hooks/useScreenSize'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import React, { useState } from 'react'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'

export const $Input = styled.input<{ screen: ScreenSize; width?: string; fontWeight?: string }>`
  flex: 1;
  height: ${(props) => (props.screen === 'desktop' ? '50px' : '40px')};
  padding: ${(props) => (props.screen === 'desktop' ? '10px' : '5px 10px')};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xxlarge : TYPOGRAPHY.fontSize.xlarge)};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : TYPOGRAPHY.fontWeight.bold)};
  border: 0px solid transparent;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  width: ${(props) => (props.width ? props.width : '100%')};
  min-width: 70px;
  max-width: ${(props) => (props.width ? props.width : '100%')};
  -moz-appearance: textfield;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

interface InputDecimalProps {
  initialValue?: string
  onChange: (value: string | undefined) => void
  [key: string]: any
}

export const InputDecimal = (props: InputDecimalProps) => {
  const { onChange, initialValue, ...rest } = props
  const { screen } = useWindowSize()
  const [value, setValue] = useState<string | undefined>(initialValue || undefined)

  const parseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value || ''

    let _value: string | undefined = undefined

    if (inputValue?.length === 0) {
      _value = undefined
    } else if (inputValue.indexOf('-') > -1) {
      // Don't allow negative numbers
      _value = undefined
    } else {
      _value = !isNaN(parseFloat(inputValue)) ? inputValue : '0'
    }

    setValue(_value)
    onChange(_value)
  }

  return (
    <$Input
      value={value || ''}
      onChange={parseInput}
      screen={screen}
      type="number"
      placeholder="0.01"
      min="0"
      onWheel={(e) => e.currentTarget.blur()}
      {...rest}
    />
  )
}

export default $Input
