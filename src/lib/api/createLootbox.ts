import { ethers as ethersObj } from 'ethers'
import { SubmitStatus } from 'lib/components/CreateLootbox/StepTermsConditions'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { manifest } from '../../manifest'
import { v4 as uuidv4 } from 'uuid'
import { uploadLootboxLogo, uploadLootboxCover, uploadLootboxBadge } from 'lib/api/firebase/storage'
import { Address, ChainIDHex, ContractAddress, convertHexToDecimal, ITicketMetadata } from '@wormgraph/helpers'
import { decodeEVMLog } from 'lib/api/evm'
import { downloadFile, stampNewLootbox } from 'lib/api/stamp'
import LogRocket from 'logrocket'
import LOOTBOX_INSTANT_FACTORY_ABI from 'lib/abi/LootboxInstantFactory.json'
import LOOTBOX_ESCROW_FACTORY_ABI from 'lib/abi/LootboxEscrowFactory.json'

const checkMobileBrowser = (): boolean => {
  // Checks if on mobile browser https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
  let test: string | undefined = (navigator as any)?.userAgent || (navigator as any)?.vendor || (window as any)?.opera
  if (!test) {
    return false
  }
  return (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      test
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      test.substr(0, 4)
    )
  )
}

interface InstantLootboxArgs {
  nativeTokenPrice: any
  name: string
  symbol: string
  biography: string
  lootboxThemeColor: string
  logoFile: File
  coverFile: File
  badgeFile: File
  fundraisingTarget: any
  fundraisingTargetMax: any
  receivingWallet: Address
  currentAccount: Address
  setLootboxAddress: (address: ContractAddress) => void
  basisPoints: number
  returnAmountTarget: string
  paybackDate: string
  downloaded: boolean
  setDownloaded: (downloaded: boolean) => void
}
const PRICE_PER_SHARE = 0.05
interface LootboxSocials {
  twitter: string
  email: string
  instagram: string
  tiktok: string
  facebook: string
  discord: string
  youtube: string
  snapchat: string
  twitch: string
  web: string
}

