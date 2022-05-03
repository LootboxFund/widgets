import { NetworkOption } from 'lib/api/network'
import react from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { $Vertical } from 'lib/components/Generics'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'

export interface StepPrefillDisclaimerProps {
  selectedNetwork?: NetworkOption | undefined
  prefilledFields: string[]
}
const StepPrefillDisclaimer = (props: StepPrefillDisclaimerProps) => {
  return (
    <$StepPrefillDisclaimer>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={'may_proceed'} onNext={() => {}} errors={[]}>
        <$Vertical>
          <$StepHeading>
            You are using a Magic Link
            <HelpIcon tipID="stepNetwork" />
            <ReactTooltip id="stepNetwork" place="right" effect="solid">
              {`Want to create your own Magic Link? Scroll all the way down past "Step 7. Terms & Conditions". Click the button labeled "Create Magic Link".`}
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            Creating this Lootbox is easy because you are using a magic link that pre-fills several fields for you.
            Please use the pre-sets and customize the rest.
          </$StepSubheading>
          <br />
          <$StepSubheading>{`The following ${props.prefilledFields.length} fields have been pre-filled:`}</$StepSubheading>
          <br />
          {props.prefilledFields.map((desc, index) => (
            <$StepSubheading key={index}>
              <span style={{ marginRight: '20px' }}>✅</span>
              {desc}
            </$StepSubheading>
          ))}
        </$Vertical>
      </StepCard>
    </$StepPrefillDisclaimer>
  )
}

const $StepPrefillDisclaimer = styled.div<{}>`
  font-family: sans-serif;
  width: 100%;
`

export default StepPrefillDisclaimer
