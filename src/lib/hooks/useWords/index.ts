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

  const logout = intl.formatMessage({
    id: 'generic.logout',
    defaultMessage: 'Logout',
    description: 'User action to logout of our website',
  })

  const address = intl.formatMessage({
    id: 'generic.address',
    defaultMessage: 'Address',
    description:
      'This is a blockchain address, usually a Metamask wallet address. (i.e. user has 0x1234567890123456789012345678901234567890 address)',
  })

  const remove = intl.formatMessage({
    id: 'generic.remove',
    defaultMessage: 'Remove',
    description: 'Generic user action to remove something',
  })

  const wallets = intl.formatMessage({
    id: 'generic.wallets',
    defaultMessage: 'Wallets',
    description: 'A wallet is a cryptocurrency wallet, similar to an "address"',
  })

  const search = intl.formatMessage({
    id: 'generic.search',
    defaultMessage: 'Search',
    description: 'Generic user action to search for something',
  })

  const addWallet = intl.formatMessage({
    id: 'generic.addWallet',
    defaultMessage: 'Add wallet',
    description: 'Generic user action to add a crypto wallet to our website. This is done by connecting metamask.',
  })

  const areYouSure = intl.formatMessage({
    id: 'generic.areYouSure',
    defaultMessage: 'Are you sure?',
    description: 'Generic user action to confirm something',
  })

  const yes = intl.formatMessage({
    id: 'generic.yes',
    defaultMessage: 'Yes',
    description: 'Indicating "yes" or "ok" (positive)',
  })

  const no = intl.formatMessage({
    id: 'generic.no',
    defaultMessage: 'No',
    description: 'Indicating "no" or "cancel" (negative)',
  })

  const edit = intl.formatMessage({
    id: 'generic.edit',
    defaultMessage: 'Edit',
    description: 'Generic user action to edit something',
  })

  const view = intl.formatMessage({
    id: 'generic.view',
    defaultMessage: 'View',
    description: 'Generic user action to view something',
  })

  const searchLootboxesByNameOrAddress = intl.formatMessage({
    id: 'generic.searchLootboxesByNameOrAddress',
    defaultMessage: 'Search Lootboxes by Name or Address',
    description: 'Generic user action to search for Lootboxes by name or the smart contract address.',
  })

  const createLootbox = intl.formatMessage({
    id: 'generic.createLootbox',
    defaultMessage: 'Create a Lootbox',
    description: 'User action to create a Lootbox',
  })

  const title = intl.formatMessage({
    id: 'generic.title',
    defaultMessage: 'Title',
    description: 'Title of a Lootbox or an esports tournament etc',
  })

  const description = intl.formatMessage({
    id: 'generic.description',
    defaultMessage: 'Description',
    description: 'Description of something, mainly used as a header for a text input for example.',
  })

  const magicLink = intl.formatMessage({
    id: 'generic.magicLink',
    defaultMessage: 'Magic link',
    description: 'Magic link is a special URL link that lets users create a Lootbox with predefined fields.',
  })

  const createMagicLink = intl.formatMessage({
    id: 'generic.createMagicLink',
    defaultMessage: 'Create magic link',
    description: 'User action to create a magic link',
  })

  const battleDate = intl.formatMessage({
    id: 'generic.battleDate',
    defaultMessage: 'Battle date',
    description: 'Date of an online esports tournament battle or 1v1',
  })

  const prize = intl.formatMessage({
    id: 'generic.prize',
    defaultMessage: 'Prize',
    description:
      'Prize of an online esports tournament battle or 1v1, usually in crypto currency, but can also be fiat currency or anything else for that matter',
  })

  const manage = intl.formatMessage({
    id: 'generic.manage',
    defaultMessage: 'Manage',
    description: 'Generic user action to manage something (AKA. edit something)',
  })

  const watchTutorial = intl.formatMessage({
    id: 'generic.watchTutorial',
    defaultMessage: 'Watch tutorial',
    description: 'User prompt to watch a tutorial video',
  })

  const createNew = intl.formatMessage({
    id: 'generic.createNew',
    defaultMessage: 'Create new',
    description: 'Generic user action to create a new something',
  })

  const clickingHere = intl.formatMessage({
    id: 'generic.clickingHere',
    defaultMessage: 'Clicking here',
    description: 'Generic user action to click something. In a sentence like: "Navigate to profile by clicking here"',
  })

  const learnMore = intl.formatMessage({
    id: 'generic.learnMore',
    defaultMessage: 'Learn more',
    description: 'Generic user action to learn more about something',
  })

  const notFound = intl.formatMessage({
    id: 'generic.notFound',
    defaultMessage: 'Not found',
    description: 'Generic user action to not find something',
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
    logout,
    address,
    remove,
    wallets,
    search,
    addWallet,
    areYouSure,
    yes,
    no,
    edit,
    view,
    searchLootboxesByNameOrAddress,
    createLootbox,
    title,
    description,
    magicLink,
    battleDate,
    prize,
    manage,
    watchTutorial,
    createMagicLink,
    createNew,
    clickingHere,
    learnMore,
    notFound,
  }
}

export default useWords
