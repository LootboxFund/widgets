import react from 'react'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import CheckIcon from 'lib/theme/icons/Check.icon'
import useWindowSize from 'lib/hooks/useScreenSize'

export type StepStage = 'not_yet' | 'in_progress' | 'may_proceed' | 'completed'
export interface StepCardProps {
  themeColor?: string
  stage: StepStage
  children: React.ReactNode
  customActionBar?: () => React.ReactNode
  onNext: () => void
  errors?: string[]
}
const StepCard = (props: StepCardProps) => {
  const totalErrors = (props.errors || []).filter((e) => e).length
  const themeColor = props.themeColor || COLORS.surpressedFontColor
  const { screen } = useWindowSize()
  const renderStepButton = () => {
    if (totalErrors > 0) {
      return (
        <$StepButton backgroundColor={`${props.themeColor}3A`} borderColor={`${props.themeColor}02`}>
          <$StepError>{(props.errors || []).filter((e) => e)[0]}</$StepError>
        </$StepButton>
      )
    }
    if (props.stage === 'in_progress') {
      return (
        <$StepButton backgroundColor={`${props.themeColor}3A`} borderColor={`${props.themeColor}02`}>
          <$StepError>{(props.errors || []).filter((e) => e)[0]}</$StepError>
        </$StepButton>
      )
    }
    if (props.stage === 'may_proceed') {
      return (
        <$StepButton
          backgroundColor={`${props.themeColor}`}
          borderColor={`${props.themeColor}`}
          clickable
          onClick={props.onNext}
        >
          <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>✔</span> COMPLETED
        </$StepButton>
      )
    }
    if (props.stage === 'completed') {
      return (
        <$StepButton
          backgroundColor={`${props.themeColor}`}
          borderColor={`${props.themeColor}`}
          clickable
          onClick={props.onNext}
        >
          <CheckIcon width={20} /> COMPLETED
        </$StepButton>
      )
    }
    return (
      <$StepButton
        backgroundColor={`${COLORS.surpressedBackground}3A`}
        borderColor={`${COLORS.surpressedBackground}02`}
      ></$StepButton>
    )
  }
  return (
    <$StepCard themeColor={themeColor} stage={props.stage}>
      <div style={screen === 'mobile' ? { padding: '15px', display: 'flex' } : { padding: '30px', display: 'flex' }}>
        {props.children}
      </div>
      {props.customActionBar ? (
        props.customActionBar()
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: props.stage === 'may_proceed' || props.stage === 'completed' ? '0px' : '10px',
          }}
        >
          {renderStepButton()}
        </div>
      )}
    </$StepCard>
  )
}

const $StepCard = styled.div<{
  themeColor: string
  boxShadow?: string
  stage?: StepStage
}>`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.stage === 'in_progress' ? `0px 3px 20px ${props.themeColor}` : '0px 3px 20px rgba(0, 0, 0, 0.1)'};
  border: ${(props) =>
    props.stage === 'may_proceed' || props.stage === 'in_progress'
      ? `3px solid ${props.themeColor}`
      : '0px solid transparent'};
  border-radius: 20px;
`

const $StepButton = styled.button<{
  backgroundColor: string
  borderColor: string
  clickable?: boolean
}>`
  background-color: ${(props) => props.backgroundColor};
  border: 3px solid ${(props) => props.borderColor};
  min-height: 50px;
  border-radius: 0px 0px 15px 15px;
  flex: 1;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  color: ${COLORS.white};
  margin-left: 0px;
  font-weight: 400;
  font-size: 1rem;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 40px;
  text-align: left;
`

export const $StepHeading = styled.h2`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  color: ${COLORS.black};
  margin-top: 0px;
  vertical-align: middle;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

export const $StepSubheading = styled.span<{}>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  width: 90%;
  margin-bottom: 3px;
  vertical-align: middle;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

export const $StepError = styled.span<{}>`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  color: ${COLORS.dangerFontColor};
`

export default StepCard
