import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../AuthGuard'
import { $Vertical } from '../Generics'
import {
  CreateTournamentPayload,
  CreateTournamentResponse,
  MutationCreateTournamentArgs,
} from '../../api/graphql/generated/types'
import $Button from '../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation } from '@apollo/client'
import { CREATE_TOURNAMENT } from './api.gql'
import LogRocket from 'logrocket'
import { LoadingText } from '../Generics/Spinner'

interface CreateTournamentProps {
  mode: 'edit' | 'create'
}

const CreateTournament = ({ mode = 'create' }: CreateTournamentProps) => {
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

    if (mode === 'create') {
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

        // TODO: redirect to tournament page
      } catch (err) {
        LogRocket.captureException(err)
        setErrorMessage(err?.message || 'An error occured!')
      }
    } else {
      setErrorMessage('Not implemented yet')
      return
    }
  }

  return (
    <AuthGuard>
      <$Vertical
        spacing={4}
        width="380px"
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
        <$Vertical spacing={4}>
          <$Header>Create a Tournament</$Header>
          <$InputMedium
            onChange={(e) => parseTitle(e.target.value)}
            value={tournamentPayload.title}
            placeholder="Title"
          ></$InputMedium>

          <$TextAreaMedium
            onChange={(e) => parseDescription(e.target.value)}
            value={tournamentPayload.description}
            placeholder="Description"
            rows={4}
          ></$TextAreaMedium>

          <$InputMedium
            onChange={(e) => parseTournamentLink(e.target.value)}
            value={tournamentPayload?.tournamentLink || ''}
            placeholder="Link to Tournament"
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

export const $ErrorMessage = styled.span`
  color: ${COLORS.dangerFontColor}ae;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $Header = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor};
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;
`

export const $TextAreaMedium = styled.textarea`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  max-height: 200px;
  max-width: 100%;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

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
