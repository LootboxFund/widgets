import styled from 'styled-components'

interface HorizontalProps {
  readonly justifyContent?: 'flex-start' | 'center' | 'space-evenly' | 'space-between' | 'flex-end'
  readonly verticalCenter?: boolean
  readonly baseline?: boolean
  readonly spacing?: 1 | 2 | 3 | 4 | 5
  readonly wrap?: boolean
  readonly flex?: number
  readonly height?: string
}
const SPACING_VALS = [4, 8, 16, 24, 48]

export const $Horizontal = styled.div<HorizontalProps>`
  display: flex;
  ${(props) => props.flex && `flex: ${props.flex};`};
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${(props) => props.verticalCenter && 'align-items: center;'};
  ${(props) => props.baseline && 'align-items: baseline;'};
  ${(props) => props.wrap && 'flex-wrap: wrap;'};
  ${(props) => props.height && `height: ${props.height};`}

  & > *:not(:last-child) {
    margin-right: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`

export const $Vertical = styled.div<{ spacing?: 1 | 2 | 3 | 4 | 5; flex?: number }>`
  display: flex;
  flex-direction: column;
  ${(props) => props.flex && `flex: ${props.flex};`};
  & > *:not(:last-child) {
    margin-bottom: ${(props) => props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`

export const $CardViewport = styled.div<{ width?: string; height?: string }>`
  width: ${(props) => (props.width ? props.width : '300px')};
  height: ${(props) => (props.height ? props.height : '600px')};
`

export const $ScrollContainer = styled.div<{ height?: string }>`
  overflow-y: scroll;
  ${(props) => (props.height ? `height: ${props.height}` : 'height: 80%')};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 10px;
`
