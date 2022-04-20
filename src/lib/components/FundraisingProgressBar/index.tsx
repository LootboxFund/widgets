import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { COLORS } from 'lib/theme'
import { $Vertical, $Horizontal } from '../Generics'
import HelpIcon from '../../theme/icons/Help.icon'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'
import { getLootboxData, getPriceFeedRaw } from 'lib/hooks/useContract'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from '@wormgraph/helpers'

export interface FundraisingProgressBarProps {
  percentageFunded: number
  networkSymbol: string
  targetAmountNative: string
  wtfMessage: string
  themeColor?: string
}

interface LootboxFundraisingProgressBar {
  lootbox: ContractAddress | undefined
}

export const FundraisingProgressBar = (props: FundraisingProgressBarProps) => {
  const { screen } = useWindowSize()
  return (
    <$ProgressBarWrapper>
      <$Vertical>
        <$Horizontal justifyContent="space-between">
          <$Horizontal verticalCenter>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
                marginRight: '10px',
              }}
            >
              {`${props.percentageFunded > 100 ? 100 : props.percentageFunded}% Funded`}
            </span>
          </$Horizontal>
          <$Horizontal>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
              }}
            >
              {`${props.targetAmountNative} ${props.networkSymbol} Goal`}
            </span>
            <HelpIcon tipID="fundingGoal" />
            <ReactTooltip id="fundingGoal" place="right" effect="solid">
              {props.wtfMessage}
            </ReactTooltip>
          </$Horizontal>
        </$Horizontal>
        {props.percentageFunded !== undefined && (
          <ProgressBar
            themeColor={props.themeColor || COLORS.green}
            progress={props.percentageFunded > 100 ? 100 : props.percentageFunded}
          />
        )}
      </$Vertical>
    </$ProgressBarWrapper>
  )
}

const ProgressBar = ({ progress, themeColor }: { progress: number; themeColor: string }) => {
  return (
    <$Horizontal
      style={{
        width: '100%',
        height: '20px',
        marginTop: '10px',
        backgroundColor: `${themeColor}3A`,
        borderRadius: '10px',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <div style={{ height: '100%', width: `${progress}%`, backgroundColor: themeColor, borderRadius: '10px' }}></div>
    </$Horizontal>
  )
}

const LootboxFundraisingProgressBar = ({ lootbox }: LootboxFundraisingProgressBar) => {
  const web3Utils = useWeb3Utils()
  const [percentageFunded, setPercentageFunded] = useState(0)
  const [targetAmountNative, setTargetAmountNative] = useState('0')
  const [networkSymbol, setNetworkSymbol] = useState('')
  const [wtfMessage, setWTFMessage] = useState('Calculated as...')
  const userStateSnapshot = useSnapshot(userState)

  useEffect(() => {
    const network =
      userStateSnapshot.network.currentNetworkIdHex &&
      Object.values(BLOCKCHAINS).find((b) => b.chainIdHex === userStateSnapshot.network.currentNetworkIdHex)

    if (lootbox && network) {
      setNetworkSymbol(network.nativeCurrency.symbol)

      const loadData = async (symb: string) => {
        const { sharesSoldMax, sharesSoldCount, sharePriceUSD } = await getLootboxData(lootbox)

        const percentageFunded =
          sharesSoldCount && sharesSoldMax
            ? new web3Utils.BN(sharesSoldCount)
                .mul(new web3Utils.BN('100'))
                .div(new web3Utils.BN(sharesSoldMax))
                .toNumber()
            : 0
        setPercentageFunded(percentageFunded)

        const nativeTokenPriceEther = await getPriceFeedRaw(network.priceFeedUSD as ContractAddress)
        const nativeTokenPrice = new web3Utils.BN(nativeTokenPriceEther)

        const maxAmountNativeBN = new web3Utils.BN(sharesSoldMax)
          .mul(new web3Utils.BN(sharePriceUSD))
          .div(nativeTokenPrice)

        const maxAmountNativeFmt = roundOff(parseFloat(web3Utils.fromWei(maxAmountNativeBN, 'ether'))).toString()

        setTargetAmountNative(maxAmountNativeFmt)

        const wtfBro = `${maxAmountNativeFmt} ${symb} goal is calculated as \n${parseFloat(
          web3Utils.fromWei(sharesSoldMax, 'ether')
        ).toFixed(2)} target shares multiplied by a share price of ${web3Utils.fromWei(
          new web3Utils.BN(sharePriceUSD).mul(new web3Utils.BN(10)),
          'nano'
        )} USD at a ${symb} price of ${parseFloat(
          web3Utils.fromWei(nativeTokenPrice.mul(new web3Utils.BN(10)), 'nano')
        ).toFixed(2)} USD.`
        setWTFMessage(wtfBro)
      }
      loadData(network.nativeCurrency.symbol).catch((err) =>
        console.error('Error loading data for lootbox progress bar', err)
      )
    }
  }, [lootbox, userStateSnapshot])

  return (
    <FundraisingProgressBar
      percentageFunded={percentageFunded}
      networkSymbol={networkSymbol}
      targetAmountNative={targetAmountNative}
      wtfMessage={wtfMessage}
    />
  )
}

function roundOff(n: number) {
  return parseFloat(n.toExponential(Math.max(1, 2 + Math.log10(Math.abs(n)))))
}

const $ProgressBarWrapper = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export default LootboxFundraisingProgressBar
