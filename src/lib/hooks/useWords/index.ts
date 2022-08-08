import { useIntl } from 'react-intl'

export const useSignatures = () => {
  const intl = useIntl()

  const loginMessage = intl.formatMessage({
    id: 'signatures.loginMessage',
    defaultMessage:
      "Welcome! Sign this message to login to Lootbox. This doesn't cost you anything and is free of any gas fees.",
    description:
      'Message to sign (using their MetaMask wallet) to login to Lootbox. A signature is a cryptographic hash of a message.',
  })

  const whitelistMessage = intl.formatMessage({
    id: 'signatures.whitelistMessage',
    defaultMessage:
      "Sign this message to see if you can redeem a FREE NFT from Lootbox! This doesn't cost you anything and is free of any gas fees.",
    description:
      'Message to sign to see if you can redeem a FREE NFT from Lootbox. A signature is a cryptographic hash of a message',
  })

  return {
    loginMessage,
    whitelistMessage,
  }
}

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

  const pleaseInstallMetamaskChromeExtension = intl.formatMessage({
    id: 'generic.pleaseInstallMetamaskChromeExtension',
    defaultMessage: 'Please install MetaMask to use this app. Use the Chrome extension or Metamask mobile app.',
    description:
      'Error message shown to user when they do not have the metamask extension installed. We suggest using a chrome extension.',
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

  const buyLootbox = intl.formatMessage({
    id: 'generic.buyLootbox',
    defaultMessage: 'Buy Lootbox',
    description: 'Text to buy from a Lootbox using cryptocurrency.',
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
    description: 'Generic user action to view something, (i.e. "view Lootbox")',
  })

  const searchLootboxesByNameOrAddress = intl.formatMessage({
    id: 'generic.searchLootboxesByNameOrAddress',
    defaultMessage: 'Search Lootboxes by Name or Address',
    description: 'Generic user action to search for Lootboxes by name or the smart contract address.',
  })

  const contractAddress = intl.formatMessage({
    id: 'generic.contractAddress',
    defaultMessage: 'Contract address',
    description:
      'This is a blockchain smart contract address, (i.e. smart contract has address 0x1234567890123456789012345678901234567890)',
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

  const advancedCreate = intl.formatMessage({
    id: 'generic.advancedCreate',
    defaultMessage: 'Advanced Create',
    description: 'Generic user action to create a new something in full',
  })

  const clickingHere = intl.formatMessage({
    id: 'generic.clickingHere',
    defaultMessage: 'Clicking here',
    description: 'Generic user action to click something. In a sentence like: "Navigate to profile by clicking here"',
  })

  const clickHere = intl.formatMessage({
    id: 'generic.clickHere',
    defaultMessage: 'Click here',
    description: 'Generic user action to click something. In a sentence like: "Click here to navigate to profile"',
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

  const partyBasket = intl.formatMessage({
    id: 'generic.partyBasket',
    defaultMessage: 'Party basket',
    description:
      'This is the name of a piece of software we use to manage Lootbox bounties. In sentence: "You can redeem a Lootbox NFT from your tournament`s party basket"',
  })

  const partyBaskets = intl.formatMessage({
    id: 'generic.partyBaskets',
    defaultMessage: 'Party baskets',
    description:
      'Plural, This is the name of a piece of software we use to manage Lootbox bounties. In sentence: "You can redeem a Lootbox NFT from your tournament`s party basket"',
  })

  const submitting = intl.formatMessage({
    id: 'generic.submitting',
    defaultMessage: 'Submitting',
    description: 'Text indicating that something is submitting',
  })

  const success = intl.formatMessage({
    id: 'generic.success',
    defaultMessage: 'Success',
    description: 'Generic text indicate a success',
  })

  const createAPartyBasket = intl.formatMessage({
    id: 'generic.createAPartyBasket',
    defaultMessage: 'Create a Party Basket',
    description: 'User action to create a party basket',
  })

  const error = intl.formatMessage({
    id: 'generic.error',
    defaultMessage: 'Error',
    description: 'Generic text indicating an error or a problem',
  })

  const copiedToClipBoard = intl.formatMessage({
    id: 'generic.copiedToClipBoard',
    defaultMessage: 'Copied to clipboard',
    description: 'Generic text indicating that something has been copied to the clipboard',
  })

  const add = intl.formatMessage({
    id: 'generic.add',
    defaultMessage: 'Add',
    description: 'text indicating to add something to something else',
  })

  const processing = intl.formatMessage({
    id: 'generic.processing',
    defaultMessage: 'Processing',
    description: 'Generic text indicating that something is processing',
  })

  const wrongNetworkPleaseChangeTo = intl.formatMessage({
    id: 'generic.wrongNetworkPleaseChangeTo',
    defaultMessage: 'You are on the wrong network! Please change your MetaMask network to',
    description:
      'Text indicating you are on the wrong blockchain network. This is not a full sentence, we will show a target network immediately after. For example, "Please change your MetaMask network to (ETHEREUM)"',
  })

  const pleaseRefreshThePage = intl.formatMessage({
    id: 'generic.pleaseRefreshThePage',
    defaultMessage: 'Please refresh the page',
    description: 'Text asking user if they can refresh the browser page.',
  })

  const funded = intl.formatMessage({
    id: 'generic.funded',
    defaultMessage: 'Funded',
    description: 'Generic text indicating that something has been funded (aka. received investment)',
  })

  const goal = intl.formatMessage({
    id: 'generic.goal',
    defaultMessage: 'Goal',
    description: 'Generic text indicating that something has a goal',
  })

  const rewards = intl.formatMessage({
    id: 'generic.rewards',
    defaultMessage: 'Rewards',
    description: 'Plural form of "reward"',
  })

  const version = intl.formatMessage({
    id: 'generic.version',
    defaultMessage: 'Version',
    description: 'Generic text indicating the version of something (i.e. software version of "1.0.0")',
  })

  const minted = intl.formatMessage({
    id: 'generic.minted',
    defaultMessage: 'Minted',
    description: 'Word indicating that an NFT on the blockchain has been created',
  })

  const copy = intl.formatMessage({
    id: 'generic.copy',
    defaultMessage: 'Copy',
    description: 'Generic text indicating to copy something',
  })

  const viewOnBlockExplorer = intl.formatMessage({
    id: 'generic.viewOnBlockExplorer',
    defaultMessage: 'View on block explorer',
    description:
      'Generic text indicating to view a smart contract or transaction on a block explorer (like bscscan.com)',
  })

  const receivingWallet = intl.formatMessage({
    id: 'generic.receivingWallet',
    defaultMessage: 'Receiving wallet',
    description: 'Text indicating the address of a wallet to receive something (like a crypto payment)',
  })

  const receiverAddress = intl.formatMessage({
    id: 'generic.receivingAddress',
    defaultMessage: 'Receiver address',
    description:
      'Text indicating the address of a wallet to receive something (like a crypto payment), synonymous to "receiving wallet',
  })

  const reputationAddress = intl.formatMessage({
    id: 'generic.reputationAddress',
    defaultMessage: 'Reputation address',
    description: 'Text indicating the address that the gamer want to link their reputation to',
  })

  const testnet = intl.formatMessage({
    id: 'generic.testnet',
    defaultMessage: 'Testnet',
    description:
      '"Testnet" is a blockchain specifically for testing purposes. Testnets are used to test features with fake money.',
  })

  const rewardSponsors = intl.formatMessage({
    id: 'generic.rewardSponsors',
    defaultMessage: 'Reward sponsors',
    description: 'Title which means you can reward your sponsors with crypto!',
  })

  const viewTransactionReceipt = intl.formatMessage({
    id: 'generic.viewTransactionReceipt',
    defaultMessage: 'View transaction reciept',
    description: 'Text indicating to view the transaction receipt',
  })

  const bulkMintNFTs = intl.formatMessage({
    id: 'generic.bulkMintNFTs',
    defaultMessage: 'Bulk mint NFTs',
    description: 'Text indicating to bulk mint NFTs',
  })

  const loginToMakePartyBasket = intl.formatMessage({
    id: 'generics.loginToMakePartyBasket',
    defaultMessage: 'Login to make a Party Basket',
    description: 'User prompt indicating that the user should login to make a Party Basket.',
  })

  const partyBasketInformation = intl.formatMessage({
    id: 'generics.partyBasketInformation',
    defaultMessage:
      "We recommend you use a Party Basket to bulk mint NFTs to your fanbase. Party baskets allow you to whitelist bounty pick-ups in batch, which means you don't need to send the NFTs manually. Instead, your fanbase can redeem the bounties themselves.",
    description: 'Tooltip for creating a Party Basket',
  })

  const win = intl.formatMessage({
    id: 'generic.win',
    defaultMessage: 'Win',
    description: 'Indicating to win something like a challenge',
  })

  const inDays = (nDays: number): string => {
    return intl.formatMessage(
      {
        id: 'socials.paybackDate',
        defaultMessage: 'In {nDays} days',
        description: 'Date countdown. For example, "In 3 days, the tournament starts"',
      },
      {
        nDays,
      }
    )
  }

  const seeMore = intl.formatMessage({
    id: 'generic.seeMore',
    defaultMessage: 'See more',
    description: 'Text indicating to see more',
  })

  const addLiveStream = intl.formatMessage({
    id: 'generic.addLiveStream',
    defaultMessage: 'Add Live Stream',
    description: 'Text prompting user to add a Live Stream to their tournament',
  })

  const name = intl.formatMessage({
    id: 'generic.name',
    defaultMessage: 'Name',
    description: 'Generic text indicating the name of something',
  })

  const nameCannotBeEmpty = intl.formatMessage({
    id: 'generic.nameCannotBeEmpty',
    defaultMessage: 'Name cannot be empty',
    description: 'Error message for user if they forgot to enter a name in a form',
  })

  const shareLink = intl.formatMessage({
    id: 'generic.shareLink',
    defaultMessage: 'Share link',
    description: 'Text to share a hyperlink',
  })

  const saveChanges = intl.formatMessage({
    id: 'generics.saveChanges',
    defaultMessage: 'Save Changes',
    description: 'Button text to save changes to a tournament or something',
  })

  const networkNotSet = intl.formatMessage({
    id: 'generics.networkNotSet',
    defaultMessage: 'Network not set',
    description: 'Error message for user if they forgot to set a blockchain network',
  })

  const confirmOnMetamask = intl.formatMessage({
    id: 'step.terms.submit.metamask-confirmation',
    defaultMessage: 'Confirm on MetaMask',
    description: 'Message shown to user when they need to confirm the transaction on MetaMask',
  })

  const joinTournament = intl.formatMessage({
    id: 'quickCreateLootbox.singleStep.button.joinTournament',
    defaultMessage: 'Join Tournament',
    description: 'Text to join an esports tournament',
  })

  const pleaseEnterYourPhoneNumber = intl.formatMessage({
    id: 'generics.pleaseEnterYourPhoneNumber',
    defaultMessage: 'Please enter your phone number',
    description: 'Text prompting user to enter their phone number',
  })

  const confirm = intl.formatMessage({
    id: 'generics.confirm',
    defaultMessage: 'Confirm',
    description: 'Text to confirm something',
  })

  const verificationCode = intl.formatMessage({
    id: 'generics.verificationCode',
    defaultMessage: 'Verification code',
    description: 'Text to enter a verification code for signup',
  })

  const tournament = intl.formatMessage({
    id: 'generics.tournament',
    defaultMessage: 'Tournament',
    description: 'Text to describe an esports tournament',
  })

  const freeNFT = intl.formatMessage({
    id: 'generics.freeNFT',
    defaultMessage: 'Free NFT',
    description: 'Text to describe a free NFT',
  })

  const retry = intl.formatMessage({
    id: 'generics.retry',
    defaultMessage: 'Retry',
    description: 'Text to retry something',
  })

  const verifyYourPhoneNumber = intl.formatMessage({
    id: 'generics.verifyYourPhoneNumber',
    defaultMessage: 'Verify your phone number',
  })

  const sendCode = intl.formatMessage({
    id: 'generics.sendCode',
    defaultMessage: 'Send code',
    description: 'Text to send a code',
  })

  const event = intl.formatMessage({
    id: 'generics.event',
    defaultMessage: 'Event',
    description: 'Event, like an esports tournament',
  })

  const date = intl.formatMessage({
    id: 'generics.date',
    defaultMessage: 'Date',
    description: 'Calendar date',
  })

  const about = intl.formatMessage({
    id: 'generics.about',
    defaultMessage: 'About',
  })

  const finish = intl.formatMessage({
    id: 'generics.finish',
    defaultMessage: 'Finish',
  })

  const tryAgain = intl.formatMessage({
    id: 'generics.tryAgain',
    defaultMessage: 'Try again',
  })

  return {
    retry,
    sendCode,
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
    advancedCreate,
    clickingHere,
    learnMore,
    notFound,
    partyBasket,
    clickHere,
    submitting,
    success,
    createAPartyBasket,
    error,
    copiedToClipBoard,
    add,
    processing,
    pleaseInstallMetamaskChromeExtension,
    wrongNetworkPleaseChangeTo,
    pleaseRefreshThePage,
    funded,
    goal,
    rewards,
    version,
    minted,
    copy,
    viewOnBlockExplorer,
    receivingWallet,
    reputationAddress,
    testnet,
    rewardSponsors,
    contractAddress,
    viewTransactionReceipt,
    bulkMintNFTs,
    receiverAddress,
    partyBaskets,
    loginToMakePartyBasket,
    partyBasketInformation,
    win,
    inDays,
    seeMore,
    addLiveStream,
    name,
    nameCannotBeEmpty,
    shareLink,
    buyLootbox,
    saveChanges,
    networkNotSet,
    confirmOnMetamask,
    joinTournament,
    pleaseEnterYourPhoneNumber,
    confirm,
    verificationCode,
    tournament,
    freeNFT,
    verifyYourPhoneNumber,
    event,
    date,
    about,
    finish,
    tryAgain,
  }
}

export default useWords
