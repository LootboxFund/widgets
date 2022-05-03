import React from 'react'
import StepPrefillDisclaimer, { StepPrefillDisclaimerProps } from 'lib/components/CreateLootbox/StepPrefillDisclaimer'

export default {
  title: 'StepPrefillDisclaimer',
  component: StepPrefillDisclaimer,
}

const Demo = (args: StepPrefillDisclaimerProps) => <StepPrefillDisclaimer {...args} />

export const Basic = Demo.bind({})
Basic.args = {}
