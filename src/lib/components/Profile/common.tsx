import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { ScreenSize } from 'lib/hooks/useScreenSize'
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
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${COLORS.surpressedFontColor}7a;
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${COLORS.surpressedFontColor}7a;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${COLORS.surpressedFontColor}7a;
  }
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
        <$h2>{icon}</$h2>
        <$h2 style={{ marginLeft: '10px' }}>{title}</$h2>
      </$Horizontal>
      {message && (
        <$h3
          style={{
            margin: `0px auto auto calc(${TYPOGRAPHY.fontSize.xxlarge} + 10px)`,
            color: `${COLORS.surpressedFontColor}ae`,
            fontWeight: TYPOGRAPHY.fontWeight.regular,
          }}
        >
          {message}
        </$h3>
      )}
    </$Vertical>
  )
}

export const $ProfileButton = styled.button<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
  screen: ScreenSize
  justifyContent?: string
}>`
  padding: 12px 30px;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  border-radius: 6px;
  flex: 1;
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
  font-size: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  line-height: ${(props) => (props.screen === 'desktop' ? TYPOGRAPHY.fontSize.xlarge : TYPOGRAPHY.fontSize.large)};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
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

export const $SettingContainer = styled.div<{ disabled?: boolean }>`
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  ${(props) => props.disabled && `cursor: not-allowed; box-shadow: none;`};
`

export const $ProfileSectionContainer = styled.div<{ screen: ScreenSize }>`
  background: #ffffff;
  box-shadow: 0px 3px 4px ${COLORS.surpressedBackground}aa;
  border-radius: 10px;
  padding: ${(props) => (props.screen === 'mobile' ? '1.5rem 1rem 2.2rem' : '1.2rem 1.6rem 3.4rem')};
`
