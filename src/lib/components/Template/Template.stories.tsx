import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'
import Template, { TemplateProps } from 'lib/components/Template'


export default {
  title: 'Template',
  component: Template,
}

const Demo = (args: TemplateProps) => (
	<ThemeProvider theme={theme}>
		<Template {...args} />
	</ThemeProvider>
)

export const Basic = Demo.bind({})
Basic.args = {}
