import React, { useState } from 'react'
import RepeatCreate, { RepeatCreateProps } from 'lib/components/RepeatCreate'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'RepeatCreate',
  component: RepeatCreate,
}

const Demo = (args: RepeatCreateProps) => {
  return (
    <LocalizationWrapper>
      <RepeatCreate {...args} tournamentName={'3PG Axie Tournament'} themeColor={'#8F5AE8'} />
    </LocalizationWrapper>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
