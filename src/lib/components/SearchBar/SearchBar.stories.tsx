import React from 'react'
import SearchBar, { TemplateProps } from 'lib/components/SearchBar'

export default {
  title: 'SearchBar',
  component: SearchBar,
}

const Demo = (args: TemplateProps) => <SearchBar {...args} />

export const Basic = Demo.bind({})
Basic.args = {}
