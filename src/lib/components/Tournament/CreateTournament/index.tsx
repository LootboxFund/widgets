import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../../AuthGuard'
import { $Vertical } from '../../Generics'
import {
  CreateTournamentPayload,
  CreateTournamentResponse,
  MutationCreateTournamentArgs,
} from '../../../api/graphql/generated/types'
import $Button from '../../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation } from '@apollo/client'
import { CREATE_TOURNAMENT } from './api.gql'
import LogRocket from 'logrocket'
import { LoadingText } from '../../Generics/Spinner'
import { $ErrorMessage, $Header, $InputMedium, $TextAreaMedium } from '../common'

interface CreateTournamentProps {
  onSuccessCallback?: () => void
}

const CreateTournament = ({ onSuccessCallback }: CreateTournamentProps) => {
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [tournamentPayload, setTournamentPayload] = useState<CreateTournamentPayload>({ title: '', description: '' })
  const [createTournament, { loading }] = useMutation<
    { createTournament: CreateTournamentResponse },
    MutationCreateTournamentArgs
  >(CREATE_TOURNAMENT)

  const parseTitle = (title: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      title,
    })
  }

  const parseDescription = (description: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      description,
    })
  }

  const parseTournamentLink = (tournamentLink: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      tournamentLink,
    })
  }

  const handleButtonClick = async () => {
    if (!tournamentPayload.title) {
      setErrorMessage('Title is required')
      return
    }
    if (!tournamentPayload.description) {
      setErrorMessage('Description is required')
      return
    }

    try {
      const { data } = await createTournament({
        variables: {
          payload: tournamentPayload,
        },
      })

      if (!data) {
        throw new Error('An error occured!')
      } else if (data?.createTournament?.__typename === 'ResponseError') {
        throw new Error(data.createTournament.error.message)
      }

      onSuccessCallback && onSuccessCallback()
    } catch (err) {
      LogRocket.captureException(err)
      setErrorMessage(err?.message || 'An error occured!')
    }
  }

  return (
    <AuthGuard>
      <$Vertical
        spacing={4}
        width="380px"
        padding="1.6rem"
        style={{
          background: '#FFFFFF',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '21px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          minHeight: '520px',
        }}
      >
        <$Vertical spacing={4}>
          <$Header>Create a Tournament</$Header>
          <$InputMedium
            onChange={(e) => parseTitle(e.target.value)}
            value={tournamentPayload.title}
            placeholder="Title"
            style={{
              color: `${COLORS.black}ca`,
            }}
          ></$InputMedium>

          <$TextAreaMedium
            onChange={(e) => parseDescription(e.target.value)}
            value={tournamentPayload.description}
            placeholder="Description"
            rows={4}
            style={{
              color: `${COLORS.black}ca`,
            }}
          ></$TextAreaMedium>

          <$InputMedium
            onChange={(e) => parseTournamentLink(e.target.value)}
            value={tournamentPayload?.tournamentLink || ''}
            placeholder="Link to Tournament"
            style={{
              color: `${COLORS.black}ca`,
            }}
          ></$InputMedium>

          <$Button
            screen={screen}
            onClick={handleButtonClick}
            backgroundColor={`${COLORS.trustBackground}C0`}
            backgroundColorHover={`${COLORS.trustBackground}`}
            color={COLORS.trustFontColor}
            style={{
              boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
            }}
            disabled={loading}
          >
            <LoadingText loading={loading} text="Create a Tournament" color={COLORS.trustFontColor} />
          </$Button>
          {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
        </$Vertical>
      </$Vertical>
    </AuthGuard>
  )
}

export const $ChangeMode = styled.div`
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  cursor: pointer;
  text-align: center;
  text-decoration-line: underline;
  color: #ababab;
`

export default CreateTournament
