import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $p, $Vertical, $h3, $Horizontal, $h1, $h2 } from '../Generics'

export const $SearchInput = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;
`

export const $Link = styled.a<{ fontStyle?: string; color?: string }>`
  color: ${(props) => props.color || '#2cb1ea'};
  font-style: italic;
  cursor: pointer;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  ${(props) => props.fontStyle && `font-style: ${props.fontStyle};`}
`

export const Oopsies = ({
  icon,
  message,
  title,
}: {
  icon: string
  message?: React.ReactElement | string
  title: string
}) => {
  return (
    <$Vertical>
      <$Horizontal>
        <$h1>{icon}</$h1>
        <$h2 style={{ marginLeft: '10px', paddingTop: '3px' }}>{title}</$h2>
      </$Horizontal>
      {message && (
        <$h3
          style={{
            margin: `0px auto auto calc(${TYPOGRAPHY.fontSize.xxlarge} + 10px)`,
            color: `${COLORS.surpressedFontColor}ae`,
          }}
        >
          {message}
        </$h3>
      )}
    </$Vertical>
  )
}

export const $SettingContainer = styled.div<{ disabled?: boolean }>`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  box-shadow: 0px 3px 5px ${COLORS.surpressedBackground};

  ${(props) => props.disabled && `cursor: not-allowed; box-shadow: none;`};
`
