import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { $Horizontal } from '../Generics'

interface SwitchTicketComponentProps {
  ticketID: number
  maxTickets: number
  onForward: () => void
  onBack: () => void
}

export const SwitchTicketComponent = (props: SwitchTicketComponentProps) => {
  return (
    <$Horizontal style={{ margin: 'auto' }}>
      <$ButtonSection onClick={props.onBack} style={{ borderRadius: '6px 0px 0px 6px' }}>
        {'<'}
      </$ButtonSection>
      <$TicketCounts>
        {props.ticketID} of {props.maxTickets}
      </$TicketCounts>
      <$ButtonSection onClick={props.onForward} style={{ borderRadius: '0px 6px 6px 0px' }}>
        {'>'}
      </$ButtonSection>
    </$Horizontal>
  )
}

const $ButtonSection = styled.button<{ disabled?: boolean }>`
  width: 30px;
  height: 50px;
  background-color: ${COLORS.surpressedBackground}30;
  color: ${COLORS.surpressedFontColor}ae;
  font-size: 20px;
  text-align: center;
  margin: auto;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

const $TicketCounts = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
  height: 50px;
  line-height: 50px;
  background-color: ${COLORS.surpressedBackground}15;
  color: ${COLORS.surpressedFontColor}ae;
  font-size: 20px;
  text-align: center;
  margin: auto;
`
