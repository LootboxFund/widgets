import React from 'react'
import SearchBar, { TemplateProps } from 'lib/components/SearchBar'
import LocalizationWrapper from '../LocalizationWrapper'

export default {
  title: 'SearchBar',
  component: SearchBar,
}

const Demo = (args: TemplateProps) => (
  <LocalizationWrapper>
    <SearchBar {...args} />
  </LocalizationWrapper>
)

export const Basic = Demo.bind({})
Basic.args = {}
