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

export interface ManagementPageProps {}

const ManagementPage = () => {
  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [ticketMetadata, setTicketMetadata] = useState<ITicketMetadata>()
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
          return readTicketMetadata(addr)
        })
        .then((metadata: ITicketMetadata) => {
          if (!metadata || !metadata?.lootboxCustomSchema) {
            throw Error('No metadata found')
          }
          setTicketMetadata(metadata)
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

  console.log(network)
  console.log(lootboxAddress)
  console.log(lootboxType)
  console.log(ticketMetadata)

  if (!network || !lootboxAddress || !lootboxType || !ticketMetadata) {
    if (ticketMetadata && ticketMetadata?.lootboxCustomSchema?.lootbox) {
      return (
        <section>
          <WalletStatus targetNetwork={ticketMetadata?.lootboxCustomSchema?.chain?.chainIdHex} />
        </section>
      )
    }
    return (
      <p>{`Could not find metadata for Lootbox ${lootboxAddress}. Make sure your Metamask is connected to the right blockchain. We cannot tell you which Chain its on, please ask the original issuer. Once you switch to the right chain, this will load correctly.`}</p>
    )
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
      <div ref={refRewardSponsors} style={isActivelyFundraising ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
        <RewardSponsors
          lootboxAddress={lootboxAddress}
          ticketMetadata={ticketMetadata}
          network={network}
          lootboxType={lootboxType}
        />
      </div>
    </div>
  )
}

export default ManagementPage
