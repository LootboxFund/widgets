import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { COLORS } from 'lib/theme'
import { $Vertical, $Horizontal } from '../Generics'
import HelpIcon from '../../theme/icons/Help.icon'
import styled from 'styled-components'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from '@wormgraph/helpers'
import { buySharesState } from '../BuyShares/state'
import { lootboxState, OnChainLootbox } from 'lib/state/lootbox.state'
import { FormattedMessage, useIntl } from 'react-intl'

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
              {/* {`${props.percentageFunded > 100 ? 100 : props.percentageFunded}% Funded`} */}
              {/* {`${props.percentageFunded}% Funded`} */}
              <FormattedMessage
                id="fundraisingProgressBar.percentageFunded"
                defaultMessage="{percentageFunded}% Funded"
                description="Percentage of the lootbox that has been funded (funded means when people invest into someones Lootbox with cryptocurrency)"
                values={{
                  percentageFunded: props.percentageFunded,
                }}
              />
            </span>
          </$Horizontal>
          <$Horizontal>
            <span
              style={{
                fontSize: TYPOGRAPHY.fontSize.xlarge,
                color: COLORS.surpressedFontColor,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
                textAlign: screen === 'mobile' ? 'end' : 'start',
              }}
            >
              <FormattedMessage
                id="fundraisingProgressBar.goalText"
                defaultMessage="{targetAmount} {symbol} Goal"
                description="The amount of crypto currency the gamer wishes to fundraise (i.e. '10 ETH Goal'"
                values={{
                  targetAmount: props.targetAmountNative,
                  symbol: props.networkSymbol,
                }}
              />
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
        position: 'relative',
      }}
    >
      <div style={{ height: '100%', width: `${progress}%`, backgroundColor: themeColor, borderRadius: '10px' }}></div>
    </$Horizontal>
  )
}

const LootboxFundraisingProgressBar = ({ lootbox }: LootboxFundraisingProgressBar) => {
  const intl = useIntl()
  const web3Utils = useWeb3Utils()
  const [percentageFunded, setPercentageFunded] = useState(0)
  const [targetAmountNative, setTargetAmountNative] = useState('0')
  const [networkSymbol, setNetworkSymbol] = useState('')
  const targetFundingGoalTemplateMessage = intl.formatMessage({
    id: 'fundraisingBar.help.template',
    defaultMessage: 'This is the target funding goal of the gamer.',
    description: 'Template message for user displayed with the Lootbox fundraising goals',
  })
  const [wtfMessage, setWTFMessage] = useState(targetFundingGoalTemplateMessage)
  const userStateSnapshot = useSnapshot(userState)
  const buySharesStateSnapshot = useSnapshot(buySharesState)
  const lootboxStateSnapshot = useSnapshot(lootboxState)

  useEffect(() => {
    const network =
      userStateSnapshot.network.currentNetworkIdHex &&
      Object.values(BLOCKCHAINS).find((b) => b.chainIdHex === userStateSnapshot.network.currentNetworkIdHex)

    if (lootbox && network) {
      setNetworkSymbol(network.nativeCurrency.symbol)

      const loadData = async (symb: string) => {
        if (lootboxStateSnapshot[lootbox as ContractAddress]?.onChain) {
          const { sharesSoldMax, sharesSoldTarget, sharesSoldCount, sharePriceWei } = lootboxStateSnapshot[
            lootbox as ContractAddress
          ].onChain as OnChainLootbox
          const percentageFunded =
            sharesSoldCount && sharesSoldTarget
              ? new web3Utils.BN(sharesSoldCount)
                  .mul(new web3Utils.BN('1000')) // multiply by 1000 (instead of 100) to get 1 decimal place
                  .div(new web3Utils.BN(sharesSoldTarget))
                  .toNumber() / 10 // divide by 10 to account for the 1000 multiplier and yield decimal
              : 0
          setPercentageFunded(percentageFunded)

          const targetAmountNativeBN = new web3Utils.BN(sharesSoldTarget)
            .mul(new web3Utils.BN(sharePriceWei))
            .div(new web3Utils.BN('10').pow(new web3Utils.BN(18)))

          const maxAmountNativeBN = new web3Utils.BN(sharesSoldMax)
            .mul(new web3Utils.BN(sharePriceWei))
            .div(new web3Utils.BN('10').pow(new web3Utils.BN(18)))

          const targetAmountNativeFmt = roundOff(
            parseFloat(web3Utils.fromWei(targetAmountNativeBN, 'ether'))
          ).toString()
          const maxAmountNativeFmt = roundOff(parseFloat(web3Utils.fromWei(maxAmountNativeBN, 'ether'))).toString()

          setTargetAmountNative(targetAmountNativeFmt)

          const wtfBro = intl.formatMessage(
            {
              id: 'lootbox.wtf.bro',
              defaultMessage:
                '{targetAmountNumber} {symbol} is the target funding goal of this lootbox. The maximum capacity of this lootbox is {maxAmount} {symbol}. So far, this lootbox has raised {percentageFunded}% of its funding goal.',
              description: "Help message for the lootbox's funding goal. ",
            },
            {
              targetAmountNumber: targetAmountNativeFmt,
              symbol: symb,
              maxAmount: maxAmountNativeFmt,
              percentageFunded: percentageFunded,
            }
          )

          // const wtfBro = `${maxAmountNativeFmt} ${symb} goal is calculated as \n${parseFloat(
          //   web3Utils.fromWei(sharesSoldTarget, 'ether')
          // ).toFixed(2)} target shares multiplied by a share price of ${web3Utils.fromWei(
          //   new web3Utils.BN(sharePriceWei),
          //   'wei'
          // )} ${symb}.`
          // const wtfBro = 'This is the max amount of funds that this gamer is looking to fundraise.'
          setWTFMessage(wtfBro)
        }
      }
      loadData(network.nativeCurrency.symbol).catch((err) =>
        console.error('Error loading data for lootbox progress bar', err)
      )
    }
  }, [lootboxStateSnapshot[lootbox as ContractAddress], userStateSnapshot, buySharesStateSnapshot.lastTransaction])

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
