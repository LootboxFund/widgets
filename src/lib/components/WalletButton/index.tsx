import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import { updateStateToChain, useUserInfo } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'

export interface WalletButtonProps {}
const WalletButton = (props: WalletButtonProps) => {
  console.log(props)
  const snapUserState = useSnapshot(userState)

  const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'error'>('ready')

  const { requestAccounts } = useUserInfo()

  useEffect(() => {
    if (snapUserState.accounts.length > 0) {
      setStatus('success')
    }
  }, [snapUserState.accounts.length])

  const connectWallet = async () => {
    console.log('Connecting to wallet...')
    setStatus('loading')
    const result = await requestAccounts()
    console.log(`
      
    -------- REQUEST ACCOUNTS

    `)
    console.log(result)
    if (result.success) {
      userState.currentAccount = userState.accounts[0]
      const chainIdHex = await (window as any).ethereum.request({ method: 'eth_chainId' })
      const blockchain = BLOCKCHAINS[chainIdHex]
      if (blockchain) {
        updateStateToChain(blockchain)
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
  }
  return (
    <$Button
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
  )
}

const $WalletButton = styled.div<{}>`
  display: flex;
  width: 200px;
`

export default WalletButton
