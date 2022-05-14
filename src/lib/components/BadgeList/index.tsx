import { ChainIDHex, ContractAddress } from '@wormgraph/helpers'
import { userState } from 'lib/state/userState'
import parseUrlParams from 'lib/utils/parseUrlParams'
import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSnapshot } from 'valtio'
import WalletStatus from '../WalletStatus'
import { Contract, ethers as ethersObj } from 'ethers'
import { getProvider } from 'lib/hooks/useWeb3Api'
import BADGE_ABI from 'lib/abi/BadgeBCS.json'

// Constants
const baseTokenURI = 'https://storage.googleapis.com/badge-bcs-uri'
const targetChainIdHex = '0x13881'
//

const fetchBadgeFromGBucket = async (addr: ContractAddress) => {
  const data = await (await fetch(`${baseTokenURI}/${addr.toLowerCase()}/_root.json`)).json()
  return data
}

const fetchBadgeMemberFromGBucket = async (route: string) => {
  const data = await (await fetch(route)).json()
  return data
}

interface IGuildBadgeData {
  name: string
  symbol: string
  logoUrl: string
  twitter: string
  email: string
  numberOfScholars: string
  facebook: string
  discord: string
  twitch: string
  location: string
  gamesPlayed: string
  web: string
  badgeAddress: string
  chainIdHex: ChainIDHex
  chainName: string
}

export interface BadgeListProps {}
export const BadgeList = (props: BadgeListProps) => {
  const [badgeAddress, setBadgeAddress] = useState('')
  const [badgeUri, setBadgeUri] = useState<IGuildBadgeData>()
  const [badgeMembersIdArray, setBadgeMembersIdArray] = useState<number[]>([])
  const [tokenURI, setTokenUri] = useState('')
  const snapUserState = useSnapshot(userState)
  useEffect(() => {
    const addr = parseUrlParams('badge') as ContractAddress
    console.log(`Finding addr = ${addr}`)
    if (addr) {
      setBadgeAddress(addr)
      loadBadgeUri(addr).then((uri) => {
        return loadMyBadges(addr as ContractAddress)
      })
    }
  }, [])
  const loadBadgeUri = async (addr: ContractAddress) => {
    const data = await fetchBadgeFromGBucket(addr)
    setBadgeUri(data)
    return data
  }
  const loadMyBadges = async (badgeAddr: ContractAddress) => {
    if (!badgeAddr) {
      throw new Error('No badge initialized')
    }
    if (!snapUserState.currentAccount) {
      throw new Error('No user account')
    }
    const ethers = window.ethers ? window.ethers : ethersObj
    const { provider } = await getProvider()
    const badgeContract = new ethers.Contract(badgeAddr, BADGE_ABI, provider)
    const [mintedCount, _tokenURI] = await Promise.all([badgeContract.mintedCount(), badgeContract._tokenURI()])
    const tickets = []
    for (let i = 0; i < mintedCount; i++) {
      tickets.push(i)
    }
    setBadgeMembersIdArray(tickets)
    setTokenUri(_tokenURI)
  }
  if (!badgeUri || !tokenURI) {
    return <p>Loading...</p>
  }
  return (
    <section>
      <h1 style={{ fontFamily: 'sans-serif' }}>{badgeUri.name} Members</h1>
      <br />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {badgeMembersIdArray.map((id) => {
          return <BadgeMember id={id} tokenUri={tokenURI} />
        })}
      </div>
    </section>
  )
}

interface BadgeMemberProps {
  id: number
  tokenUri: string
}
const BadgeMember = (props: BadgeMemberProps) => {
  const [badgeData, setBadgeData] = useState<any>()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    loadBadgeMember()
  }, [])
  const loadBadgeMember = async () => {
    try {
      const badgeInfo = await fetchBadgeMemberFromGBucket(`${props.tokenUri}${props.id}.json`)
      setBadgeData(badgeInfo)
      setLoaded(true)
    } catch (e) {
      console.error(e)
    }
  }
  if (!badgeData || !loaded) {
    return null
  }
  return <img src={`${badgeData.image}`} style={{ maxWidth: '300px', margin: '10px' }} />
}

const $BadgeList = styled.div<{}>``

const BadgeWrapper = () => {
  const snapUserState = useSnapshot(userState)
  console.log(`snapUserState`)
  console.log(snapUserState)
  return (
    <section>
      <WalletStatus targetNetwork={targetChainIdHex} />
      <br />
      {snapUserState.currentAccount && <BadgeList />}
    </section>
  )
}

export default BadgeWrapper
