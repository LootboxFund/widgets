import styled from 'styled-components'

interface HorizontalProps {
  readonly justifyContent?: 'flex-start' | 'center' | 'space-evenly' | 'space-between' | 'flex-end'
  readonly verticalCenter?: boolean
  readonly baseline?: boolean
  readonly spacing?: 1 | 2 | 3 | 4 | 5
  readonly flex?: number
  readonly flexWrap?: boolean
  readonly alignItems?: 'flex-start' | 'center' | 'flex-end'
  readonly height?: string
  readonly width?: string
  readonly overflowHidden?: boolean
  readonly position?: 'absolute' | 'relative'
  padding?: string
}
const SPACING_VALS = [4, 8, 16, 24, 48]

export const $Horizontal = styled.div<HorizontalProps>`
  display: flex;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${(props) => props.verticalCenter && 'align-items: center;'};
  ${(props) => props.baseline && 'align-items: baseline;'};
  ${(props) => props.flexWrap && 'flex-wrap: wrap;'};
  ${(props) => props.alignItems && `align-items: ${props.alignItems};`};
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.overflowHidden && `overflow: hidden;`}
  ${(props) => props.position && `position: ${props.position};`}
  ${(props) => props.padding && `padding: ${props.padding};`}
  

  & > *:not(:last-child) {
    margin-right: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`

export const $Vertical = styled.div<{
  spacing?: 1 | 2 | 3 | 4 | 5
  flex?: number
  width?: string
  height?: string
  padding?: string
}>`
  display: flex;
  flex-direction: column;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) => props.width && `width: ${props.width};`};
  ${(props) => props.height && `height: ${props.height};`};
  ${(props) => props.padding && `padding: ${props.padding};`}
  & > *:not(:last-child) {
    margin-bottom: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`

export const $CardViewport = styled.div<{ margin?: string; width?: string; height?: string; maxWidth?: string }>`
  width: ${(props) => (props.width ? props.width : '300px')};
  height: ${(props) => (props.height ? props.height : '600px')};
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth};`}
  ${(props) => props.margin && `margin: ${props.margin};`}
`

export const $ScrollVertical = styled.div<{ height?: string }>`
  overflow-y: scroll;
  ${(props) => (props.height ? `height: ${props.height}` : 'height: 80%')};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 10px;
`
export const $ScrollHorizontal = styled.div<{ height?: string }>`
  overflow-x: scroll;
  ${(props) => (props.height ? `height: ${props.height}` : 'height: 80%')};
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: stretch;
  gap: 10px;
`

export const $Container = styled.section<{ screen: string | undefined }>`
  width: 100%;
  height: 100%;
  border: 0px solid transparent;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  padding: ${(props) => (props.screen === 'mobile' ? '0px' : '20px')};
  box-shadow: ${(props) => (props.screen === 'mobile' ? 'none' : '0px 4px 4px rgba(0, 0, 0, 0.1)')};
`