export const createInstantLootbox = async (
  provider: ethersObj.providers.Web3Provider | undefined,
  setSubmitStatus: (status: SubmitStatus) => void,
  args: InstantLootboxArgs,
  socials: LootboxSocials,
  chainIdHex: ChainIDHex
) => {
  setSubmitStatus('in_progress')
  const chain = manifest.chains.find((chainRaw) => chainRaw.chainIdHex === chainIdHex)
  if (!chain) {
    throw new Error(`Chain not found for chainIdHex: ${chainIdHex}`)
  }

  const LOOTBOX_INSTANT_FACTORY_ADDRESS = manifest.lootbox.contracts[chainIdHex]?.LootboxInstantFactory
    ?.address as unknown as ContractAddress

  if (!LOOTBOX_INSTANT_FACTORY_ADDRESS) {
    throw new Error('Could not find lootbox instant factory address')
  }

  const web3Utils = useWeb3Utils()
  if (!args.nativeTokenPrice) {
    console.error('No token price')
    setSubmitStatus('failure')
    return
  }
  if (!provider) {
    throw new Error('No provider')
  }
  if (!(args.coverFile && args.logoFile)) {
    throw new Error('Missing images')
  }
  const submissionId = uuidv4()
  const [imagePublicPath, backgroundPublicPath, badgePublicPath] = await Promise.all([
    uploadLootboxLogo(submissionId, args.logoFile),
    uploadLootboxCover(submissionId, args.coverFile),
    args.badgeFile ? uploadLootboxBadge(submissionId, args.badgeFile) : null,
  ])

  /**
   * Send a stringified JSON into the creation method. This will be parsed in the backend when it gets picked up by
   * an event listener.
   *
   * Warning: we leave some fields empty (i.e. "address" or "transactionHash") because we don't have that data available yet
   * Instead, it gets filled in by our backend in an event listener. This causes weaker typing - be sure to coordinate this
   * with the backend @cloudfns repo
   */
  const lootboxURI: ITicketMetadata & { lootboxCustomSchema: { lootbox: { factory: ContractAddress } } } = {
    image: '', // will be filled in by backend
    external_url: '', // will be filled in by backend
    description: args.biography,
    name: args.name,
    background_color: args.lootboxThemeColor.replace('#', ''), // Opensea is not expecting a hashtag according to their docs
    animation_url: '',
    youtube_url: socials.youtube || '',
    lootboxCustomSchema: {
      version: '', // will be filled in by backend
      chain: {
        address: '' as ContractAddress, // will be filled in by backend
        title: '', // will be filled in by backend
        chainIdHex: '', // will be filled in by backend
        chainName: '', // will be filled in by backend
        chainIdDecimal: '', // will be filled in by backend
      },
      lootbox: {
        createdAt: new Date().valueOf(),
        factory: LOOTBOX_INSTANT_FACTORY_ADDRESS,
        fundraisingTarget: args.fundraisingTarget,
        fundraisingTargetMax: args.fundraisingTargetMax,
        basisPointsReturnTarget: args.basisPoints?.toString(),
        returnAmountTarget: args.returnAmountTarget,
        targetPaybackDate: Number(args.paybackDate),
        transactionHash: '', // will be filled in by backend
        blockNumber: '', // will be filled in by backend

        name: args.name,
        description: args.biography,
        image: imagePublicPath,
        backgroundColor: args.lootboxThemeColor,
        backgroundImage: backgroundPublicPath,
        badgeImage: badgePublicPath || '',
        pricePerShare: '',
        lootboxThemeColor: args.lootboxThemeColor,
      },

      socials: {
        twitter: socials.twitter,
        email: socials.email,
        instagram: socials.instagram,
        tiktok: socials.tiktok,
        facebook: socials.facebook,
        discord: socials.discord,
        youtube: socials.youtube,
        snapchat: socials.snapchat,
        twitch: socials.twitch,
        web: socials.web,
      },
    },
  }

  const blockNum = await provider.getBlockNumber()

  const pricePerShare = new web3Utils.BN(web3Utils.toWei(PRICE_PER_SHARE.toString(), 'gwei')).div(
    new web3Utils.BN('10')
  )
  const targetSharesSold = args.fundraisingTarget
    .mul(new web3Utils.BN(args.nativeTokenPrice.toString()))
    .div(pricePerShare)
    .mul(new web3Utils.BN('11'))
    .div(new web3Utils.BN('10'))
    .toString()
  const maxSharesSold = args.fundraisingTargetMax
    .mul(new web3Utils.BN(args.nativeTokenPrice.toString()))
    .div(pricePerShare)
    .mul(new web3Utils.BN('11'))
    .div(new web3Utils.BN('10'))
    .toString()

  const ethers = ethersObj
  const signer = await provider.getSigner()
  const lootboxInstant = new ethers.Contract(LOOTBOX_INSTANT_FACTORY_ADDRESS, LOOTBOX_INSTANT_FACTORY_ABI, signer)

  try {
    console.log(`
    
    ticketState.name = ${args.name}
    ticketState.symbol = ${args.symbol}
    targetSharesSold = ${targetSharesSold}
    maxSharesSold = ${maxSharesSold}
    pricePerShare = ${pricePerShare}
    receivingWallet = ${args.receivingWallet}
    fundraisingTargetMax = ${args.fundraisingTargetMax}
    nativeTokenPrice = ${args.nativeTokenPrice.toString()}

    basisPoints = ${args.basisPoints}
    returnAmountTarget = ${args.returnAmountTarget}

    `)

    await lootboxInstant.createLootbox(
      args.name, // string memory _lootboxName,
      args.symbol, // string memory _lootboxSymbol,
      targetSharesSold.toString(),
      maxSharesSold.toString(), // uint256 _maxSharesSold,
      args.receivingWallet, // address _treasury,
      JSON.stringify(lootboxURI) // string memory _data
    )

    console.log(`Submitted lootbox creation!`)
    const filter = {
      fromBlock: blockNum,
      address: lootboxInstant.address,
      topics: [
        ethers.utils.solidityKeccak256(
          ['string'],
          ['LootboxCreated(string,address,address,address,uint256,uint256,string)']
        ),
      ],
    }
    provider.on(filter, async (log) => {
      if (log !== undefined) {
        const decodedLog = decodeEVMLog({
          eventName: 'LootboxCreated',
          log: log,
          abi: `
          event LootboxCreated(
            string lootboxName,
            address indexed lootbox,
            address indexed issuer,
            address indexed treasury,
            uint256 targetSharesSold,
            uint256 maxSharesSold,
            string _data
          )`,
          keys: ['lootboxName', 'lootbox', 'issuer', 'treasury', 'targetSharesSold', 'maxSharesSold', '_data'],
        })
        const { issuer, lootbox, lootboxName, maxSharesSold, treasury } = decodedLog as any
        const receiver = args.receivingWallet ? args.receivingWallet.toLowerCase() : ''
        const current = args.currentAccount ? (args.currentAccount as String).toLowerCase() : ''
        if (issuer.toLowerCase() === current && treasury.toLowerCase() === receiver) {
          console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created an Instant lootbox!
          Instant Lootbox Address: ${lootbox}
  
          ---------------
          
          `)
          args.setLootboxAddress(lootbox)

          const ticketID = '0x'
          const numShares = ethers.utils.formatEther(maxSharesSold)
          try {
            const [stampUrl] = await Promise.all([
              stampNewLootbox({
                // backgroundImage: ticketState.coverUrl as Url,
                // logoImage: ticketState.logoUrl as Url,
                logoImage: imagePublicPath,
                backgroundImage: backgroundPublicPath,
                badgeImage: badgePublicPath || '',
                themeColor: args.lootboxThemeColor as string,
                name: lootboxName,
                ticketID,
                lootboxAddress: lootbox,
                chainIdHex: chain.chainIdHex,
                numShares,
              }),
            ])
            console.log(`Stamp URL: ${stampUrl}`)
            // Do not download the stamp if on mobile browser - doing so will cause Metamask browser to crash
            if (stampUrl && !args.downloaded && !checkMobileBrowser()) {
              await downloadFile(`${lootboxName}-${lootbox}`, stampUrl)
              args.setDownloaded(true)
            }
          } catch (err) {
            LogRocket.captureException(err)
          } finally {
            setSubmitStatus('success')
          }
        }
      }
    })
  } catch (e) {
    console.log(e)
    LogRocket.captureException(e)
    setSubmitStatus('failure')
  }
}

export const createEscrowLootbox = async (
  provider: ethersObj.providers.Web3Provider | undefined,
  setSubmitStatus: (status: SubmitStatus) => void,
  args: InstantLootboxArgs,
  socials: LootboxSocials,
  chainIdHex: ChainIDHex
) => {
  setSubmitStatus('in_progress')

  const chain = manifest.chains.find((chainRaw) => chainRaw.chainIdHex === chainIdHex)
  if (!chain) {
    throw new Error(`Chain not found for chainIdHex: ${chainIdHex}`)
  }

  const LOOTBOX_ESCROW_FACTORY_ADDRESS = manifest.lootbox.contracts[chainIdHex]?.LootboxEscrowFactory
    ?.address as unknown as ContractAddress

  if (!LOOTBOX_ESCROW_FACTORY_ADDRESS) {
    throw new Error('Could not find lootbox escrow factory address')
  }

  const web3Utils = useWeb3Utils()
  if (!args.nativeTokenPrice) {
    console.error('No token price')
    setSubmitStatus('failure')
    return
  }
  if (!provider) {
    throw new Error('No provider')
  }
  if (!(args.coverFile && args.logoFile)) {
    throw new Error('Missing images')
  }
  const submissionId = uuidv4()
  const [imagePublicPath, backgroundPublicPath, badgePublicPath] = await Promise.all([
    uploadLootboxLogo(submissionId, args.logoFile),
    uploadLootboxCover(submissionId, args.coverFile),
    args.badgeFile ? uploadLootboxBadge(submissionId, args.badgeFile) : null,
  ])
  /**
   * Send a stringified JSON into the creation method. This will be parsed in the backend when it gets picked up by
   * an event listener.
   *
   * Warning: we leave some fields empty (i.e. "address" or "transactionHash") because we don't have that data available yet
   * Instead, it gets filled in by our backend in an event listener. This causes weaker typing - be sure to coordinate this
   * with the backend @cloudfns repo
   */
  const lootboxURI: ITicketMetadata & { lootboxCustomSchema: { lootbox: { factory: ContractAddress } } } = {
    image: '', // will be filled in by backend
    external_url: '', // will be filled in by backend
    description: args.biography,
    name: args.name,
    background_color: args.lootboxThemeColor.replace('#', ''), // Opensea is not expecting a hashtag according to their docs
    animation_url: '',
    youtube_url: socials.youtube || '',
    lootboxCustomSchema: {
      version: '', // will be filled in by backend
      chain: {
        address: '' as ContractAddress, // will be filled in by backend
        title: '', // will be filled in by backend
        chainIdHex: '', // will be filled in by backend
        chainName: '', // will be filled in by backend
        chainIdDecimal: '', // will be filled in by backend
      },
      lootbox: {
        createdAt: new Date().valueOf(),
        factory: LOOTBOX_ESCROW_FACTORY_ADDRESS,
        fundraisingTarget: args.fundraisingTarget,
        fundraisingTargetMax: args.fundraisingTargetMax,
        basisPointsReturnTarget: args.basisPoints?.toString(),
        returnAmountTarget: args.returnAmountTarget,
        targetPaybackDate: Number(args.paybackDate),
        transactionHash: '', // will be filled in by backend
        blockNumber: '', // will be filled in by backend

        name: args.name,
        description: args.biography,
        image: imagePublicPath,
        backgroundColor: args.lootboxThemeColor,
        backgroundImage: backgroundPublicPath,
        badgeImage: badgePublicPath || '',
        pricePerShare: '',
        lootboxThemeColor: args.lootboxThemeColor,
      },

      socials: {
        twitter: socials.twitter,
        email: socials.email,
        instagram: socials.instagram,
        tiktok: socials.tiktok,
        facebook: socials.facebook,
        discord: socials.discord,
        youtube: socials.youtube,
        snapchat: socials.snapchat,
        twitch: socials.twitch,
        web: socials.web,
      },
    },
  }

  const blockNum = await provider.getBlockNumber()

  const pricePerShare = new web3Utils.BN(web3Utils.toWei(PRICE_PER_SHARE.toString(), 'gwei')).div(
    new web3Utils.BN('10')
  )
  const targetSharesSold = args.fundraisingTarget
    .mul(new web3Utils.BN(args.nativeTokenPrice.toString()))
    .div(pricePerShare)
    .mul(new web3Utils.BN('11'))
    .div(new web3Utils.BN('10'))
    .toString()
  const maxSharesSold = args.fundraisingTargetMax
    .mul(new web3Utils.BN(args.nativeTokenPrice.toString()))
    .div(pricePerShare)
    .mul(new web3Utils.BN('11'))
    .div(new web3Utils.BN('10'))
    .toString()

  const ethers = ethersObj
  const signer = await provider.getSigner()
  const lootboxEscrow = new ethers.Contract(LOOTBOX_ESCROW_FACTORY_ADDRESS, LOOTBOX_ESCROW_FACTORY_ABI, signer)

  try {
    console.log(`
    
    ticketState.name = ${args.name}
    ticketState.symbol = ${args.symbol}
    targetSharesSold = ${targetSharesSold}
    maxSharesSold = ${maxSharesSold}
    pricePerShare = ${pricePerShare}
    receivingWallet = ${args.receivingWallet}

    fundraisingTarget = ${args.fundraisingTarget}
    fundraisingTargetMax = ${args.fundraisingTargetMax}

    nativeTokenPrice = ${args.nativeTokenPrice.toString()}

    logoImage = ${imagePublicPath}
    coverImage = ${backgroundPublicPath}
    badgeImage = ${badgePublicPath}

    basisPoints = ${args.basisPoints}
    returnAmountTarget = ${args.returnAmountTarget}

    `)

    await lootboxEscrow.createLootbox(
      args.name, //     string memory _lootboxName,
      args.symbol, //     string memory _lootboxSymbol,
      targetSharesSold.toString(), // uint256 _targetSharesSold,
      maxSharesSold.toString(), // uint256 _maxSharesSold,
      args.receivingWallet, //     address _treasury,
      JSON.stringify(lootboxURI) // string memory _data
    )
    console.log(`Submitted escrow lootbox creation!`)
    const filter = {
      fromBlock: blockNum,
      address: lootboxEscrow.address,
      topics: [
        ethers.utils.solidityKeccak256(
          ['string'],
          ['LootboxCreated(string,address,address,address,uint256,uint256,string)']
        ),
      ],
    }
    provider.on(filter, async (log) => {
      if (log !== undefined) {
        const decodedLog = decodeEVMLog({
          eventName: 'LootboxCreated',
          log: log,
          abi: `
          event LootboxCreated(
            string lootboxName,
            address indexed lootbox,
            address indexed issuer,
            address indexed treasury,
            uint256 targetSharesSold,
            uint256 maxSharesSold,
            string _data
          )`,
          keys: ['lootboxName', 'lootbox', 'issuer', 'treasury', 'targetSharesSold', 'maxSharesSold', '_data'],
        })
        const { issuer, lootbox, lootboxName, targetSharesSold, maxSharesSold, treasury } = decodedLog as any
        const receiver = args.receivingWallet ? args.receivingWallet.toLowerCase() : ''
        const current = args.currentAccount ? (args.currentAccount as String).toLowerCase() : ''
        if (issuer.toLowerCase() === current && treasury.toLowerCase() === receiver) {
          console.log(`
          
          ---- 🎉🎉🎉 ----
          
          Congratulations! You've created an Escrow Lootbox!
          Escrow Lootbox Address: ${lootbox}
  
          ---------------
          
          `)
          args.setLootboxAddress(lootbox)

          const ticketID = '0x'
          const numShares = ethers.utils.formatEther(maxSharesSold)
          try {
            const [stampUrl] = await Promise.all([
              stampNewLootbox({
                // backgroundImage: ticketState.coverUrl as Url,
                // logoImage: ticketState.logoUrl as Url,
                logoImage: imagePublicPath,
                backgroundImage: backgroundPublicPath,
                badgeImage: badgePublicPath || '',
                themeColor: args.lootboxThemeColor as string,
                name: lootboxName,
                ticketID,
                lootboxAddress: lootbox,
                chainIdHex: chain.chainIdHex,
                numShares,
              }),
            ])
            console.log(`Stamp URL: ${stampUrl}`)
            // Do not download the stamp if on mobile browser - doing so will cause Metamask browser to crash
            if (stampUrl && !args.downloaded && !checkMobileBrowser()) {
              await downloadFile(`${lootboxName}-${lootbox}`, stampUrl)
              args.setDownloaded(true)
            }
          } catch (err) {
            LogRocket.captureException(err)
          } finally {
            setSubmitStatus('success')
          }
        }
      }
    })
  } catch (e) {
    console.log(e)
    LogRocket.captureException(e)
    setSubmitStatus('failure')
  }
}
