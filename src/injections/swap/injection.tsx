import Swap from 'lib/components/Swap'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as I18nProvider } from 'lib/i18n'
import styled, { keyframes, Theme, ThemeProvider, defaultTheme } from 'lib/theme'
import { DEFAULT_LOCALE } from 'constants/locales'

export const injectSwap = () => {
  const targetInjectionPoint = document.getElementById('app')
  ReactDOM.render(
    <React.StrictMode>
      <I18nProvider locale={DEFAULT_LOCALE}>
        <ThemeProvider theme={defaultTheme}>
          <Swap />
        </ThemeProvider>
      </I18nProvider>
    </React.StrictMode>,
    targetInjectionPoint
  )
}
