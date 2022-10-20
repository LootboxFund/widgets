import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWords from 'lib/hooks/useWords'
import { manifest } from 'manifest'
import { PropsWithChildren, useState } from 'react'
import styled from 'styled-components'
import { background1, $Heading, $SubHeading, $NextButton } from '../contants'

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

export const EnterCodeCard = () => {
  const [code, setCode] = useState('')
  const url = `${manifest.microfrontends.webflow.referral}?r=${code}`
  return (
    <ErrorCard title="Referral not found" icon="🧐" message="Please enter another referral code">
      <$Vertical style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
        <$InputMedium placeholder="Referral Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <br />
        <a href={url}>
          <$NextButton
            color={COLORS.trustFontColor}
            backgroundColor={COLORS.trustBackground}
            // style={{ padding: '15px 50px', margin: '0 auto' }}
            style={{ width: '100%' }}
          >
            Go
          </$NextButton>
        </a>
      </$Vertical>
    </ErrorCard>
  )
}

const $InputMedium = styled.input`
  background-color: ${`${COLORS.white}`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

const $Icon = styled.span`
  font-size: 50px;
  text-align: center;
  color: ${COLORS.white};
`

export default GenericCard
