import React, { useEffect, useState } from 'react'
import ManageLootbox, { ManageLootboxProps } from 'lib/components/ManageLootbox'
import Web3 from 'web3'
import { useHtmlEthers, useHtmlWeb3 } from 'lib/api/useHtmlScript'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { TicketID, ContractAddress, ITicketMetadata } from '@wormgraph/helpers'
import { NetworkOption } from 'lib/api/network'
import LogRocket from 'logrocket'
import { initLogging } from 'lib/api/logrocket'
import LocalizationWrapper from '../Internationalization/LocalizationWrapper'

export default {
  title: 'Manage Lootbox',
  component: ManageLootbox,
}

const Template = (args: ManageLootboxProps) => {
  const [ticketMetadata, setTicketMetadata] = useState<ITicketMetadata>()
  const [network, setNetwork] = useState<NetworkOption>()
  useEffect(() => {
    initLogging()
    if (window.ethereum) {
      initDApp()
        .then(() => {
          // return readTicketMetadata(props.lootboxAddress, props.ticketID)
          // ------- Temp
          setTicketMetadata({
            address: '0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress,
            name: 'Genesis Hamster',
            description:
              'Your Lootbox fundraises money by selling NFT tickets to investors, who enjoy profit sharing when you deposit earnings back into the Lootbox.',
            image:
              'https://firebasestorage.googleapis.com/v0/b/lootbox-fund-prod.appspot.com/o/assets%2Flootbox%2F3b099ea2-6af8-4aa2-b9c9-91d59c2b3041%2Flogo.jpeg?alt=media&token=3bcf700f-2cdd-4251-85aa-9b31bab79b3a',
            backgroundColor: '#DFDFDF',
            backgroundImage:
              'https://firebasestorage.googleapis.com/v0/b/lootbox-fund-prod.appspot.com/o/assets%2Flootbox%2F3b099ea2-6af8-4aa2-b9c9-91d59c2b3041%2Fcover.jpeg?alt=media&token=2a314850-496c-44a2-aa66-3d0a34d47685',
            badgeImage: '',
            lootbox: {
              address: '0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress,
              transactionHash: '0xcabb31ad8063f85dedb6ac25cb9f8149b8041c243fb6fc847655fa6244b1d84e',
              blockNumber: '0x1021d29',
              chainIdHex: '0x38',
              chainIdDecimal: '56',
              chainName: 'Binance Smart Chain',
              targetPaybackDate: 1652400000000,
              createdAt: 1649870325537,
              fundraisingTarget: 'de0b6b3a7640000',
              fundraisingTargetMax: 'f43fc2c04ee0000',
              basisPointsReturnTarget: '10',
              returnAmountTarget: '10',
              pricePerShare: '0.05',
              lootboxThemeColor: '#DFDFDF',
            },
            socials: {
              twitter: '',
              email: '123@123.com',
              instagram: '',
              tiktok: '',
              facebook: '',
              discord: '',
              youtube: '',
              snapchat: '',
              twitch: '',
              web: '',
            },
          })
          setNetwork({
            name: 'Binance',
            symbol: 'BNB',
            themeColor: '#F0B90B',
            chainIdHex: '0x61',
            chainIdDecimal: '97',
            isAvailable: true,
            isTestnet: true,
            icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
            priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
            faucetUrl: 'https://testnet.binance.org/faucet-smart',
          })
          // ------- Temp
        })
        .then((metadata) => {
          // setTicketMetadata(metadata)
        })
        .catch((err) => LogRocket.captureException(err))
    } else {
      window.addEventListener('ethereum#initialized', initDApp, {
        once: true,
      })
      setTimeout(() => {
        if (!window.ethereum) {
          alert('Please install MetaMask to use this app. Use the Chrome extension or Metamask mobile app')
        } else {
          initDApp().catch((err) => LogRocket.captureException(err))
        }
      }, 3000) // 3 seconds
    }
  }, [])
  if (!network || !ticketMetadata) {
    return 'Loading...'
  }
  return (
    <LocalizationWrapper>
      <ManageLootbox
        {...args}
        themeColor={'#F0B90B'}
        lootboxAddress={'0x3E03B9891a935E7CCeBcE0c6499Bb443e2972B0a' as ContractAddress}
        ticketID={'0' as TicketID}
        ticketMetadata={ticketMetadata}
        network={network}
        lootboxType={'Escrow'}
      />
    </LocalizationWrapper>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
