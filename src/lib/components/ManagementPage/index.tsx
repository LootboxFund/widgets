import ManageLootbox from 'lib/components/ManageLootbox'
import RewardSponsors from 'lib/components/RewardSponsors'
import { Address, ContractAddress, ITicketMetadata, TicketID } from '@wormgraph/helpers'
import { useEffect, useRef, useState } from 'react'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import LogRocket from 'logrocket'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { readTicketMetadata } from 'lib/api/storage'
import { identifyLootboxType, LootboxType } from 'lib/hooks/useContract'
import { $Horizontal } from 'lib/components/Generics'
import WalletStatus from 'lib/components/WalletStatus'

const mockJSON = {
    "address": "0x62f84c1B9B0eFb87A13d0e9Ea84D63EE44C279D4" as ContractAddress,
    "name": "Ocean Voyage",
    "description": "Your Lootbox fundraises money by selling NFT tickets to investors, who enjoy profit sharing when you deposit earnings back into the Lootbox.\n",
    "image": "https://firebasestorage.googleapis.com/v0/b/lootbox-fund-staging.appspot.com/o/assets%2Flootbox%2F1b0d4f79-9c7f-4468-bfa2-ac0cedbc03ca%2Flogo.png?alt=media&token=0a09f6a5-8456-493c-aa01-9b9f3f62dc8f",
    "backgroundColor": "#45E5D5",
    "backgroundImage": "https://firebasestorage.googleapis.com/v0/b/lootbox-fund-staging.appspot.com/o/assets%2Flootbox%2F1b0d4f79-9c7f-4468-bfa2-ac0cedbc03ca%2Fcover.png?alt=media&token=ec23a859-9197-406e-a451-4fd3419b3719",
    "badgeImage": "",
    "lootbox": {
      "address": "0x62f84c1B9B0eFb87A13d0e9Ea84D63EE44C279D4" as ContractAddress,
      "transactionHash": "0xe1ffd7da0518a119977804c9550f7f28ff6ecc2e6ec577c89488f08a390a39a1",
      "blockNumber": "0x11bf7a9",
      "chainIdHex": "0x61",
      "chainIdDecimal": "97",
      "chainName": "Binance Smart Chain (Testnet)",
      "targetPaybackDate": 1653004800000,
      "createdAt": 1650444494034,
      "fundraisingTarget": "16345785d8a0000",
      "fundraisingTargetMax": "186cc6acd4b0000",
      "basisPointsReturnTarget": "10",
      "returnAmountTarget": "10",
      "pricePerShare": "0.05",
      "lootboxThemeColor": "#45E5D5"
    },
    "socials": {
      "twitter": "",
      "email": "asdflj@asf.com",
      "instagram": "",
      "tiktok": "",
      "facebook": "",
      "discord": "",
      "youtube": "",
      "snapchat": "",
      "twitch": "",
      "web": ""
    }
  }


export interface ManagementPageProps {}

const ManagementPage = () => {
  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [ticketMetadata, setTicketMetadata] = useState<ITicketMetadata>()
  const [network, setNetwork] = useState<NetworkOption>()
  const [lootboxType, setLootboxType] = useState<LootboxType>()

  const refRewardSponsors = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const addr = parseUrlParams('lootbox') as ContractAddress
    setLootboxAddress(addr)
    initLogging()
    if (window.ethereum && addr) {
      initDApp()
        .then(() => {
          return identifyLootboxType(addr)
        })
        .then((lootboxType) => {
          setLootboxType(lootboxType)
          // return readTicketMetadata(addr, '0' as TicketID)
          // ------- Temp
          return mockJSON
          // ------- Temp
        })
        .then((metadata) => {
          setTicketMetadata(metadata)
          const network = matchNetworkByHex(metadata.lootbox.chainIdHex)
          if (network) {
            setNetwork(network)
          }
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

  if (!network || !ticketMetadata || !lootboxAddress || !lootboxType) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <$Horizontal justifyContent="flex-end" style={{ maxWidth: '800px' }}>
        <WalletStatus />
      </$Horizontal>
      <br />
      <ManageLootbox
        themeColor={'#F0B90B'}
        lootboxAddress={lootboxAddress}
        ticketID={'0' as TicketID}
        ticketMetadata={ticketMetadata}
        network={network}
        lootboxType={lootboxType}
        scrollToRewardSponsors={() => refRewardSponsors.current?.scrollIntoView()}
      />
      <br />
      <br />
      <div ref={refRewardSponsors}>
        <RewardSponsors lootboxAddress={lootboxAddress} ticketMetadata={ticketMetadata} network={network} lootboxType={lootboxType} />
      </div>
    </div>
  )
}

export default ManagementPage
