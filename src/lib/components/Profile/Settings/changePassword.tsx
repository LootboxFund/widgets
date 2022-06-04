import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { $h2, $Vertical } from 'lib/components/Generics'
import { useState } from 'react'
import styled from 'styled-components'

const ChangePassword = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const parsePassword = (inputPassword: string) => {
    setPassword(inputPassword)
  }

  const parsePasswordConfirmation = (inputPasswordConfirmation: string) => {
    setPasswordConfirmation(inputPasswordConfirmation)
  }

  return (
    <$Vertical spacing={3}>
      <$h2>Change Password</$h2>
      <$InputMedium
        onChange={(e) => parsePassword(e.target.value)}
        value={password}
        placeholder="password"
        type="password"
      ></$InputMedium>
      <$InputMedium
        onChange={(e) => parsePasswordConfirmation(e.target.value)}
        value={passwordConfirmation}
        placeholder="confirm password"
        type="password"
      ></$InputMedium>
    </$Vertical>
  )
}

const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: 40px;
`

export default ChangePassword
