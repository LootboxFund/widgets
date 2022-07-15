import { useIntl } from 'react-intl'

export const useManageLootboxWords = () => {
  const intl = useIntl()

  const fundraisingPeriodSuccessfullyEnded = intl.formatMessage({
    id: 'lootbox.manage.fundraisingPeriodSuccessfullyEnded',
    defaultMessage: 'Fundraising period successfully ended. You may now reward sponsors.',
    description: 'Message to user after they succesffulyl end the fundraising period for a Lootbox.',
  })
  return {
    fundraisingPeriodSuccessfullyEnded,
  }
}
