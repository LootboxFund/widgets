import React, { useState, useEffect } from 'react'
import { IntlProvider } from 'react-intl'

// TODO put in @helpers
type Locale = 'en' | 'vi'

let initLocale: Locale = 'en'

if (navigator.language === 'vi') {
  initLocale = 'vi'
}

const loadMessages = async (locale: Locale) => {
  switch (locale) {
    case 'vi':
      return import('lib/lang/compiled/vi.json')
    case 'en':
      return import('lib/lang/compiled/en.json')
    default:
      return import('lib/lang/compiled/en.json')
  }
}

// Maybe for now, lets not worry about direction
// const getDirection = (locale: Locale): 'rtl' | 'ltr' => {
//   switch (locale) {
//     case 'en':
//       return 'ltr'
//     case 'fr':
//       return 'ltr'
//     default:
//       return 'ltr'
//   }
// }

type LocalizationWrapperProps = { children: JSX.Element }

const LocalizationWrapper = ({ children }: LocalizationWrapperProps) => {
  const [locale, setLocale] = useState(initLocale)
  const [messages, setMessages] = useState<{ [key: string]: any } | null>(null)

  useEffect(() => {
    // Checks Weglot, which sets the language via Webflow
    if (window && window?.Weglot) {
      window.Weglot.on('languageChanged', (newLang: string, _oldLang: string) => {
        setLocale(newLang?.toLowerCase() as Locale)
      })
    }

    return () => {
      window && window?.Weglot && window.Weglot.off('languageChanged')
    }
  }, [])

  useEffect(() => {
    loadMessages(locale).then((messages) => setMessages(messages.default))
  }, [locale])

  return messages ? (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  ) : null
}
export default LocalizationWrapper
