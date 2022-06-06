import { Address, ContractAddress, ILootboxMetadata } from '@wormgraph/helpers'
import { NetworkOption } from 'lib/api/network'
import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $StepSubheading } from '../CreateLootbox/StepCard'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { $ErrorMessageMgmtPage, $ManageLootboxHeading, ManagementButtonState } from '../ManageLootbox'
import $SmallerButton from '../Generics/SmallerButton/SmallerButton'
import { $NetworkIcon } from '../CreateLootbox/StepChooseNetwork'
import { COLORS } from '../../theme/index'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import NetworkText from '../NetworkText'
import {
  $InputTranslationHeavy,
  $InputTranslationLight,
  $InputWrapper,
  validateReceivingWallet,
} from '../CreateLootbox/StepChooseFunding'
import $Input, { InputDecimal } from '../Generics/Input'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import BigNumber from 'bignumber.js'
import { bulkMintNFTsContractCall, getPriceFeed, LootboxType } from 'lib/hooks/useContract'

export interface BulkMintProps {
  lootboxAddress: ContractAddress
  network: NetworkOption
  lootboxMetadata: ILootboxMetadata
  lootboxType: LootboxType
}
const BulkMint = (props: BulkMintProps) => {
  const { screen } = useWindowSize()
  const web3Utils = useWeb3Utils()
  const [nativeTokenPrice, setNativeTokenPrice] = useState(web3Utils.toBN(0))
  const [receiverAddr, setReceiverAddr] = useState('')
  const [nativeRewardAmount, setNativeRewardAmount] = useState(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
  const [nativeRewardUSD, setNativeRewardUSD] = useState(0)
  const [numToMint, setNumToMint] = useState(0)
  const [bulkMintSubmissionStatus, setBulkMintSubmissionStatus] = useState<ManagementButtonState>('enabled')
  const [numToMintErr, setNumToMintErr] = useState('')
  const [receiverAddrErr, setReceiverAddrErr] = useState('')
  const [nativeRewardAmountErr, setNativeRewardAmountErr] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [transactionHash, setTransactionHash] = useState('')

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    const nativeTokenPriceEther = await getPriceFeed(props.network.priceFeed as ContractAddress)
    const nativeTokenPrice = nativeTokenPriceEther.multipliedBy(new BigNumber('10').pow('8'))
    setNativeTokenPrice(nativeTokenPrice)

    const usdEq = new web3Utils.BN(
      web3Utils.toWei(
        nativeTokenPrice
          .multipliedBy(nativeRewardAmount)
          .dividedBy(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
          .toString(),
        'gwei'
      )
    ).div(new web3Utils.BN('100000000000000000'))
    setNativeRewardUSD(usdEq)
  }

  const allConditionsMet = () => {
    return (
      nativeRewardAmount.toString() !== '0' && validateReceivingWallet(receiverAddr) && numToMint.toString() !== '0'
    )
  }

  const calculateInputWidth = (amount: BigNumber) => {
    const projectedWidth = web3Utils.fromWei(amount || '0').toString().length * 20
    const width = projectedWidth > 300 ? 300 : projectedWidth
    return `${amount ? width : 300}px`
  }

  const generateValidationErrorMessages = () => {
    if (!validateReceivingWallet(receiverAddrErr)) {
      setReceiverAddrErr('Receiving Address is not valid')
      return
    }
    if (nativeRewardAmount.toString() === '0') {
      setNativeRewardAmountErr('Enter an amount of native token to deposit')
      return
    }
    if (numToMint.toString() === '0') {
      setNumToMintErr('Enter a number of NFTs to mint')
      return
    }
    return
  }

  const bulkMintNFTs = async () => {
    generateValidationErrorMessages()
    if (!allConditionsMet()) {
      return
    }
    setBulkMintSubmissionStatus('pending')
    setSubmitError('')
    try {
      const feeAdjustedNativeRewardAmount = nativeRewardAmount.mul(web3Utils.toBN('1000')).div(web3Utils.toBN('968'))

      const txHash = await bulkMintNFTsContractCall(
        props.lootboxAddress,
        props.lootboxType,
        receiverAddr as Address,
        feeAdjustedNativeRewardAmount,
        numToMint
      )
      setTransactionHash(txHash)
      setBulkMintSubmissionStatus('success')
      setSubmitError('')
      setTimeout(() => {
        setBulkMintSubmissionStatus('enabled')
      }, 10000)
    } catch (e) {
      console.log(e)
      setBulkMintSubmissionStatus('error')
      setSubmitError(e.data.message)
      setTimeout(() => {
        setBulkMintSubmissionStatus('enabled')
      }, 2000)
    }
  }

  if (!props.lootboxMetadata) {
    return null
  }
  return (
    <$BulkMint>
      <$StepCard screen={screen} themeColor={props.network.themeColor}>
        <$Horizontal>
          <$Vertical flex={2}>
            <$Horizontal verticalCenter>
              <$ManageLootboxHeading screen={screen}>Bulk Mint NFTs</$ManageLootboxHeading>
              <HelpIcon tipID="rewardSponsors" />
              <ReactTooltip id="rewardSponsors" place="right" effect="solid">
                If you would like access to this Bulk Mint feature, email us at support@lootbox.fund
              </ReactTooltip>
            </$Horizontal>
            <br />
            <$StepSubheading>
              Supercharge your fanbase by gifting them your Lootbox NFTs. This is a great way to incentivize engagement
              from your community by rewarding them a share of your gamer earnings. Only available for Lootbox Exclusive
              Partners.
            </$StepSubheading>
          </$Vertical>
          {screen === 'desktop' && (
            <$Horizontal flex={1} justifyContent="flex-end">
              <NetworkText />
            </$Horizontal>
          )}
        </$Horizontal>
        <br />
        <br />
        <$Vertical>
          <$StepSubheading>
            Receiver Address
            <HelpIcon tipID="lootboxAddressReward" />
            <ReactTooltip id="lootboxAddressReward" place="right" effect="solid">
              {`This is where all the NFTs will be sent to. You can set it to a Metamask wallet and manually send NFTs to
              fans. Or set it to a smart contract that will allow fans to redeem their gifted NFT themselves (saving you
              time & gas fees).`}
            </ReactTooltip>
            <span
              onClick={() => navigator.clipboard.writeText(receiverAddr)}
              style={{ fontStyle: 'italic', cursor: 'copy', fontSize: '0.8rem', marginLeft: '5px' }}
            >
              Copy
            </span>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <$Input
                type="text"
                value={receiverAddr}
                onChange={(e) => setReceiverAddr(e.target.value)}
                min="0"
                placeholder="Send all NFTs to this address..."
                screen={screen}
                style={{ fontWeight: 'lighter' }}
              />
            </div>
          </$InputWrapper>
        </$Vertical>
        <br />
        <$Vertical>
          <$StepSubheading>
            Total Spend
            <HelpIcon tipID="withNativeToken" />
            <ReactTooltip id="withNativeToken" place="right" effect="solid">
              The total amount of native tokens you want to spend on bulk minting these NFTs. Each NFT will end up
              receiving an equal portion of the total amount spent. For example, if you spend 1 BNB and set the quantity
              to 5, then you'll mint 5 NFTs with 0.2 BNB spent on each. The last NFT may receive unnoticeably more or
              less due to tiny rounding.
            </ReactTooltip>
          </$StepSubheading>
          <$InputWrapper screen={screen}>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <div
                style={{
                  flex: 9,
                  width: 'auto',
                  maxWidth: '200px',
                  paddingLeft: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                {props.network && <$NetworkIcon size="medium" src={props.network.icon} />}
                <InputDecimal
                  onChange={(e: string) => {
                    const nativeAmt = web3Utils.toBN(web3Utils.toWei(e || '0'))
                    setNativeRewardAmount(nativeAmt)
                    const usdEq = new web3Utils.BN(
                      web3Utils.toWei(
                        nativeTokenPrice
                          .multipliedBy(nativeAmt)
                          .dividedBy(web3Utils.toBN(web3Utils.toWei('1', 'ether')))
                          .toString(),
                        'gwei'
                      )
                    ).div(new web3Utils.BN('100000000000000000'))
                    setNativeRewardUSD(usdEq)
                  }}
                  width={calculateInputWidth(nativeRewardAmount)}
                />
                <$InputTranslationLight>{props.network?.symbol}</$InputTranslationLight>
              </div>
              <div style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
                <$InputTranslationHeavy>{`$${nativeRewardUSD} USD`}</$InputTranslationHeavy>
              </div>
            </div>
          </$InputWrapper>
        </$Vertical>
        <br />
        <$Vertical>
          <$StepSubheading>
            Total NFTs to Mint
            <HelpIcon tipID="totalToMint" />
            <ReactTooltip id="totalToMint" place="right" effect="solid">
              The total number of NFTs to mint. Each NFT will end up receiving an equal portion of the total amount
              spent. For example, if you spend 1 BNB and set the quantity to 5, then you'll mint 5 NFTs with 0.2 BNB
              spent on each.
            </ReactTooltip>
          </$StepSubheading>
          <$InputWrapper screen={screen} style={{ maxWidth: '600px' }}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <$Input
                type="text"
                value={numToMint}
                onChange={(e) => {
                  setNumToMint(parseInt(e.target.value) || 0)
                  if (parseInt(e.target.value) > 100) {
                    setNumToMintErr('Be careful not to mint too many NFTs, as the profit share amount will get smaller')
                  } else {
                    setNumToMintErr('')
                  }
                }}
                min={0}
                screen={screen}
                style={{ fontWeight: 'lighter' }}
              />
            </div>
          </$InputWrapper>
          {numToMintErr && (
            <div style={{ width: '100%', textAlign: 'left', padding: '10px' }}>
              <$ErrorMessageMgmtPage status={'success'}>{numToMintErr}</$ErrorMessageMgmtPage>
            </div>
          )}
        </$Vertical>
        <br />
        <br />
        <$RewardSponsorsButton
          disabled={
            !allConditionsMet() || bulkMintSubmissionStatus === 'pending' || bulkMintSubmissionStatus === 'success'
          }
          allConditionsMet={allConditionsMet()}
          onClick={() => bulkMintNFTs()}
          themeColor={
            bulkMintSubmissionStatus === 'success'
              ? COLORS.successFontColor
              : bulkMintSubmissionStatus === 'pending'
              ? `${props.network.themeColor}3A`
              : props.network.themeColor
          }
        >
          {bulkMintSubmissionStatus === 'pending'
            ? 'SUBMITTING...'
            : bulkMintSubmissionStatus === 'success'
            ? 'BULK MINT SUCCESS'
            : `BULK MINT NFTs`}
        </$RewardSponsorsButton>
        {submitError && (
          <div style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
            <$ErrorMessageMgmtPage status={'error'}>{submitError}</$ErrorMessageMgmtPage>
          </div>
        )}
        {transactionHash && (
          <div style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
            <$ErrorMessageMgmtPage
              status={'success'}
              onClick={() => window.open(`${props.network.blockExplorerUrl}tx/${transactionHash}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              View Transaction Reciept
            </$ErrorMessageMgmtPage>
          </div>
        )}
      </$StepCard>
    </$BulkMint>
  )
}

const $BulkMint = styled.div<{}>``

const $StepCard = styled.div<{
  themeColor: string
  boxShadow?: string
  screen: ScreenSize
}>`
  height: auto;
  width: auto;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => `0px 3px 20px ${props.themeColor}`};
  border: ${(props) => `3px solid ${props.themeColor}`};
  border-radius: 20px;
  padding: ${(props) => (props.screen === 'desktop' ? '40px' : '20px')};
  max-width: 800px;
  font-family: sans-serif;
`

const $SubtitleDepositTitle = styled.span`
  font-size: 0.9rem;
  font-weight: lighter;
  font-style: italic;
  color: ${COLORS.surpressedFontColor};
  margin: 10px 0px 10px 0px;
`

const $RewardSponsorsButton = styled.button<{ themeColor?: string; allConditionsMet: boolean }>`
  background-color: ${(props) => (props.allConditionsMet ? props.themeColor : `${props.themeColor}30`)};
  min-height: 50px;
  border-radius: 10px;
  flex: 1;
  text-transform: uppercase;
  cursor: ${(props) => (props.allConditionsMet ? 'pointer' : 'not-allowed')};
  color: ${(props) => (props.allConditionsMet ? COLORS.white : `${props.themeColor}40`)};
  font-weight: 600;
  font-size: 1.5rem;
  border: 0px;
  padding: 20px;
`

export default BulkMint
