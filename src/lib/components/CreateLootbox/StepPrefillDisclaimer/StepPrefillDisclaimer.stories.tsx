import React from 'react'
import StepPrefillDisclaimer, { StepPrefillDisclaimerProps } from 'lib/components/CreateLootbox/StepPrefillDisclaimer'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'StepPrefillDisclaimer',
  component: StepPrefillDisclaimer,
}

const Demo = (args: StepPrefillDisclaimerProps) => (
  <LocalizationWrapper>
    <StepPrefillDisclaimer {...args} />
  </LocalizationWrapper>
)

export const Basic = Demo.bind({})
Basic.args = {}
