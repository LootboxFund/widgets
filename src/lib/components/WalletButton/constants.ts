import { IntlShape } from 'react-intl'

export const getWords = (intl: IntlShape) => {
  const loading = intl.formatMessage({
    id: 'walletButton.loading',
    defaultMessage: 'Loading...',
    description: 'Button text when action is loading',
  })

  const connected = intl.formatMessage({
    id: 'walletButton.connected',
    defaultMessage: 'Connected',
    description: 'Button text metamask is connected',
  })

  const metamask = intl.formatMessage({
    id: 'walletButton.installMetamask',
    defaultMessage: 'Please install MetaMask',
    description: 'Button text to install metamask',
  })

  const connect = intl.formatMessage({
    id: 'wallet-button.connect-wallet',
    defaultMessage: 'Connect Wallet',
    description: 'Prompt to user to connect their MetaMask wallet to the website',
  })

  return { loading, connected, metamask, connect }
}
