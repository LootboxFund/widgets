import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { auth } from 'lib/api/firebase/app'
import { $h3, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import { LoadingText } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useState } from 'react'
import styled from 'styled-components'
import useWords from 'lib/hooks/useWords'
import { checkIfValidEmail } from 'lib/api/helpers'
import { UPDATE_MY_AUTH, UpdateUserAuthResponseFE } from './api.gql'
import { useMutation } from '@apollo/client'
import { MutationUpdateUserAuthArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { GET_MY_PROFILE } from '../api.gql'
import PopConfirm from 'lib/components/Generics/PopConfirm'

interface ChangeEmailProps {
  onSuccessCallback?: () => void
}

const ChangeEmail = (props: ChangeEmailProps) => {
  const { screen } = useWindowSize()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const words = useWords()
  const [updateMyEmail, { loading }] = useMutation<
    { updateUserAuth: UpdateUserAuthResponseFE | ResponseError },
    MutationUpdateUserAuthArgs
  >(UPDATE_MY_AUTH, {
    refetchQueries: [GET_MY_PROFILE],
  })

  const parseEmail = (_email: string) => {
    setEmail(_email)
  }

  const handleEmailRequest = async () => {
    const user = auth.currentUser
    setErrorMessage('')
    try {
      if (!user) {
        console.error('NO USER')
        throw new Error(words.anErrorOccured)
      }
      if (!checkIfValidEmail(email)) {
        throw new Error(words.invalidEmail)
      }

      const { data } = await updateMyEmail({ variables: { payload: { email } } })

      if (data?.updateUserAuth?.__typename === 'ResponseError') {
        throw new Error(words.anErrorOccured)
      }

      setEmail('')
      props.onSuccessCallback && props.onSuccessCallback()
    } catch (err) {
      setErrorMessage(`${words.anErrorOccured}. Please try a different email, or try again later...`)
    }
  }

  return (
    <$Vertical spacing={3}>
      <$h3 style={{ fontSize: TYPOGRAPHY.fontSize.large }}>{words.enterYourEmail}</$h3>
      <$InputMedium
        onChange={(e) => parseEmail(e.target.value)}
        value={email}
        placeholder={words.email}
        type="email"
        style={{
          boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
        }}
      ></$InputMedium>
      <div>
        <PopConfirm onOk={handleEmailRequest} message={`You will need to log in again.`}>
          <$Button
            screen={screen}
            // onClick={handleEmailRequest}
            backgroundColor={`${COLORS.trustBackground}C0`}
            backgroundColorHover={`${COLORS.trustBackground}`}
            color={COLORS.trustFontColor}
            style={{
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
              boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
            }}
            disabled={loading}
          >
            <LoadingText loading={loading} text={words.saveChanges} color={COLORS.trustFontColor} />
          </$Button>
        </PopConfirm>
      </div>

      {errorMessage && (
        <$span color={COLORS.dangerFontColor} textAlign="start">
          {errorMessage}
        </$span>
      )}
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

export default ChangeEmail
