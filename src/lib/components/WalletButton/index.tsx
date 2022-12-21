import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Generics/Button'
import { COLORS } from 'lib/theme'
import { updateStateToChain, useEthers, useUserInfo } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import useWindowSize from 'lib/hooks/useScreenSize'
import NetworkText from 'lib/components/NetworkText'
import { BLOCKCHAINS, chainIdHexToSlug, convertDecimalToHex } from '@wormgraph/helpers'
import { useProvider } from '../../hooks/useWeb3Api/index'
import useWords from 'lib/hooks/useWords'

export const BASE_BUTTON_STYLE = { minHeight: '60px' }

export interface WalletButtonProps {
  style?: React.CSSProperties
}
const WalletButton = (props: WalletButtonProps) => {
  const snapUserState = useSnapshot(userState)
  const [provider] = useProvider()
  const { screen } = useWindowSize()
  const words = useWords()

  const [status, setStatus] = useState<'ready' | 'loading' | 'success' | 'error' | 'network'>('ready')

  const { requestAccounts } = useUserInfo()

  useEffect(() => {
    if (snapUserState.accounts.length > 0) {
      setStatus('success')
    }
  }, [snapUserState.accounts.length])

  const connectWallet = async () => {
    setStatus('loading')
    try {
      const result = await requestAccounts()
      if (result?.code === 4001) {
        // User rejected
        setStatus('ready')
      } else if (result.success && provider) {
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
    } catch (err) {
      console.error(err)
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
          // border: `1px solid ${COLORS.warningBackground}40`,
          // fontWeight: 500,
          // fontSize: '1.2rem',
          textTransform: 'uppercase',
          ...BASE_BUTTON_STYLE,
          ...(props.style ?? props.style),
        }}
      >
        {words.loading}...
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
          ...BASE_BUTTON_STYLE,
          ...(props.style ?? props.style),
        }}
      >
        {words.connected}
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
          ...BASE_BUTTON_STYLE,
          ...(props.style ?? props.style),
        }}
      >
        {words.pleaseInstallMetamask}
      </$Button>
    )
  } else if (status === 'network') {
    return <NetworkText />
  }
  return (
    <$Button
      screen={screen}
      onClick={connectWallet}
      color={`${COLORS.dangerFontColor}90`}
      colorHover={COLORS.dangerFontColor}
      backgroundColor={`${COLORS.dangerBackground}80`}
      backgroundColorHover={`${COLORS.dangerBackground}`}
      style={{
        ...BASE_BUTTON_STYLE,
        ...(props.style ?? props.style),
      }}
    >
      {words.connectWallet}
    </$Button>
  )
}

const $WalletButton = styled.div<{}>`
  display: flex;
  width: 200px;
`

export default WalletButton
