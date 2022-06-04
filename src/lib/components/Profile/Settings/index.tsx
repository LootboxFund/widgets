import { $Vertical, $h1, $Horizontal, $span } from 'lib/components/Generics'
import AuthGuard from 'lib/components/AuthGuard'
import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Link, $SettingContainer } from '../common'
import { useAuth } from 'lib/hooks/useAuth'

const SettingsComponent = () => {
  const { user } = useAuth()
  const isPasswordEnabled = user?.authProviders?.includes('password')

  return (
    <$Vertical spacing={4}>
      <$h1>Account Settings</$h1>
      <$SettingContainer disabled>
        <$Horizontal justifyContent="flex-start" flexWrap>
          <$span width="20%" lineHeight="40px">
            Email
          </$span>
          <$span width="80%" lineHeight="40px">
            {user?.email ? (
              <$span>{user?.email}</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                Password not set!
              </$span>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
      <$SettingContainer>
        <$Horizontal justifyContent="flex-start" flexWrap>
          <$span width="20%" lineHeight="40px">
            Password
          </$span>
          <$span width="60%" lineHeight="40px">
            {isPasswordEnabled ? (
              <$span textAlign="start">******************</$span>
            ) : (
              <$span textAlign="start" color={COLORS.dangerFontColor}>
                Password not set!
              </$span>
            )}
          </$span>
          <$span textAlign="end" width="20%" lineHeight="40px">
            {isPasswordEnabled ? (
              <$Link style={{ fontStyle: 'normal' }}>change password?</$Link>
            ) : (
              <$Link style={{ fontStyle: 'normal' }}>new password</$Link>
            )}
          </$span>
        </$Horizontal>
      </$SettingContainer>
    </$Vertical>
  )
}

export const Settings = () => {
  return (
    <AuthGuard>
      <SettingsComponent />
    </AuthGuard>
  )
}

export default Settings
