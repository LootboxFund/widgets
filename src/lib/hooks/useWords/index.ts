import { useIntl } from 'react-intl'

const useWords = () => {
  const intl = useIntl()

  const cancel = intl.formatMessage({
    id: 'generic.cancel',
    defaultMessage: 'Cancel',
    description: 'Generic user action to cancel something',
  })

  const back = intl.formatMessage({
    id: 'generic.back',
    defaultMessage: 'Back',
    description: 'Generic user action to go back a step',
  })

  const network = intl.formatMessage({
    id: 'generic.network',
    defaultMessage: 'Network',
    description: '"Network" meaning the blockchain network the user is connected to',
  })

  const anErrorOccured = intl.formatMessage({
    id: 'generic.anErrorOccured',
    defaultMessage: 'An error occured',
    description: 'Generic error message for when something goes wrong',
  })

  const loading = intl.formatMessage({
    id: 'generic.loading',
    defaultMessage: 'Loading',
    description: 'Generic loading message',
  })

  const balance = intl.formatMessage({
    id: 'generic.balance',
    defaultMessage: 'Balance',
    description: 'Generic text for a cryptocurrency balance in a MetaMask wallet (i.e. user has 10 eth balance)',
  })

  const pleaseInstallMetamask = intl.formatMessage({
    id: 'generic.pleaseInstallMetamask',
    defaultMessage: 'Please install MetaMask',
    description: 'Button text prompting user to install metamask',
  })

  const switchNetwork = intl.formatMessage({
    id: 'generic.switchNetwork',
    defaultMessage: 'Switch network',
    description: 'Button text prompting user to switch blockchain networks (i.e. going from Ethereum to Binance)',
  })

  const pleaseTryAgainLater = intl.formatMessage({
    id: 'generic.pleaseTryAgainLater',
    defaultMessage: 'Please try again later',
    description: 'Generic error message for when something goes wrong, prompting the user to try again at a later time',
  })

  const hide = intl.formatMessage({
    id: 'generic.hide',
    defaultMessage: 'Hide',
    description: 'Generic user action to hide something on the website',
  })

  const shares = intl.formatMessage({
    id: 'generic.shares',
    defaultMessage: 'Shares',
    description:
      'Shares are considered a portion of the Lootbox`s earnings which allows a user to share the Lootboxes / gamers profits. It is similar to the term "share" in investment, where you can buy "shares" of a company in the stock exchange.',
  })

  const readMore = intl.formatMessage({
    id: 'generic.readMore',
    defaultMessage: 'Read more',
    description: 'Generic user action to read more about something',
  })

  const signUp = intl.formatMessage({
    id: 'generic.signUp',
    defaultMessage: 'Sign up',
    description: 'User action to sign up for our website (AKA: make an account or register)',
  })

  const login = intl.formatMessage({
    id: 'generic.login',
    defaultMessage: 'Log in',
    description: 'Generic user action to login to our website',
  })

  const rememberMe = intl.formatMessage({
    id: 'generic.rememberMe',
    defaultMessage: 'Remember me',
    description:
      'Button text to remember users login details for next time. This allows the user to sign in automatically without entering a password',
  })

  const connectWalletToMetamask = intl.formatMessage({
    id: 'generic.connectWalletToMetamask',
    defaultMessage: 'Please connect your wallet with MetaMask',
    description: 'User prompting them to connect their metamask wallet to our website',
  })

  const email = intl.formatMessage({ id: 'generic.email', defaultMessage: 'Email', description: 'Email address' })

  const password = intl.formatMessage({
    id: 'generic.password',
    defaultMessage: 'Password',
    description: 'Password for a user account',
  })

  const register = intl.formatMessage({
    id: 'generic.register',
    defaultMessage: 'Register',
    description: 'User action to register for our website (synonym to sign up)',
  })

  const confirmPassword = intl.formatMessage({
    id: 'generic.confirmPassword',
    defaultMessage: 'Confirm password',
    description:
      'Password confirmation for a user account. Here they need to input the password again and make sure it is the same.',
  })

  const resetPassword = intl.formatMessage({
    id: 'generic.resetPassword',
    defaultMessage: 'Reset password',
    description: 'User action to reset their password',
  })

  const connected = intl.formatMessage({
    id: 'walletButton.connected',
    defaultMessage: 'Connected',
    description: 'Button text metamask is connected',
  })

  const connectWallet = intl.formatMessage({
    id: 'wallet-button.connect-wallet',
    defaultMessage: 'Connect Wallet',
    description: 'Prompt to user to connect their MetaMask wallet to the website',
  })

  return {
    cancel,
    back,
    network,
    anErrorOccured,
    loading,
    balance,
    pleaseInstallMetamask,
    switchNetwork,
    pleaseTryAgainLater,
    hide,
    shares,
    readMore,
    signUp,
    login,
    rememberMe,
    connectWalletToMetamask,
    email,
    password,
    register,
    confirmPassword,
    resetPassword,
    connected,
    connectWallet,
  }
}

export default useWords
