import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../../AuthGuard'
import { $Vertical } from '../../Generics'
import {
  EditTournamentPayload,
  EditTournamentResponse,
  MutationEditTournamentArgs,
} from '../../../api/graphql/generated/types'
import $Button from '../../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation } from '@apollo/client'
import { EDIT_TOURNAMENT } from './api.gql'
import LogRocket from 'logrocket'
import { LoadingText } from '../../Generics/Spinner'
import { TournamentID } from 'lib/types'
import { $ErrorMessage, $InputLabel, $InputMedium, $TextAreaMedium } from '../common'

interface EditTournamentProps {
  onSuccessCallback?: () => void
  tournamentId: TournamentID
  initialState?: Omit<EditTournamentPayload, 'id'>
}

const EditTournament = ({ tournamentId, onSuccessCallback, initialState }: EditTournamentProps) => {
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [tournamentPayload, setTournamentPayload] = useState<Omit<EditTournamentPayload, 'id'>>(initialState || {})
  const [editTournament, { loading }] = useMutation<
    { editTournament: EditTournamentResponse },
    MutationEditTournamentArgs
  >(EDIT_TOURNAMENT)

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

  const parseMagicLink = (magicLink: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      magicLink,
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
      const payload: EditTournamentPayload = {
        id: tournamentId,
        title: tournamentPayload.title,
        description: tournamentPayload.description,
        tournamentLink: tournamentPayload.tournamentLink,
        magicLink: tournamentPayload.magicLink,
      }

      const { data } = await editTournament({
        variables: {
          payload,
        },
      })

      if (!data) {
        throw new Error('An error occured!')
      } else if (data?.editTournament?.__typename === 'ResponseError') {
        throw new Error(data.editTournament.error.message)
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
        spacing={5}
        width="100%"
        style={{
          background: '#FFFFFF',
          // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          // borderRadius: '21px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-title">Title</$InputLabel>
          <$InputMedium
            id="input-title"
            onChange={(e) => parseTitle(e.target.value)}
            value={tournamentPayload.title || ''}
            placeholder="ex. My Awesome Tournament"
          ></$InputMedium>
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-magic">Lootbox Magic Link</$InputLabel>
          <$InputMedium
            id="input-magic"
            onChange={(e) => parseMagicLink(e.target.value)}
            value={tournamentPayload?.magicLink || ''}
          ></$InputMedium>
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-link">External Tournament Link</$InputLabel>
          <$InputMedium
            id="input-link"
            onChange={(e) => parseTournamentLink(e.target.value)}
            value={tournamentPayload?.tournamentLink || ''}
          ></$InputMedium>
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-descr">Description</$InputLabel>
          <$TextAreaMedium
            id="input-descr"
            onChange={(e) => parseDescription(e.target.value)}
            value={tournamentPayload.description || ''}
            rows={8}
          ></$TextAreaMedium>
        </$Vertical>
        <div>
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
            <LoadingText loading={loading} text="Save Changes" color={COLORS.trustFontColor} />
          </$Button>
        </div>
        {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
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

export default EditTournament
