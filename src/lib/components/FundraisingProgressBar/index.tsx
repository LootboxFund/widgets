import ReactTooltip from 'react-tooltip'
import { TYPOGRAPHY } from '@wormgraph/helpers'
import { COLORS } from 'lib/theme'
import { $Vertical, $Horizontal } from '../Generics'
import HelpIcon from '../../theme/icons/Help.icon'
import styled from 'styled-components'

export interface FundraisingProgressBarProps {
  percentageFunded: number
  fundedAmountNative: string
  networkSymbol: string
  targetAmountNative: string
  themeColor?: string
}

const FundraisingProgressBar = (props: FundraisingProgressBarProps) => {
  return (
    <$ProgressBarWrapper>
      <$Vertical>
        <$Horizontal justifyContent="space-between">
          <$Horizontal verticalCenter>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
                marginRight: '10px',
              }}
            >
              {`${props.percentageFunded}% Funded`}
            </span>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.medium,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.light,
                marginRight: '10px',
              }}
            >
              {`${props.fundedAmountNative} ${props.networkSymbol}`}
            </span>
          </$Horizontal>
          <$Horizontal>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
              }}
            >
              {`${props.targetAmountNative} ${props.networkSymbol} Goal`}
            </span>
            <HelpIcon tipID="fundingGoal" />
            <ReactTooltip id="fundingGoal" place="right" effect="solid">
              Max 10 MATIC
            </ReactTooltip>
          </$Horizontal>
        </$Horizontal>
        {props.percentageFunded !== undefined && (
          <ProgressBar
            themeColor={props.themeColor || COLORS.green}
            progress={props.percentageFunded > 100 ? 100 : props.percentageFunded}
          />
        )}
      </$Vertical>
    </$ProgressBarWrapper>
  )
}

const ProgressBar = ({ progress, themeColor }: { progress: number; themeColor: string }) => {
  return (
    <$Horizontal
      style={{
        width: '100%',
        height: '20px',
        marginTop: '10px',
        backgroundColor: `${themeColor}3A`,
        borderRadius: '10px',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <div style={{ height: '100%', width: `${progress}%`, backgroundColor: themeColor, borderRadius: '10px' }}></div>
    </$Horizontal>
  )
}

const $ProgressBarWrapper = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export default FundraisingProgressBar
