import React from 'react'
import StepCard, { StepCardProps } from 'lib/components/CreateLootbox/StepCard'


export default {
  title: 'StepCard',
  component: StepCard,
  stage: {

  }
}

const Demo = (args: StepCardProps) => (
  <div style={{ width: '760px', height: '600px' }}>
    <StepCard themeColor='#F0B90B' stage={"completed"} onNext={() => console.log("onNext")} errors={[]}>
      <h1 style={{fontFamily: "sans-serif"}}>Hello World</h1>
    </StepCard>
  </div>
)

export const Basic = Demo.bind({})
Basic.args = {
  // stage: {
  //   options: ["not_yet" | "in_progress" | "may_proceed" | "completed"],
  //   control: { type: 'radio' },
  // }
}
