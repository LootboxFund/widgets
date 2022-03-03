import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Generics/Button'
import { COLORS } from 'lib/theme'
import { updateStateToChain, useUserInfo, useEthers } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import useWindowSize from 'lib/hooks/useScreenSize'
import NetworkText from 'lib/components/NetworkText'
import { BLOCKCHAINS, chainIdHexToSlug, convertDecimalToHex } from '@lootboxfund/helpers'
import { useProvider } from '../../hooks/useWeb3Api/index'

export interface WalletStatusProps {}
const WalletStatus = (props: WalletStatusProps) => {
  const snapUserState = useSnapshot(userState)
  const [provider] = useProvider()
  const { screen } = useWindowSize()

  const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'error' | 'network'>('ready')

  const { requestAccounts } = useUserInfo()

  useEffect(() => {
    if (snapUserState.accounts.length > 0) {
      setStatus('success')
      setTimeout(() => {
        setStatus('network')
      }, 1000)
    }
  }, [snapUserState.accounts.length])

  const connectWallet = async () => {
    setStatus('loading')
    const result = await requestAccounts()
    if (result.success && provider) {
      const network = await provider.getNetwork()
      const chainIdHex = convertDecimalToHex(network.chainId.toString())
      const chainSlug = chainIdHexToSlug(chainIdHex)
      if (chainSlug) {
        const blockchain = BLOCKCHAINS[chainSlug]
        if (blockchain) {
          updateStateToChain(blockchain)
        }
      }
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const openMetamaskInstallLink = () => {
    window.open('https://metamask.io/', '_blank')
    setStatus('ready')
  }

  if (status === 'loading') {
    return (
      <$Button
        screen={screen}
        disabled
        color={`${COLORS.warningBackground}`}
        backgroundColor={`${COLORS.warningBackground}80`}
        style={{
          minHeight: '50px',
          border: `1px solid ${COLORS.warningBackground}40`,
          fontWeight: 500,
          fontSize: '1.2rem',
        }}
      >
        Loading...
      </$Button>
    )
  } else if (status === 'success') {
    return (
      <$Button
        screen={screen}
        disabled
        color={`${COLORS.trustFontColor}`}
        backgroundColor={`${COLORS.trustBackground}80`}
        style={{
          minHeight: '50px',
          border: `1px solid ${COLORS.trustFontColor}40`,
          fontWeight: 500,
          fontSize: '1.2rem',
        }}
      >
        Connected
      </$Button>
    )
  } else if (status === 'error') {
    return (
      <$Button
        screen={screen}
        onClick={() => openMetamaskInstallLink()}
        color={`${COLORS.warningFontColor}`}
        backgroundColor={`${COLORS.warningBackground}`}
        style={{
          minHeight: '50px',
          border: `1px solid ${COLORS.warningFontColor}40`,
          fontWeight: 500,
          fontSize: '1rem',
        }}
      >
        Please install MetaMask
      </$Button>
    )
  } else if (status === 'network') {
    return <NetworkText />
  }
  return (
    <div style={screen === 'mobile' ? { width: '200px', display: 'flex' } : {}}>
      <$Button
        screen={screen}
        onClick={connectWallet}
        color={`${COLORS.dangerFontColor}90`}
        colorHover={COLORS.dangerFontColor}
        backgroundColor={`${COLORS.dangerBackground}80`}
        backgroundColorHover={`${COLORS.dangerBackground}`}
        style={{
          minHeight: '50px',
          border: `1px solid ${COLORS.dangerFontColor}40`,
          fontWeight: 500,
          fontSize: '1.2rem',
        }}
      >
        Connect Wallet
      </$Button>
    </div>
  )
}

const $WalletStatus = styled.div<{}>`
  display: flex;
  width: 200px;
`

export default WalletStatus
