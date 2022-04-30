import { $Button } from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { addCustomEVMChain, useEthers } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { useSnapshot } from 'valtio'
import WalletButton from '../WalletButton'
import { buySharesState, purchaseLootboxShare } from './state'
import { parseWei } from './helpers'
import BN from 'bignumber.js'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { BLOCKCHAINS, ContractAddress, ITicketMetadata } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import { readTicketMetadata } from 'lib/api/storage'

export const BASE_BUTTON_STYLE = { minHeight: '60px', height: '100px' }

export interface BuyButtonProps {}
const BuyButton = (props: BuyButtonProps) => {
  const ethers = useEthers()
  const snapUserState = useSnapshot(userState)
  const snapBuySharesState = useSnapshot(buySharesState)
  const { screen } = useWindowSize()
  const [metadata, setMetadata] = useState<ITicketMetadata | undefined>()

  useEffect(() => {
    if (snapBuySharesState.lootbox.address) {
      readTicketMetadata(snapBuySharesState.lootbox.address as ContractAddress)
        .then((data) => {
          setMetadata(data)
        })
        .catch((err) => {
          console.error('Could not read metadata', err)
        })
    }
  }, [snapBuySharesState.lootbox.address])

  const switchChain = async () => {
    if (metadata?.lootboxCustomSchema?.chain?.chainIdHex) {
      await addCustomEVMChain(metadata?.lootboxCustomSchema?.chain?.chainIdHex)
    }
  }

  const isWalletConnected = snapUserState.accounts.length > 0
  const isInputAmountValid =
    snapBuySharesState.inputToken.quantity && parseFloat(snapBuySharesState.inputToken.quantity) > 0
  const balance = new BN(snapBuySharesState.inputToken.balance || '0')
  const quantity = parseWei(
    snapBuySharesState.inputToken.quantity || '0',
    snapBuySharesState.inputToken.data?.decimals || 18
  )
  const lootQuantity = parseWei(
    snapBuySharesState.lootbox.quantity || '0',
    snapBuySharesState.lootbox.data?.shareDecimals || 18
  )

  const withinMaxShares = new BN(lootQuantity)
    .plus(snapBuySharesState.lootbox.data?.sharesSoldCount || '0')
    .lte(snapBuySharesState.lootbox.data?.sharesSoldMax || '0')

  const sharesRemaining = new BN(snapBuySharesState.lootbox.data?.sharesSoldMax || '0')
    .minus(snapBuySharesState.lootbox.data?.sharesSoldCount || '0')
    .div(new BN(10).pow(snapBuySharesState.lootbox.data?.shareDecimals || '0'))
  const sharesRemainingFmt =
    sharesRemaining.toFixed(2).length > 8 ? sharesRemaining.toExponential(2) : sharesRemaining.toFixed(2)
  const isInsufficientFunds = balance.lt(quantity)
  const isWrongChain = metadata?.lootboxCustomSchema?.chain?.chainIdHex !== snapUserState.network.currentNetworkIdHex

  const SuppressedButton = ({ txt }: { txt: string }) => {
    return (
      <$Button
        screen={screen}
        backgroundColor={`${COLORS.surpressedBackground}40`}
        color={`${COLORS.surpressedFontColor}80`}
        style={{ cursor: 'not-allowed', ...BASE_BUTTON_STYLE }}
      >
        {txt}
      </$Button>
    )
  }
  if (!isWalletConnected) {
    return <WalletButton></WalletButton>
  } else if (isWrongChain) {
    return (
      <$Button
        screen={screen}
        color={`${COLORS.dangerFontColor}90`}
        colorHover={COLORS.dangerFontColor}
        backgroundColor={`${COLORS.dangerBackground}80`}
        backgroundColorHover={`${COLORS.dangerBackground}`}
        onClick={switchChain}
        style={{ ...BASE_BUTTON_STYLE }}
      >
        Switch network
      </$Button>
    )
  } else if (isInsufficientFunds) {
    return <SuppressedButton txt={'Insufficient funds'}></SuppressedButton>
  } else if (isInputAmountValid && !withinMaxShares) {
    return <SuppressedButton txt={`Max ${sharesRemainingFmt} shares left`}></SuppressedButton>
  } else if (isInputAmountValid) {
    return (
      <$Button
        screen={screen}
        onClick={purchaseLootboxShare}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{
          ...BASE_BUTTON_STYLE,
          filter: 'drop-shadow(rgba(0, 178, 255, 0.5) 0px 4px 30px)',
          boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
        }}
        disabled={snapBuySharesState.ui.isButtonLoading}
      >
        <LoadingText loading={snapBuySharesState.ui.isButtonLoading} text="BUY LOOTBOX" color={COLORS.trustFontColor} />
      </$Button>
    )
  }
  return (
    <$Button
      screen={screen}
      backgroundColor={`${COLORS.surpressedBackground}40`}
      color={`${COLORS.surpressedFontColor}80`}
      style={{ cursor: 'not-allowed', ...BASE_BUTTON_STYLE }}
    >
      Enter an amount
    </$Button>
  )
}

export default BuyButton
