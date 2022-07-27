import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../../AuthGuard'
import { $Horizontal, $Vertical } from '../../Generics'
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
import { $ErrorMessage, $InputLabel, $InputMedium, $TextAreaMedium, $TournamentCover } from '../common'
import { $CoverImage, $InputImage, $InputImageLabel } from '../CreateTournament'
import { uploadTournamentCover } from 'lib/api/firebase/storage'
import { useIntl } from 'react-intl'
import { useTournamentWords } from '../common'
import useWords from 'lib/hooks/useWords'

interface EditTournamentProps {
  onSuccessCallback?: () => void
  tournamentId: TournamentID
  initialState?: Omit<EditTournamentPayload, 'id'>
}

const EditTournament = ({ tournamentId, onSuccessCallback, initialState }: EditTournamentProps) => {
  const { screen } = useWindowSize()
  const [loadingImageUpload, setLoadingImageUpload] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [localCoverPhoto, setLocalCoverPhoto] = useState<File | undefined>()
  const [tournamentPayload, setTournamentPayload] = useState<Omit<EditTournamentPayload, 'id'>>(initialState || {})
  const [editTournament, { loading }] = useMutation<
    { editTournament: EditTournamentResponse },
    MutationEditTournamentArgs
  >(EDIT_TOURNAMENT)
  const words = useWords()
  const intl = useIntl()
  const tournamentWords = useTournamentWords()

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

  const parsePrize = (prize: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      prize,
    })
  }

  const parseBattleDate = (battleDate: string) => {
    const tournamentDate = new Date(battleDate).valueOf()
    setTournamentPayload({
      ...tournamentPayload,
      tournamentDate,
    })
  }

  const parseCover = () => {
    // @ts-ignore
    const selectedFiles = document.getElementById('tournament-cover-uploader')?.files
    if (selectedFiles?.length) {
      const file = selectedFiles[0] as File

      setLocalCoverPhoto(file)

      // Display the image in the UI
      const el = document.getElementById('tournament-cover-photo')

      if (!el) {
        console.error(`Could not find element`)
        return
      }

      var url = URL.createObjectURL(file)
      el.style.backgroundImage = 'url(' + url + ')'
      return
    }
  }

  const handleButtonClick = async () => {
    if (!tournamentPayload.title) {
      setErrorMessage(tournamentWords.titleRequired)
      return
    }
    if (!tournamentPayload.description) {
      setErrorMessage(tournamentWords.descriptionRequired)
      return
    }

    if (!tournamentPayload.tournamentDate) {
      setErrorMessage(tournamentWords.startDateRequired)
      return
    }

    setLoadingImageUpload(true)

    try {
      const coverUrl = localCoverPhoto ? await uploadTournamentCover(localCoverPhoto) : undefined

      const payload: EditTournamentPayload = {
        id: tournamentId,
        title: tournamentPayload.title,
        description: tournamentPayload.description,
        tournamentLink: tournamentPayload.tournamentLink,
        magicLink: tournamentPayload.magicLink,
        tournamentDate: tournamentPayload.tournamentDate,
        prize: tournamentPayload.prize,
        ...(coverUrl && { coverPhoto: coverUrl }),
      }

      const { data } = await editTournament({
        variables: {
          payload,
        },
      })

      if (!data) {
        throw new Error(words.anErrorOccured)
      } else if (data?.editTournament?.__typename === 'ResponseError') {
        throw new Error(data.editTournament.error.message)
      }

      setLocalCoverPhoto(undefined)

      onSuccessCallback && onSuccessCallback()
    } catch (err) {
      LogRocket.captureException(err)
      setErrorMessage(err?.message || words.anErrorOccured)
    } finally {
      setLoadingImageUpload(false)
    }
  }

  return (
    <AuthGuard>
      <$Vertical
        spacing={4}
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
          <$InputLabel htmlFor="input-title">{words.title}</$InputLabel>
          <$InputMedium
            id="input-title"
            onChange={(e) => parseTitle(e.target.value)}
            value={tournamentPayload.title || ''}
            placeholder={tournamentWords.titlePlaceholder}
          ></$InputMedium>
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-magic">Lootbox {words.magicLink}</$InputLabel>
          <$InputMedium
            id="input-magic"
            onChange={(e) => parseMagicLink(e.target.value)}
            value={tournamentPayload?.magicLink || ''}
          ></$InputMedium>
        </$Vertical>

        <$Horizontal spacing={2}>
          <$Vertical spacing={2} width="50%">
            <$InputLabel htmlFor="input-battle-date">{words.battleDate}</$InputLabel>
            <$InputMedium
              id="input-battle-date"
              type="date"
              onChange={(e) => parseBattleDate(e.target.value)}
              value={
                tournamentPayload?.tournamentDate
                  ? new Date(tournamentPayload.tournamentDate)?.toISOString().split('T')[0]
                  : ''
              }
            />
          </$Vertical>

          <$Vertical spacing={2} width="50%">
            <$InputLabel htmlFor="input-prize">{words.prize}</$InputLabel>
            <$InputMedium
              id="input-prize"
              placeholder={tournamentWords.prizePlaceholder}
              onChange={(e) => parsePrize(e.target.value)}
              value={tournamentPayload?.prize ? tournamentPayload.prize : ''}
            />
          </$Vertical>
        </$Horizontal>

        <$Vertical>
          <$InputImageLabel htmlFor="tournament-cover-uploader">
            {tournamentWords.editCoverPhoto} ({tournamentWords.landscapeRecommended})
          </$InputImageLabel>
          <$InputImage type="file" id="tournament-cover-uploader" accept="image/*" onChange={parseCover} />
          <$CoverImage id="tournament-cover-photo" display={localCoverPhoto ? 'block' : 'none'} />
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-link">{tournamentWords.linkToOfficalTournament}</$InputLabel>
          <$InputMedium
            id="input-link"
            onChange={(e) => parseTournamentLink(e.target.value)}
            value={tournamentPayload?.tournamentLink || ''}
          ></$InputMedium>
        </$Vertical>

        <$Vertical spacing={2}>
          <$InputLabel htmlFor="input-descr">{words.description}</$InputLabel>
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
            disabled={loadingImageUpload || loading}
          >
            <LoadingText
              loading={loadingImageUpload || loading}
              text={words.saveChanges}
              color={COLORS.trustFontColor}
            />
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
