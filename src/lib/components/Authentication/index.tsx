import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useAuth } from 'lib/hooks/useAuth'
import { useState } from 'react'
import styled from 'styled-components'
import { $Vertical } from '../Generics'
import Login from './Login'
import Signup from './Signup'

const Authentication = () => {
  const [route, setRoute] = useState<'login' | 'sign-up'>('sign-up')

  const goToLogin = () => {
    setRoute('login')
  }

  const goToSignup = () => {
    setRoute('sign-up')
  }

  const renderSwitchRouteText = () => {
    if (route === 'login') {
      return (
        <$LightText>
          Don't have an account? <$Link onClick={goToSignup}>sign up</$Link>
        </$LightText>
      )
    } else if (route === 'sign-up') {
      return (
        <$LightText>
          Already have an account? <$Link onClick={goToLogin}>log in</$Link>
        </$LightText>
      )
    }
    return ''
  }

  const onSignUpCallback = (signupMode: 'password' | 'wallet') => {
    setRoute('login')
  }

  return (
    <$Vertical
      spacing={4}
      width="380px"
      // height="420px"
      height="520px"
      padding="1.6rem"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '21px',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      {route === 'login' ? <Login /> : null}
      {route === 'sign-up' ? <Signup onSignUpCallback={onSignUpCallback} /> : null}
      <$PromptText>{renderSwitchRouteText()}</$PromptText>
    </$Vertical>
  )
}

const $PromptText = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  text-align: center;
`
const $Link = styled.span`
  color: #1abaff;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-style: italic;
  cursor: pointer;
`

const $LightText = styled.span`
  color: ${COLORS.surpressedFontColor};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
`

export default Authentication
