import React from 'react'
import Swap, { SwapProps } from './index'
import { Provider as I18nProvider } from 'lib/i18n'
import styled, { keyframes, Theme, ThemeProvider, defaultTheme } from 'lib/theme'
import { DEFAULT_LOCALE } from 'constants/locales'

export default {
  title: 'Swap',
  component: Swap,
}

const Template = (args: SwapProps) => {
  return (
    <I18nProvider locale={DEFAULT_LOCALE}>
      <ThemeProvider theme={defaultTheme}>
        <Swap {...args} />
      </ThemeProvider>
    </I18nProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}