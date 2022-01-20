import React from 'react'
import CrowdSale, { CrowdSaleProps } from './index'
import { Provider as I18nProvider } from 'lib/i18n'
import styled, { keyframes, Theme, ThemeProvider, defaultTheme } from 'lib/theme'
import { DEFAULT_LOCALE } from 'constants/locales'

export default {
  title: 'CrowdSale',
  component: CrowdSale,
}

const Template = (args: CrowdSaleProps) => {
  return (
    <I18nProvider locale={DEFAULT_LOCALE}>
      <ThemeProvider theme={defaultTheme}>
        <CrowdSale {...args} />
      </ThemeProvider>
    </I18nProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}