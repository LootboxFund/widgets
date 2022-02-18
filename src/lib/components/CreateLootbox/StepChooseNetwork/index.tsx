import react from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';

export interface NetworkOption {
  name: string;
  icon: string;
  symbol: string;
  themeColor: string;
  chainIdHex: ChainIDHex,
  chainIdDecimal: ChainIDDecimal,
  isAvailable: boolean;
}
const NETWORK_OPTIONS: NetworkOption[] = [
  { name: 'Binance', symbol: 'BNB', themeColor: '#F0B90B', chainIdHex: 'a', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media' },
  { name: 'Polygon', symbol: 'MATIC', themeColor: '#8F5AE8', chainIdHex: 'b', chainIdDecimal: '', isAvailable: true, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FMATIC.png?alt=media' },
  { name: 'Ethereum', symbol: 'ETH', themeColor: '#627EEA', chainIdHex: 'c', chainIdDecimal: '', isAvailable: false, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FETH.png?alt=media' },
  { name: 'Solana', symbol: 'SOL', themeColor: '#0BC695', chainIdHex: 'd', chainIdDecimal: '', isAvailable: false, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FSOL.png?alt=media' },
  { name: 'Fantom', symbol: 'FTM', themeColor: '#13B5EC', chainIdHex: 'e', chainIdDecimal: '', isAvailable: false, icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FFANTOM.png?alt=media' },
]

export interface StepChooseNetworkProps {
  stage: StepStage;
  onSelectNetwork: (network: NetworkOption) => void;
  selectedNetwork?: NetworkOption;
  onNext: () => void;
}
const StepChooseNetwork = (props: StepChooseNetworkProps) => {
  const renderNetworkOptions = () => {
    
    return (
      <$Vertical spacing={2}>
        {
          NETWORK_OPTIONS.map(network => (
            <$NetworkOption isSelected={props.selectedNetwork?.chainIdHex === network.chainIdHex} themeColor={props.selectedNetwork?.themeColor} onClick={() => network.isAvailable && props.onSelectNetwork(network)} key={network.chainIdHex} isAvailable={network.isAvailable}>
              <$NetworkIcon src={network.icon} />
              {
                network.isAvailable ?
                  <$NetworkName isAvailable={network.isAvailable} isSelected={props.selectedNetwork?.chainIdHex === network.chainIdHex}>{network.name}</$NetworkName> :
                  <$Horizontal flex={1} justifyContent='space-between'>
                    <$NetworkName>{network.name}</$NetworkName>
                    <$ComingSoon>Coming Soon</$ComingSoon>
                  </$Horizontal>
                  
              }
            </$NetworkOption>
          ))
        }
      </$Vertical>
    )
  }
	return (
		<$StepChooseNetwork>
      <StepCard primaryColor={props.selectedNetwork?.themeColor} stage={props.selectedNetwork ? props.stage : "not_yet"} onNext={props.onNext}>
        <$Horizontal flex={1}>
          <$Vertical flex={2}>
            <$StepHeading>1. Choose your Network</$StepHeading>
            <$StepSubheading>Your Investors will buy tickets in the native token. Payouts can be made in any ERC20 token on that blockchain.</$StepSubheading>
            <br/>
            {renderNetworkOptions()}
          </$Vertical>
          <$Vertical flex={1}>
            <NetworkText />
            <img style={{ width: '250px', marginTop: '50px' }} src={"https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2FChest.png?alt=media"} />
          </$Vertical>
        </$Horizontal>
      </StepCard>
		</$StepChooseNetwork>
	)
}

const $StepChooseNetwork = styled.section<{}>`
  font-family: sans-serif;
`

export const $NetworkIcon = styled.img<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${props => props.size === 'large' ? '60px' : props.size === 'medium' ? '40px' : '30px'};
  height: ${props => props.size === 'large' ? '60px' : props.size === 'medium' ? '40px' : '30px'};
`

const $NetworkOption = styled.button<{ isAvailable?: boolean, themeColor?: string, isSelected?: boolean; }>`
  width: 300px;
  padding: 8px 10px;
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: 0.5px solid #CDCDCD;
  ${props => props.isAvailable && 'cursor: pointer'};
  ${props => props.themeColor && props.isSelected ? `background-color: ${props.themeColor}` : props.isAvailable && 'background-color: white'};
  ${props => !props.isSelected && props.isAvailable && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`

const $NetworkName = styled.span<{ isAvailable?: boolean, isSelected?: boolean; }>`
  font-size: ${TYPOGRAPHY.fontSize.large};
  ${props => props.isAvailable && 'text-transform: uppercase'};
  ${props => props.isAvailable ? `font-weight: ${TYPOGRAPHY.fontWeight.bold}` : `font-weight: ${TYPOGRAPHY.fontWeight.light}`};
  margin-left: 20px;
  ${props => props.isSelected && 'color: white'};
`

const $ComingSoon = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.xsmall};
  color: ${COLORS.surpressedFontColor};
  text-transform: uppercase;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  line-height: 0.6rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export default StepChooseNetwork;