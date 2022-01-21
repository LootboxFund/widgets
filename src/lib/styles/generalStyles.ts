import styled, { Color, css, Theme } from 'lib/theme'

interface HorizontalProps {
	readonly justifyContent?:
	  | 'flex-start'
	  | 'center'
	  | 'space-evenly'
	  | 'space-between'
	  | 'flex-end';
	readonly verticalCenter?: boolean;
	readonly baseline?: boolean;
	readonly spacing?: 1 | 2 | 3 | 4 | 5;
	readonly wrap?: boolean;
}
const SPACING_VALS = [4, 8, 16, 24, 48];

export const $Horizontal = styled.div<HorizontalProps>`
display: flex;
${(props) =>
	props.justifyContent && `justify-content: ${props.justifyContent};`};
${(props) => props.verticalCenter && 'align-items: center;'};
${(props) => props.baseline && 'align-items: baseline;'};
${(props) => props.wrap && 'flex-wrap: wrap;'};

& > *:not(:last-child) {
	margin-right: ${(props) =>
	props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
}
`;

export const $Vertical = styled.div<{ spacing?: 1 | 2 | 3 | 4 | 5 }>`
& > *:not(:last-child) {
	margin-bottom: ${(props) =>
	props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
}
`;

const Column = styled.div<{
  align?: string
  color?: Color
  justify?: string
  gap?: number
  padded?: true
  flex?: true
  grow?: true
  theme: Theme
  css?: ReturnType<typeof css>
}>`
  align-items: ${({ align }) => align ?? 'center'};
  background-color: inherit;
  color: ${({ color, theme }) => color && theme[color]};
  display: ${({ flex }) => (flex ? 'flex' : 'grid')};
  flex-direction: column;
  flex-grow: ${({ grow }) => grow && 1};
  gap: ${({ gap }) => gap && `${gap}em`};
  grid-auto-flow: row;
  grid-template-columns: 1fr;
  justify-content: ${({ justify }) => justify ?? 'space-between'};
  padding: ${({ padded }) => padded && '0.75em'};

  ${({ css }) => css}
`

export default Column
