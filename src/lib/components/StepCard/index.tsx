import react from 'react'
import styled from 'styled-components'
import {COLORS, TYPOGRAPHY} from 'lib/theme'

export type StepStage = "not_yet" | "in_progress" | "may_proceed" | "completed"
export interface StepCardProps {
  primaryColor?: string;
  stage: StepStage;
  children: React.ReactNode;
  customActionBar?: () => React.ReactNode;
  onNext: () => void;
}
const StepCard = (props: StepCardProps) => {
  const primaryColor = props.primaryColor || COLORS.surpressedFontColor;
  const renderStepButton = () => {
    if (props.stage === "in_progress") {
      return (
        <$StepButton
          backgroundColor={`${props.primaryColor}3A`}
          borderColor={`${props.primaryColor}02`}
        ></$StepButton>
      )
    }
    if (props.stage === "may_proceed") {
      return (
        <$StepButton
          backgroundColor={`${props.primaryColor}`}
          borderColor={`${props.primaryColor}`}
          clickable
        >
        PROCEED TO NEXT
        </$StepButton>
      )
    }
    if (props.stage === "completed") {
      return (
        <$StepButton
          backgroundColor={`${props.primaryColor}`}
          borderColor={`${props.primaryColor}`}
          clickable
        >
        COMPLETED
        </$StepButton>
      )
    }
    return (
      <$StepButton
        backgroundColor={`${COLORS.surpressedBackground}3A`}
        borderColor={`${COLORS.surpressedBackground}3A`}
      ></$StepButton>
    )
  }
	return (
    <$StepCard primaryColor={primaryColor}>
      <div style={{ padding: '30px', display: 'flex' }}>
        {props.children}
      </div>
      {
        props.customActionBar ? props.customActionBar() : (
          <div style={{ display: 'flex', flex: 1, padding: props.stage === "may_proceed" || props.stage === "completed" ? '0px' : '10px' }}>
        {renderStepButton()}
      </div>
        )
      }
      
		</$StepCard>
	)
}

const $StepCard = styled.div<{
  primaryColor: string;
  boxShadow?: string;
}>`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => `0px 3px 20px ${props.primaryColor}` || "0px 4px 4px rgba(0, 0, 0, 0.25)"};
  border: ${props => `3px solid ${props.primaryColor}`};
  border-radius: 20px;
`

const $StepButton = styled.button<{
  backgroundColor: string;
  borderColor: string;
  clickable?: boolean;
}>`
  background-color: ${props => props.backgroundColor};
  border: 3px solid ${props => props.borderColor};
  min-height: 50px;
  border-radius: 0px 0px 15px 15px;
  flex: 1;
  cursor: ${props => props.clickable ? "pointer" : "default"};
  color: ${COLORS.white};
  margin-left: 0px;
  font-weight: 400;
  font-size: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 40px;
  text-align: left; 
`

export const $StepHeading = styled.h2`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
  margin-top: 0px;
`

export const $StepSubheading = styled.span<{}>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  width: 80%;
`;

export default StepCard;