import React, { useState } from 'react'
import QuickCreate, { QuickCreateProps } from 'lib/components/QuickCreate'
import LocalizationWrapper from 'lib/components/LocalizationWrapper'

export default {
  title: 'QuickCreate',
  component: QuickCreate,
}

const Demo = (args: QuickCreateProps) => {
  return (
    <LocalizationWrapper>
      <QuickCreate {...args} tournamentName={'3PG Axie Tournament'} themeColor={'#8F5AE8'} />
    </LocalizationWrapper>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
