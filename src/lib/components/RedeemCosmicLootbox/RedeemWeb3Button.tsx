import { PropsWithChildren, useState } from 'react'
import { $Button } from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { userState } from 'lib/state/userState'
import { COLORS } from 'lib/theme'
import { useSnapshot } from 'valtio'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { Address, BLOCKCHAINS, ChainIDHex, chainIdHexToSlug, convertDecimalToHex } from '@wormgraph/helpers'
import useWords from 'lib/hooks/useWords'
import { addCustomEVMChain, updateStateToChain, useProvider, useUserInfo } from 'lib/hooks/useWeb3Api'

export interface RedeemButtonProps {
  targetNetwork?: ChainIDHex
  targetWalletAddress?: Address
}
const RedeemWeb3Button = (props: PropsWithChildren<RedeemButtonProps>) => {
  const snapUser = useSnapshot(userState)
  const [loading, setLoading] = useState(false)
  const snapUserState = useSnapshot(userState)
  const [provider] = useProvider()
  const { screen } = useWindowSize()
  const words = useWords()
  const [status, setStatus] = useState<'ready' | 'error'>('ready')
  const { requestAccounts } = useUserInfo()

  const isWalletConnected = snapUser.accounts.length > 0

  const openMetamaskInstallLink = () => {
    window.open('https://metamask.io/', '_blank')
    setStatus('ready')
  }

  const switchChain = async () => {
    if (!props.targetNetwork) {
      console.error('no target network')
      return
    }
    setLoading(true)
    try {
      await addCustomEVMChain(props.targetNetwork)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    setLoading(true)
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
        setStatus('ready')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'error') {
    return (
      <$Button
        screen={screen}
        onClick={!loading ? openMetamaskInstallLink : undefined}
        color={`${COLORS.warningFontColor}`}
        backgroundColor={`${COLORS.warningBackground}`}
        style={{ textTransform: 'uppercase', height: '60px', width: '100%' }}
        disabled={loading}
      >
        <LoadingText loading={loading} color={`${COLORS.warningFontColor}`} text={words.pleaseInstallMetamask} />
      </$Button>
    )
  } else if (!isWalletConnected) {
    return (
      <$Button
        screen={screen}
        onClick={!loading ? connectWallet : undefined}
        color={`${COLORS.dangerFontColor}90`}
        colorHover={COLORS.dangerFontColor}
        backgroundColor={`${COLORS.dangerBackground}80`}
        backgroundColorHover={`${COLORS.dangerBackground}`}
        style={{ textTransform: 'uppercase', height: '60px', width: '100%' }}
        disabled={loading}
      >
        <LoadingText loading={loading} color={`${COLORS.dangerFontColor}90`} text="Connect" />
      </$Button>
    )
  } else if (props.targetNetwork && snapUserState.network.currentNetworkIdHex !== props.targetNetwork) {
    return (
      <$Button
        screen={screen}
        onClick={!loading ? switchChain : undefined}
        color={`${COLORS.warningFontColor}`}
        backgroundColor={`${COLORS.warningBackground}`}
        style={{ textTransform: 'uppercase', height: '60px', width: '100%' }}
        disabled={loading}
      >
        <LoadingText loading={loading} color={COLORS.warningFontColor} text={words.switchNetwork} />
      </$Button>
    )
  } else if (
    props.targetWalletAddress &&
    snapUser.currentAccount?.toLowerCase() !== props.targetWalletAddress?.toLowerCase()
  ) {
    return (
      <$Button
        screen={screen}
        // onClick={switchChain}
        color={COLORS.white}
        // color={`${COLORS.warningFontColor}`}
        // backgroundColor={`${COLORS.warningBackground}`}
        backgroundColor={COLORS.surpressedBackground}
        style={{
          textTransform: 'uppercase',
          height: '60px',
          maxWidth: '300px',
          minWidth: '200px',
          cursor: 'not-allowed',
        }}
        disabled={loading}
      >
        Wrong Account
      </$Button>
    )
  }

  return <div>{props.children}</div>
}

export default RedeemWeb3Button
