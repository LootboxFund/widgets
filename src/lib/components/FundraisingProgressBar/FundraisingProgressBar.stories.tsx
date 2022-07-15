import react, { useEffect } from 'react'
import { FundraisingProgressBar, FundraisingProgressBarProps } from '../FundraisingProgressBar'
import { $CardViewport } from '../Generics'
import { COLORS } from 'lib/theme'
import LocalizationWrapper from '../LocalizationWrapper'

const props = {
  percentageFunded: 80,
  fundedAmountNative: '80',
  networkSymbol: 'BNB',
  targetAmountNative: '100',
}

export default {
  title: 'FundraisingProgressBar',
  component: FundraisingProgressBar,
}

const Template = (args: FundraisingProgressBarProps) => {
  return (
    <LocalizationWrapper>
      <$CardViewport width="100vw" maxWidth="600px">
        <FundraisingProgressBar {...args} />
      </$CardViewport>
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = { ...props }
