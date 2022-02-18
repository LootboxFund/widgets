import react, { useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon, NetworkOption } from '../StepChooseNetwork';
import { TicketCardCandyWrapper } from 'lib/components/TicketCard/TicketCard';

export interface StepCustomizeProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  onNext: () => void;
  ticketState: Record<string, string | number>;
  updateTicketState: (slug: string, value: string | number) => void;
}
const StepCustomize = (props: StepCustomizeProps) => {
  const { screen } = useWindowSize()
	return (
		<$StepCustomize>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}>
        <$Horizontal flex={1}>
          <$Vertical flex={1}>
            <$StepHeading>4. Customize Ticket</$StepHeading>
            <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
            <br /><br />
            <$StepSubheading>Lootbox Name</$StepSubheading>
            <$InputMedium maxLength={25} onChange={(e) => props.updateTicketState('name', e.target.value)} value={props.ticketState.name} /><br />
            <$StepSubheading>Ticket Symbol</$StepSubheading>
            <$InputMedium onChange={(e) => props.updateTicketState('symbol', e.target.value)} value={props.ticketState.symbol} /><br />
            <$StepSubheading>Biography</$StepSubheading>
            <$TextAreaMedium onChange={(e) => props.updateTicketState('biography', e.target.value)} value={props.ticketState.biography} rows={5} /><br />
            <$StepSubheading>Price per Share</$StepSubheading>
            <$Horizontal verticalCenter>
              <$CurrencySign>$</$CurrencySign>
              <$InputMedium type="number" onChange={(e) => props.updateTicketState('pricePerShare', e.target.valueAsNumber)} value={props.ticketState.pricePerShare} />
            </$Horizontal>
            <br />
          </$Vertical>
          <$Vertical flex={1}>
            <TicketCardCandyWrapper
              backgroundImage={props.ticketState.coverUrl as string}
              logoImage={props.ticketState.logoUrl as string}
              themeColor={props.ticketState.lootboxThemeColor as string}
              name={props.ticketState.name as string}
            />
            <br />
            <$Horizontal verticalCenter>
              <$InputColor value={props.ticketState.lootboxThemeColor} /><br />
              <$UploadFileButton>Upload Logo</$UploadFileButton>
              <$UploadFileButton>Upload Cover</$UploadFileButton>
            </$Horizontal>
          </$Vertical>
        </$Horizontal>
      </StepCard>
		</$StepCustomize>
	)
}

const $StepCustomize = styled.section<{}>`
  font-family: sans-serif;
`

const $CurrencySign = styled.span`
  font-size: 1.8rem;
  color: ${COLORS.surpressedBackground};
  line-height: 2rem;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 1.5rem;
  margin-right: 20px;
  height: 40px;
`
export const $TextAreaMedium = styled.textarea`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 20px 20px;
  font-size: 1rem;
  margin-right: 20px;
`

export const $InputColor = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px;
  font-size: 1rem;
  margin-right: 5px;
  height: 40px;
  flex: 1;
  text-align: center;
`

export const $UploadFileButton = styled.button`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px;
  font-size: 1rem;
  height: 40px;
  flex: 1;
  margin: 5px;
`

export default StepCustomize;