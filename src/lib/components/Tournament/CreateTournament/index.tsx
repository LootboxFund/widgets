import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../../AuthGuard'
import { $h3, $Horizontal, $span, $Vertical } from '../../Generics'
import {
  CreateTournamentPayload,
  CreateTournamentResponse,
  CreateTournamentResponseSuccess,
  MutationCreateTournamentArgs,
  Tournament,
} from '../../../api/graphql/generated/types'
import $Button from '../../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation } from '@apollo/client'
import { CREATE_TOURNAMENT } from './api.gql'
import LogRocket from 'logrocket'
import { LoadingText } from '../../Generics/Spinner'
import { $ErrorMessage, $Header, $InputMedium, $TextAreaMedium } from '../common'
import { manifest } from 'manifest'
import { initDApp } from 'lib/hooks/useWeb3Api'
import { initLogging } from 'lib/api/logrocket'
import { uploadTournamentCover } from 'lib/api/firebase/storage'
import { useTournamentWords } from '../common'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface CreateTournamentProps {
  onSuccessCallback?: (tournament: Tournament) => void
}

const CreateTournament = ({ onSuccessCallback }: CreateTournamentProps) => {
  const { screen } = useWindowSize()
  const [errorMessage, setErrorMessage] = useState('')
  const [localCoverPhoto, setLocalCoverPhoto] = useState<File | undefined>()
  const [tournamentPayload, setTournamentPayload] = useState<CreateTournamentPayload>({
    title: '',
    description: '',
    tournamentDate: undefined,
  })
  const [createTournament, { loading }] = useMutation<
    { createTournament: CreateTournamentResponse },
    MutationCreateTournamentArgs
  >(CREATE_TOURNAMENT)
  const words = useWords()
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

  const parseBattleDate = (battleDate: string) => {
    const tournamentDate = new Date(battleDate).valueOf()
    setTournamentPayload({
      ...tournamentPayload,
      tournamentDate,
    })
  }

  const parsePrize = (prize: string) => {
    setTournamentPayload({
      ...tournamentPayload,
      prize,
    })
  }

  const parseCover = () => {
    // @ts-ignore
    const selectedFiles = document.getElementById('tournament-cover-uploader')?.files
    if (selectedFiles?.length) {
      const file = selectedFiles[0] as File
      console.log('file', file)

      setLocalCoverPhoto(file)

      // Display the image in the UI
      const el = document.getElementById('tournament-cover-photo')

      if (!el) {
        console.error(`Could not find element`)
        return
      }

      var url = URL.createObjectURL(file)
      console.log('url', url)

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

    try {
      const coverUrl = localCoverPhoto ? await uploadTournamentCover(localCoverPhoto) : undefined
      let payload = { ...tournamentPayload }

      if (coverUrl) {
        payload.coverPhoto = coverUrl
      }

      const { data } = await createTournament({
        variables: {
          payload,
        },
      })

      if (!data) {
        throw new Error(words.anErrorOccured)
      } else if (data?.createTournament?.__typename === 'ResponseError') {
        throw new Error(data.createTournament.error.message)
      }

      const res = data.createTournament as CreateTournamentResponseSuccess

      onSuccessCallback && onSuccessCallback(res.tournament)
    } catch (err) {
      LogRocket.captureException(err)
      setErrorMessage(err?.message || words.anErrorOccured)
    }
  }

  return (
    <AuthGuard>
      <$Vertical
        spacing={4}
        width={screen == 'mobile' ? '100%' : '520px'}
        padding="1.6rem"
        style={{
          background: '#FFFFFF',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '21px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          minHeight: '520px',
          margin: '0 auto',
        }}
      >
        <$Vertical spacing={4}>
          <$Header>{tournamentWords.createTournament}</$Header>

          <$Vertical spacing={2}>
            <$span>{words.title}</$span>
            <$InputMedium
              onChange={(e) => parseTitle(e.target.value)}
              value={tournamentPayload.title}
              placeholder={tournamentWords.titlePlaceholder}
              style={{
                color: `${COLORS.black}ca`,
              }}
            ></$InputMedium>
          </$Vertical>

          <$Vertical spacing={2}>
            <$span>{words.description}</$span>
            <$TextAreaMedium
              onChange={(e) => parseDescription(e.target.value)}
              value={tournamentPayload.description}
              rows={4}
              style={{
                color: `${COLORS.black}ca`,
              }}
            ></$TextAreaMedium>
          </$Vertical>

          <$Horizontal spacing={2}>
            <$Vertical spacing={2} width="50%">
              <$span>{words.battleDate}</$span>
              <$InputMedium
                type="date"
                placeholder="March 16th 2022"
                onChange={(e) => parseBattleDate(e.target.value)}
                style={{
                  color: `${COLORS.black}ca`,
                }}
              />
            </$Vertical>

            <$Vertical spacing={2} width="50%">
              <$span>{words.prize}</$span>
              <$InputMedium
                placeholder={tournamentWords.prizePlaceholder}
                onChange={(e) => parsePrize(e.target.value)}
                style={{
                  color: `${COLORS.black}ca`,
                }}
              />
            </$Vertical>
          </$Horizontal>

          <$Vertical>
            <$InputImageLabel htmlFor="tournament-cover-uploader">
              {localCoverPhoto ? tournamentWords.editCoverPhoto : tournamentWords.addCoverPhoto} (
              {tournamentWords.landscapeRecommended})
            </$InputImageLabel>
            <$InputImage type="file" id="tournament-cover-uploader" accept="image/*" onChange={parseCover} />
            <$CoverImage id="tournament-cover-photo" display={localCoverPhoto ? 'block' : 'none'} />
          </$Vertical>

          <$Vertical spacing={2}>
            <$span>{tournamentWords.linkToOfficalTournament}</$span>
            <$InputMedium
              onChange={(e) => parseTournamentLink(e.target.value)}
              value={tournamentPayload?.tournamentLink || ''}
              style={{
                color: `${COLORS.black}ca`,
              }}
            ></$InputMedium>
          </$Vertical>

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
            <LoadingText loading={loading} text={tournamentWords.createTournament} color={COLORS.trustFontColor} />
          </$Button>
          {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
        </$Vertical>
      </$Vertical>
    </AuthGuard>
  )
}

const CreateTournamentPage = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
      try {
        await initDApp()
      } catch (err) {
        console.error('Error initializing DApp', err)
      }
    }
    load()
  }, [])

  const onTournamentCreated = (tournament: Tournament) => {
    window.open(`${manifest.microfrontends.webflow.tournamentManagePage}?tid=${tournament.id}`, '_self')
  }

  return (
    <AuthGuard>
      <CreateTournament onSuccessCallback={onTournamentCreated} />
    </AuthGuard>
  )
}

export const $CoverImage = styled.div<{ display: string }>`
  width: 100%;
  height: 250px;
  border: 0px solid transparent;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: center;
  display: ${(props) => props.display};
  margin-top: 30px;
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

export const $InputImage = styled.input`
  display: none;
`

export const $InputImageLabel = styled.label`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  color: ${COLORS.surpressedFontColor}ae;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
`

export default CreateTournamentPage
