/**
 * This component doubles as a stream edit form when `initialParams` are passed in
 */

import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../../AuthGuard'
import { $h3, $Horizontal, $span, $Vertical } from '../../Generics'
import {
  AddStreamResponse,
  EditStreamResponse,
  MutationAddStreamArgs,
  MutationEditStreamArgs,
  StreamType,
} from '../../../api/graphql/generated/types'
import $Button from '../../Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useMutation } from '@apollo/client'
import { ADD_STREAM, GET_MY_TOURNAMENT, EDIT_STREAM } from './api.gql'
import { LoadingText } from '../../Generics/Spinner'
import { StreamID, TournamentID } from 'lib/types'
import { $ErrorMessage, $InputMedium, useTournamentWords } from '../common'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'

const DEFAULT_STREAM_TYPE: StreamType = StreamType.Facebook

interface AddStreamProps {
  tournamentId: TournamentID
  onCancel?: () => void
  onSuccess?: () => void
  initialParams?: {
    name: string
    url: string
    type: StreamType
    id: StreamID | string
  }
}

const AddStream = ({ tournamentId, initialParams, onCancel, onSuccess }: AddStreamProps) => {
  const { screen } = useWindowSize()
  const [isExpanded, setIsExpanded] = useState(!!initialParams)
  const [errorMessage, setErrorMessage] = useState('')
  const [name, setName] = useState(initialParams?.name || '')
  const [url, setUrl] = useState(initialParams?.url || '')
  const [type, setType] = useState<StreamType>(initialParams?.type || DEFAULT_STREAM_TYPE)
  const [addStream, { loading: addLoading }] = useMutation<{ addStream: AddStreamResponse }, MutationAddStreamArgs>(
    ADD_STREAM,
    {
      refetchQueries: [
        {
          query: GET_MY_TOURNAMENT,
          variables: {
            id: tournamentId,
          },
        },
      ],
    }
  )
  const [editStream, { loading: editLoading }] = useMutation<
    { editStream: EditStreamResponse },
    MutationEditStreamArgs
  >(EDIT_STREAM, {
    refetchQueries: [
      {
        query: GET_MY_TOURNAMENT,
        variables: {
          id: tournamentId,
        },
      },
    ],
  })
  const loading = editLoading || addLoading
  const words = useWords()
  const tournamentWords = useTournamentWords()
  const intl = useIntl()

  const linkToStream = intl.formatMessage({
    id: 'tournament.manage.addStream.linkToStream',
    defaultMessage: 'Link to Stream',
    description: 'Button text to link to a stream',
  })

  const facebookGaming = intl.formatMessage({
    id: 'tournament.manage.addStream.facebookGaming',
    defaultMessage: 'Facebook Gaming',
    description: 'Name of live stream for Facebook',
  })

  const twitch = intl.formatMessage({
    id: 'tournament.manage.addStream.twitch',
    defaultMessage: 'Twitch',
    description: 'Name of live stream for Twitch',
  })

  const youtubeLive = intl.formatMessage({
    id: 'tournament.manage.addStream.youtubeLive',
    defaultMessage: 'YouTube Live',
    description: 'Name of live stream for YouTube',
  })

  const handleButtonClick = async () => {
    setErrorMessage('')
    if (!isExpanded) {
      setIsExpanded(true)
    } else {
      if (name.length === 0) {
        setErrorMessage(words.nameCannotBeEmpty)
        return
      } else if (url.length === 0) {
        setErrorMessage(tournamentWords.streamURLCannotBeEmpty)
        return
      }
      // else if (!isUrl(url)) {
      //   setErrorMessage(tournamentWords.streamURLNotValidUrl)
      //   return
      // }
      else if (!type) {
        setErrorMessage(tournamentWords.streamTypeCannotBeEmpty)
        return
      }

      try {
        if (initialParams) {
          // This is a stream edit
          const res = await editStream({
            variables: {
              payload: {
                name,
                url,
                type,
                id: initialParams.id,
              },
            },
          })

          if (res.data?.editStream?.__typename === 'ResponseError') {
            throw new Error(res.data.editStream.error?.message || words.anErrorOccured)
          }
        } else {
          // This is a stream add
          const res = await addStream({
            variables: {
              payload: {
                tournamentId,
                stream: {
                  name,
                  url,
                  type,
                },
              },
            },
          })

          if (res.data?.addStream?.__typename === 'ResponseError') {
            throw new Error(res.data.addStream.error?.message || words.anErrorOccured)
          }
        }

        // Close the thing:
        setIsExpanded(false)
        setName('')
        setUrl('')
        setType(DEFAULT_STREAM_TYPE)
        setErrorMessage('')
        onSuccess && onSuccess()
      } catch (err) {
        console.error('Error making stream')
        setErrorMessage(err?.message || words.anErrorOccured)
      }
    }
  }

  const closeAddStreamSection = () => {
    setIsExpanded(false)
    setErrorMessage('')
    if (onCancel) {
      onCancel()
    }
  }

  const parseName = (name: string) => {
    setName(name)
  }

  const parseUrl = (url: string) => {
    setUrl(url)
  }

  const parseType = (type: StreamType) => {
    setType(type)
  }

  return (
    <AuthGuard>
      <$Vertical
        spacing={4}
        width="100%"
        style={{
          background: '#FFFFFF',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {isExpanded && (
          <$Vertical spacing={3}>
            {!initialParams && <$h3>{words.addLiveStream}</$h3>}
            <$AddStreamContainer>
              <$Horizontal flexWrap={screen === 'mobile'} spacing={2}>
                <$InputMedium
                  placeholder={words.name}
                  value={name}
                  onChange={(e) => parseName(e.target.value)}
                  style={{ borderRadius: '5px', background: COLORS.white, marginTop: '10px', marginBottom: '10px' }}
                  width={screen === 'mobile' ? '100%' : '20%'}
                />
                <$InputMedium
                  placeholder={linkToStream}
                  value={url}
                  onChange={(e) => parseUrl(e.target.value)}
                  style={{ borderRadius: '5px', background: COLORS.white, marginTop: '10px', marginBottom: '10px' }}
                  width={screen === 'mobile' ? '80%' : '40%'}
                />
                <div style={{ margin: 'auto 0' }}>
                  <HelpIcon tipID="linkToStream" marginLeft="0px" />
                </div>
                <ReactTooltip id="linkToStream" place="top" effect="solid">
                  <FormattedMessage
                    id="addStream.streamLink.help"
                    defaultMessage='The "Stream Link" is different for each stream type.{newline}{newline}For Facebook, it must be PUBLIC. It is the URL when you click "share" or "copy link" (e.x. "https://fb.watch/eyTrWLFDxu").{newline}{newline}For YouTube, the stream must be PUBLIC and you need to allow "video embedding". It is the livestream/video ID (i.e. "6mnMw_jKbxw" if the video URL is "https://www.youtube.com/watch?v=6mnMw_jKbxw").{newline}{newline}For Twitch, it is your channel name / ID.'
                    values={{ newline: <br /> }}
                  />
                </ReactTooltip>

                <$TournamentSelect
                  value={type}
                  onChange={(e) => parseType(e.target.value as StreamType)}
                  width={screen === 'mobile' ? '100%' : 'auto'}
                >
                  <option value={StreamType.Facebook}>{facebookGaming}</option>
                  <option value={StreamType.Youtube}>{youtubeLive}</option>
                  <option value={StreamType.Twitch}>{twitch}</option>
                </$TournamentSelect>
              </$Horizontal>
            </$AddStreamContainer>
          </$Vertical>
        )}
        <$Horizontal spacing={2}>
          <div>
            <$Button
              id="button-add-stream"
              screen={screen}
              onClick={handleButtonClick}
              backgroundColor={`${COLORS.trustBackground}`}
              backgroundColorHover={`${COLORS.trustBackground}`}
              color={COLORS.trustFontColor}
              style={{
                fontWeight: TYPOGRAPHY.fontWeight.regular,
                fontSize: TYPOGRAPHY.fontSize.large,
              }}
              disabled={loading}
            >
              <LoadingText
                loading={loading}
                text={initialParams ? words.saveChanges : words.addLiveStream}
                color={COLORS.trustFontColor}
              />
            </$Button>
          </div>
          {isExpanded && (
            <$span onClick={closeAddStreamSection} style={{ lineHeight: '40px', cursor: 'pointer' }}>
              {words.cancel}
            </$span>
          )}
        </$Horizontal>

        {errorMessage ? <$ErrorMessage>{errorMessage}</$ErrorMessage> : null}
      </$Vertical>
    </AuthGuard>
  )
}

const $AddStreamContainer = styled.div`
  background: #f2f2f2;
  border-radius: 20px;
  width: 100%;
  padding: 0px 15px;
  box-sizing: border-box;
`

const $TournamentSelect = styled.select<{ width?: string }>`
  border-radius: 5px;
  background: ${COLORS.white};
  border: none;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor}ae;
  padding: 5px 10px;
  box-sizing: content-box;
  height: 40px;
  width: ${(props) => props.width || '100%'};
`

export default AddStream
