import React from 'react'
import StepCard, { StepCardProps } from 'lib/components/CreateLootbox/StepCard'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'StepCard',
  component: StepCard,
  stage: {},
}

const Demo = (args: StepCardProps) => (
  <LocalizationWrapper>
    <div style={{ width: '760px', height: '600px' }}>
      <StepCard themeColor="#F0B90B" stage={'completed'} onNext={() => console.log('onNext')} errors={[]}>
        <h1 style={{ fontFamily: 'sans-serif' }}>Hello World</h1>
      </StepCard>
    </div>
  </LocalizationWrapper>
)

export const Basic = Demo.bind({})
Basic.args = {
  // stage: {
  //   options: ["not_yet" | "in_progress" | "may_proceed" | "completed"],
  //   control: { type: 'radio' },
  // }
}
