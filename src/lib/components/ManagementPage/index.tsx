import ManageLootbox from 'lib/components/ManageLootbox'
import RewardSponsors from 'lib/components/RewardSponsors'
import { Address, ChainIDHex, COLORS, ContractAddress, ITicketMetadata, TicketID } from '@wormgraph/helpers'
import { useEffect, useRef, useState } from 'react'
import { matchNetworkByHex, NetworkOption } from 'lib/api/network'
import { initLogging } from 'lib/api/logrocket'
import { addCustomEVMChain, initDApp } from 'lib/hooks/useWeb3Api'
import LogRocket from 'logrocket'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { readLootboxMetadata } from 'lib/api/storage'
import { identifyLootboxType, LootboxType } from 'lib/hooks/useContract'
import { $Horizontal, $p } from 'lib/components/Generics'
import WalletStatus from 'lib/components/WalletStatus'
import BulkMint from 'lib/components/BulkMint'
import { LootboxMetadata } from 'lib/api/graphql/generated/types'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import $Button from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'

export interface ManagementPageProps {}

const ManagementPage = () => {
  const [lootboxAddress, setLootboxAddress] = useState<ContractAddress>()
  const [lootboxMetadata, setLootboxMetadata] = useState<LootboxMetadata>()
  const [network, setNetwork] = useState<NetworkOption>()
  const [lootboxType, setLootboxType] = useState<LootboxType>()
  const [isActivelyFundraising, setIsActivelyFundraising] = useState<boolean>(true)
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()

  const refRewardSponsors = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const addr = parseUrlParams('lootbox') as ContractAddress
    setLootboxAddress(addr)
    initLogging()
    if (addr) {
      readLootboxMetadata(addr)
        .then((metadata: LootboxMetadata) => {
          if (!metadata || !metadata?.lootboxCustomSchema) {
            throw Error('No metadata found')
          }
          setLootboxMetadata(metadata)
          const network = matchNetworkByHex(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
          if (network) {
            setNetwork(network)
          }
        })
        .catch((err) => LogRocket.captureException(err))
    }
    if (window.ethereum && addr) {
      initDApp()
        .then(() => {
          return identifyLootboxType(addr)
        })
        .then((data) => {
          // console.log('lootbox type...')
          // console.log(data)
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

  const switchChain = async (chainIdHex: ChainIDHex) => {
    await addCustomEVMChain(chainIdHex)
  }

  if (!network || !lootboxAddress || !lootboxType || !lootboxMetadata || !lootboxMetadata?.lootboxCustomSchema) {
    if (lootboxMetadata && lootboxMetadata?.lootboxCustomSchema?.lootbox) {
      const targetChain = lootboxMetadata?.lootboxCustomSchema?.chain?.chainIdHex
      return (
        <section>
          {snapUserState.accounts.length === 0 && <$p>You need to connect your MetaMask wallet</$p>}
          <WalletStatus targetNetwork={targetChain} />
          {snapUserState?.network?.currentNetworkIdHex &&
            targetChain &&
            snapUserState?.network?.currentNetworkIdHex !== targetChain && (
              <div>
                <$p>Wrong Network, you need to switch to {lootboxMetadata?.lootboxCustomSchema?.chain?.chainName}</$p>
                <$Button
                  screen={screen}
                  color={`${COLORS.dangerFontColor}90`}
                  colorHover={COLORS.dangerFontColor}
                  backgroundColor={`${COLORS.dangerBackground}80`}
                  backgroundColorHover={`${COLORS.dangerBackground}`}
                  onClick={() => switchChain(targetChain)}
                  style={{
                    minHeight: '50px',
                    border: `1px solid ${COLORS.dangerFontColor}40`,
                    fontWeight: 500,
                    fontSize: '1.2rem',
                  }}
                >
                  Switch network
                </$Button>
              </div>
            )}
        </section>
      )
    }
    return <$p>{`Could not find metadata for Lootbox ${lootboxAddress}.`}</$p>
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
      <br />
      <br />
      <div style={snapUserState.currentAccount ? {} : { opacity: 0.2, cursor: 'not-allowed' }}>
        <BulkMint
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
