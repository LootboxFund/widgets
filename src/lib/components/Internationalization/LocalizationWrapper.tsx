import React, { useState, useEffect } from 'react'
import {
  useIntl,
  IntlProvider,
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  FormattedRelativeTime,
  FormattedNumber,
  FormattedList,
} from 'react-intl'

// TODO put in @helpers
type Locale = 'en' | 'fr'

let initLocale: Locale = 'fr'

if (navigator.language === 'fr') {
  initLocale = 'fr'
}

const loadMessages = async (locale: Locale) => {
  console.log('loading messages', locale)
  switch (locale) {
    case 'fr':
      return import('lib/lang/fr.json')
    case 'en':
      return import('lib/lang/en.json')
    default:
      return import('lib/lang/en.json')
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

const LocalizationWrapper = ({ children, ...rest }: LocalizationWrapperProps) => {
  const [locale, setLocale] = useState(initLocale)
  const [messages, setMessages] = useState<{ [key: string]: any } | null>(null)

  useEffect(() => {
    loadMessages(locale).then((messages) => setMessages(messages.default))
  }, [locale])

  console.log('messages loaded', messages)

  return messages ? (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  ) : null
}
export default LocalizationWrapper
