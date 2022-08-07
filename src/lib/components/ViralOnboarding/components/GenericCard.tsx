import { COLORS } from '@wormgraph/helpers'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { background1, $Heading, $SubHeading } from '../contants'

const GenericCard = ({ children }: PropsWithChildren<{}>) => {
  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        {children || <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />}
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export const LoadingCard = () => {
  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <Spinner color={`${COLORS.white}`} size="50px" margin="10vh auto" />
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

interface ErrorCardProps {
  title?: string
  message?: string
  icon?: string
}
export const ErrorCard = ({ title, icon = '🤕', children, message }: PropsWithChildren<ErrorCardProps>) => {
  const words = useWords()
  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical justifyContent="center" style={{ marginTop: '8vh' }}>
          <$Icon>{icon}</$Icon>
          <$Heading>{title || words.anErrorOccured}</$Heading>
          {message ? <$SubHeading style={{ marginTop: '0px' }}>{message}</$SubHeading> : null}
          {children}
        </$Vertical>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

export default GenericCard
