import react, { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Generics/Button'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { NetworkOption, NETWORK_OPTIONS } from 'lib/api/network'
import WalletStatus from 'lib/components/WalletStatus'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { getUserBalanceOfNativeToken } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'
import { Address } from '@wormgraph/helpers'
import { getProvider } from 'lib/hooks/useWeb3Api'
import LogRocket from 'logrocket'
import { FormattedMessage } from 'react-intl'
import useWords from 'lib/hooks/useWords'

export interface StepChooseNetworkProps {
  stage: StepStage
  onSelectNetwork: (network: NetworkOption) => void
  selectedNetwork?: NetworkOption
  onNext: () => void
  setValidity: (bool: boolean) => void
  setDoesNetworkMatch: (bool: boolean) => void
}

const StepChooseNetwork = forwardRef((props: StepChooseNetworkProps, ref: React.RefObject<HTMLDivElement>) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const isMobile = screen === 'tablet' || screen === 'mobile'
  const snapUserState = useSnapshot(userState)
  const [errors, setErrors] = useState<(string | React.ReactElement)[] | undefined>(undefined)
  const [hasNonZeroTokens, setHasNonZeroToken] = useState<boolean>(false)

  useEffect(() => {
    if (props.selectedNetwork && !snapUserState.currentAccount) {
      setErrors([
        <FormattedMessage
          id="createLootbox.stepChooseNetwork.noAccount"
          key="noAccount"
          defaultMessage='Please connect your wallet by clicking the red button "Connect" above ☝️'
          description="Error message when no account is selected"
        />,
      ])
    } else if (props.selectedNetwork && snapUserState.currentAccount) {
      getProvider()
        .then((data) => {
          console.log('fetching network from provider', data)
          return data.provider.detectNetwork()
        })
        .then((network) => {
          if (network?.chainId?.toString() !== props.selectedNetwork?.chainIdDecimal) {
            props.setDoesNetworkMatch(false)
            setErrors([
              `${words.wrongNetworkPleaseChangeTo} "${props.selectedNetwork?.name}${
                props.selectedNetwork?.isTestnet ? ` (${words.testnet})` : ''
              }"`,
            ])
          } else {
            props.setDoesNetworkMatch(true)
            getUserBalanceOfNativeToken(snapUserState.currentAccount as Address)
              .then((balance) => {
                if (balance === '0') {
                  setHasNonZeroToken(true)
                  setErrors([
                    <FormattedMessage
                      id="createLootbox.stepChooseNetwork.error.noTokens"
                      defaultMessage="You do not have any {networkType}tokens!"
                      description="Error message when the user has no tokens"
                      values={{ networkType: props.selectedNetwork?.isTestnet ? `${words.testnet} ` : '' }}
                    />,
                  ])
                } else {
                  setErrors(undefined)
                  setHasNonZeroToken(false)
                }
              })
              .catch((err) => {
                setHasNonZeroToken(false)
              })
          }
        })
        .catch((err) => {
          LogRocket.captureException(err)
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
                  {network.isTestnet && words.testnet}
                </$ComingSoon>
              </$Horizontal>
            ) : (
              <$Horizontal flex={1} justifyContent="space-between">
                <$NetworkName>{network.name}</$NetworkName>
                <$ComingSoon>
                  <FormattedMessage
                    id="create.lootbox.step.network.heading.comming-soon"
                    defaultMessage="Coming Soon"
                    description="Text shown to user when a new network is not yet available with our systems yet"
                  />
                </$ComingSoon>
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
              <FormattedMessage
                id="create.lootbox.step.network.heading"
                defaultMessage="1. Choose your Network"
                description="Header for the step to choose the network when creating a Lootbox"
              />
              <HelpIcon tipID="stepNetwork" />
              <ReactTooltip id="stepNetwork" place="right" effect="solid">
                <FormattedMessage
                  id="create.lootbox.step.network.heading.help"
                  defaultMessage="The network you choose should be the same blockchain as the game you intend to play. You may bridge money across chains after funding, if needed."
                  description="Help message for users when creating a Lootbox"
                />
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>
              <FormattedMessage
                id="create.lootbox.step.network.subheading"
                defaultMessage="Your Investors will send you money in the native token. Profits can be shared as any ERC20 token on that
                blockchain."
                description="Subheader for the step to choose the network when creating a Lootbox"
              />
            </$StepSubheading>
            <br />
            {renderNetworkOptions()}
          </$Vertical>
          <$Vertical flex={1}>
            <div
              style={
                isMobile
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
              {/* {hasNonZeroTokens && props?.selectedNetwork?.faucetUrl && (
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
              )} */}
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
  flex-direction: ${(props) => (props.screen === 'mobile' || props.screen === 'tablet' ? 'column-reverse' : 'row')};
  justify-content: space-between;
`

const $NetworkOption = styled.button<{ isAvailable?: boolean; themeColor?: string; isSelected?: boolean }>`
  width: 100%;
  max-width: 300px;
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
