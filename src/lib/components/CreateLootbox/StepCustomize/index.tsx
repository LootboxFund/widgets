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
  ticketState: Record<string, string>;
  updateTicketState: (slug: string, text: string) => void;
}
const StepCustomize = (props: StepCustomizeProps) => {
  const { screen } = useWindowSize()
	return (
		<$StepCustomize>
      <StepCard primaryColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}>
        <$Horizontal flex={1}>
          <$Vertical flex={1}>
            <$StepHeading>4. Customize Ticket</$StepHeading>
            <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
            <br /><br />
            <$StepSubheading>Lootbox Name</$StepSubheading>
            <$InputMedium /><br />
            <$StepSubheading>Ticket Symbol</$StepSubheading>
            <$InputMedium /><br />
            <$StepSubheading>Biography</$StepSubheading>
            <$TextAreaMedium rows={5} /><br />
            <$StepSubheading>Price per Share</$StepSubheading>
            <$InputMedium /><br />
          </$Vertical>
          <$Vertical flex={1}>
            <TicketCardCandyWrapper
              backgroundImage="https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-background.png?alt=media"
              logoImage="https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Fdefault-ticket-logo.png?alt=media"
              themeColor="#B48AF7"
              name="Artemis Guild"
            />
            <br />
            <$Horizontal>
              <$InputColor value="#B48AF7" /><br />
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
const $SocialGridInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto; 
  column-gap: 10px;
  row-gap: 15px;
`

const $SocialLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: 1rem;
  margin-right: 20px;
  height: 40px;
`
export const $TextAreaMedium = styled.textarea`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
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