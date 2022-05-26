import ManageLootbox from 'lib/components/ManageLootbox'
import RewardSponsors from 'lib/components/RewardSponsors'
import { Address, ContractAddress, ILootboxMetadata, ITicketMetadata, TicketID } from '@wormgraph/helpers'
import { useEffect, useRef, useState } from 'react'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { initLogging } from 'lib/api/logrocket'
import { initDApp } from 'lib/hooks/useWeb3Api'
import LogRocket from 'logrocket'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { readLootboxMetadata } from 'lib/api/storage'
import { identifyLootboxType, LootboxType } from 'lib/hooks/useContract'
import { $Horizontal } from 'lib/components/Generics'
import WalletStatus from 'lib/components/WalletStatus'

export interface ManagementPageProps {}

const ManagementPage = () => {
  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [lootboxMetadata, setLootboxMetadata] = useState<ILootboxMetadata>()
  const [network, setNetwork] = useState<NetworkOption>()
  const [lootboxType, setLootboxType] = useState<LootboxType>()
  const [isActivelyFundraising, setIsActivelyFundraising] = useState<boolean>(true)

  const refRewardSponsors = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const addr = parseUrlParams('lootbox') as ContractAddress
    setLootboxAddress(addr)
    initLogging()
    if (window.ethereum && addr) {
      initDApp()
        .then(() => {
          return readLootboxMetadata(addr)
        })
        .then((metadata: ILootboxMetadata) => {
          if (!metadata || !metadata?.lootboxCustomSchema) {
            throw Error('No metadata found')
          }
          setLootboxMetadata(metadata)
          const network = matchNetworkByHex(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
          if (network) {
            setNetwork(network)
          }
          return identifyLootboxType(addr)
        })
        .then((data) => {
          console.log('lootbox type...')
          console.log(data)
          const [lootboxType, isFundraising] = data
          setLootboxType(lootboxType)
          setIsActivelyFundraising(isFundraising)
          // ------- Temp
          // return mockJSON
          // ------- Temp
        })
        .catch((err) => LogRocket.captureException(err))
    } else {
      window.addEventListener('ethereum#initialized', () => initDApp(), {
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

  console.log(network)
  console.log(lootboxAddress)
  console.log(lootboxType)
  console.log(lootboxMetadata)

  if (!network || !lootboxAddress || !lootboxType || !lootboxMetadata) {
    if (lootboxMetadata && lootboxMetadata?.lootboxCustomSchema?.lootbox) {
      return (
        <section>
          <WalletStatus targetNetwork={lootboxMetadata?.lootboxCustomSchema?.chain?.chainIdHex} />
        </section>
      )
    }
    return <p>{`Could not find metadata for Lootbox ${lootboxAddress}.`}</p>
  }

  return (
    <div>
      <$Horizontal justifyContent="flex-end" style={{ maxWidth: '800px' }}>
        <WalletStatus targetNetwork={network.chainIdHex} />
      </$Horizontal>
      <br />
      <div
        style={
          lootboxMetadata.lootboxCustomSchema.chain.chainIdHex != network.chainIdHex
            ? { opacity: 0.2, cursor: 'not-allowed' }
            : {}
        }
      >
        <ManageLootbox
          themeColor={'#F0B90B'}
          lootboxAddress={lootboxAddress}
          ticketID={'0' as TicketID}
          lootboxMetadata={lootboxMetadata}
          network={network}
          lootboxType={lootboxType}
          scrollToRewardSponsors={() => refRewardSponsors.current?.scrollIntoView()}
        />
      </div>
      <br />
      <br />
      <div
        ref={refRewardSponsors}
        style={
          isActivelyFundraising || lootboxMetadata.lootboxCustomSchema.chain.chainIdHex != network.chainIdHex
            ? { opacity: 0.2, cursor: 'not-allowed' }
            : {}
        }
      >
        <RewardSponsors
          lootboxAddress={lootboxAddress}
          lootboxMetadata={lootboxMetadata}
          network={network}
          lootboxType={lootboxType}
        />
      </div>
    </div>
  )
}

export default ManagementPage
