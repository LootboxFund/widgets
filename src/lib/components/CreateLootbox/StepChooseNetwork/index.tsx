import react, { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Generics/Button'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { NetworkOption, NETWORK_OPTIONS } from '../state'
import WalletStatus from 'lib/components/WalletStatus'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { getUserBalanceOfNativeToken } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'
import { Address } from '@lootboxfund/helpers'

export interface StepChooseNetworkProps {
  stage: StepStage
  onSelectNetwork: (network: NetworkOption) => void
  selectedNetwork?: NetworkOption
  onNext: () => void
  setValidity: (bool: boolean) => void
}

const StepChooseNetwork = forwardRef((props: StepChooseNetworkProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const snapUserState = useSnapshot(userState)
  const [errors, setErrors] = useState<string[] | undefined>(undefined)
  const [hasNonZeroTokens, setHasNonZeroToken] = useState<boolean>(false)

  useEffect(() => {
    if (props.selectedNetwork && snapUserState.currentAccount) {
      setErrors([' '])
      getUserBalanceOfNativeToken(snapUserState.currentAccount as Address)
        .then((balance) => {
          if (balance === '0') {
            setHasNonZeroToken(true)
            setErrors([
              `You do not have any ${props?.selectedNetwork?.isTestnet ? 'testnet ' : ''}tokens! ${
                props?.selectedNetwork?.faucetUrl ? 'Click the red button "Get Tokens" above ☝️' : ''
              }`,
            ])
          } else {
            setHasNonZeroToken(false)
            setErrors(undefined)
          }
        })
        .catch((err) => {
          setHasNonZeroToken(false)
          setErrors(undefined)
        })
    }
  }, [props.selectedNetwork, snapUserState.currentAccount])

  const renderNetworkOptions = () => {
    const selectNetwork = (isAvailable: boolean, network: NetworkOption) => {
      if (isAvailable) {
        props.onSelectNetwork(network)
        props.setValidity(true)
      }
    }
    return (
      <$Vertical spacing={2}>
        {NETWORK_OPTIONS.map((network) => (
          <$NetworkOption
            isSelected={props.selectedNetwork?.chainIdHex === network.chainIdHex}
            themeColor={props.selectedNetwork?.themeColor}
            onClick={() => selectNetwork(network.isAvailable, network)}
            key={network.chainIdHex}
            isAvailable={network.isAvailable}
          >
            <$NetworkIcon src={network.icon} />
            {network.isAvailable ? (
              <$Horizontal flex={1} justifyContent="space-between">
                <$NetworkName
                  isAvailable={network.isAvailable}
                  isSelected={props.selectedNetwork?.chainIdHex === network.chainIdHex}
                >
                  {network.name}
                </$NetworkName>
                <$ComingSoon isSelected={props.selectedNetwork?.chainIdHex === network.chainIdHex}>
                  {network.isTestnet && 'Testnet'}
                </$ComingSoon>
              </$Horizontal>
            ) : (
              <$Horizontal flex={1} justifyContent="space-between">
                <$NetworkName>{network.name}</$NetworkName>
                <$ComingSoon>Coming Soon</$ComingSoon>
              </$Horizontal>
            )}
          </$NetworkOption>
        ))}
      </$Vertical>
    )
  }
  return (
    <$StepChooseNetwork>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.selectedNetwork ? props.stage : 'in_progress'}
        onNext={props.onNext}
        errors={errors}
      >
        <$Wrapper screen={screen}>
          <$Vertical flex={2}>
            <$StepHeading>
              1. Choose your Network
              <HelpIcon tipID="stepNetwork" />
              <ReactTooltip id="stepNetwork" place="right" effect="solid">
                The network you choose should be the same blockchain as the game you intend to play. You may bridge
                money across chains after funding, if needed.
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              Your Investors will send you money in the native token. Profits can be shared as any ERC20 token on that
              blockchain.
            </$StepSubheading>
            <br />
            {renderNetworkOptions()}
          </$Vertical>
          <$Vertical flex={1}>
            <div
              style={
                screen === 'mobile'
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      paddingBottom: '20px',
                      flex: 1,
                      width: '100%',
                    }
                  : {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-end',
                    }
              }
            >
              <WalletStatus />
              <img
                style={{ width: '100%', maxWidth: '250px', marginTop: '50px', marginBottom: '30px' }}
                src={
                  'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2FChest.png?alt=media'
                }
              />
              {hasNonZeroTokens && props?.selectedNetwork?.faucetUrl && (
                <$Button
                  screen="mobile"
                  backgroundColorHover={`${COLORS.dangerBackground}75`}
                  backgroundColor={`${COLORS.dangerBackground}`}
                  color={`${COLORS.dangerFontColor}aa`}
                  style={{
                    minHeight: '50px',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    alignSelf: 'center',
                    padding: '0px 20px',
                    width: '100%',
                  }}
                  onClick={() => {
                    if (props?.selectedNetwork?.faucetUrl) {
                      window.open(props.selectedNetwork.faucetUrl, '_blank')
                    }
                  }}
                >
                  Get Tokens
                </$Button>
              )}
            </div>
          </$Vertical>
        </$Wrapper>
      </StepCard>
    </$StepChooseNetwork>
  )
})

const $StepChooseNetwork = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

export const $NetworkIcon = styled.img<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${(props) => (props.size === 'large' ? '60px' : props.size === 'medium' ? '40px' : '30px')};
  height: ${(props) => (props.size === 'large' ? '60px' : props.size === 'medium' ? '40px' : '30px')};
`

export const $Wrapper = styled.div<{ screen: ScreenSize }>`
  flex: 1;
  display: flex;
  flex-direction: ${(props) => (props.screen === 'mobile' ? 'column-reverse' : 'row')};
  justify-content: space-between;
`

const $NetworkOption = styled.button<{ isAvailable?: boolean; themeColor?: string; isSelected?: boolean }>`
  width: 300px;
  padding: 8px 10px;
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: 0.5px solid #cdcdcd;
  ${(props) => props.isAvailable && 'cursor: pointer'};
  ${(props) =>
    props.themeColor && props.isSelected
      ? `background-color: ${props.themeColor}`
      : props.isAvailable && 'background-color: white'};
  ${(props) => !props.isSelected && props.isAvailable && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`

const $NetworkName = styled.span<{ isAvailable?: boolean; isSelected?: boolean }>`
  font-size: ${TYPOGRAPHY.fontSize.large};
  ${(props) => props.isAvailable && 'text-transform: uppercase'};
  ${(props) =>
    props.isAvailable ? `font-weight: ${TYPOGRAPHY.fontWeight.bold}` : `font-weight: ${TYPOGRAPHY.fontWeight.light}`};
  margin-left: 20px;
  ${(props) => props.isSelected && 'color: white'};
`

const $ComingSoon = styled.span<{ isSelected?: boolean }>`
  font-size: ${TYPOGRAPHY.fontSize.xsmall};
  color: ${(props) => (props.isSelected ? COLORS.white : COLORS.surpressedFontColor)};
  text-transform: uppercase;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  line-height: 0.6rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export default StepChooseNetwork
