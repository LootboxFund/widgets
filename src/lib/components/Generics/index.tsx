import styled from 'styled-components';

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
  readonly flex?: number;
}
const SPACING_VALS = [4, 8, 16, 24, 48];

export const $Horizontal = styled.div<HorizontalProps>`
  display: flex;
  ${(props) => props.flex && `flex: ${props.flex};`};
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

export const $Vertical = styled.div<{ spacing?: 1 | 2 | 3 | 4 | 5, flex?: number; }>`
  display: flex;
  flex-direction: column;
  ${(props) => props.flex && `flex: ${props.flex};`};
  & > *:not(:last-child) {
    margin-bottom: ${(props) =>
      props.spacing && `${SPACING_VALS[props.spacing - 1]}px`};
  }
`;