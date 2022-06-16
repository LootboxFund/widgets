import { useMutation, useQuery } from '@apollo/client'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import {
  GetMyProfileResponse,
  GetMyProfileSuccess,
  Tournament,
  DeleteTournamentResponse,
  MutationDeleteTournamentArgs,
} from 'lib/api/graphql/generated/types'
import { $h1, $h3, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import PopConfirm from 'lib/components/Generics/PopConfirm'
import Spinner, { $Spinner } from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import { useState } from 'react'
import { $Link, $SearchInput, $SettingContainer, Oopsies } from '../common'
import { DELETE_TOURNAMENT, GET_MY_TOURNAMENTS } from './api.gql'

const TournamentList = ({ tournaments }: { tournaments: Tournament[] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { screen } = useWindowSize()
  const [deleteTournament] = useMutation<{ deleteTournament: DeleteTournamentResponse }, MutationDeleteTournamentArgs>(
    DELETE_TOURNAMENT,
    {
      refetchQueries: [{ query: GET_MY_TOURNAMENTS }],
    }
  )
  const [tournamentStatus, setTournamentStatus] = useState<{
    [key: string]: { loading: boolean; errorMessage: string }
  }>({})

  const filteredTournaments: Tournament[] = !!searchTerm
    ? [...(tournaments?.filter((snapshot) => snapshot?.title.toLowerCase().includes(searchTerm.toLowerCase())) || [])]
    : [...(tournaments || [])]

  const handleRemoveTournament = async (tournament: Tournament) => {
    setTournamentStatus({ ...tournamentStatus, [tournament.id]: { loading: true, errorMessage: '' } })
    try {
      const { data } = await deleteTournament({ variables: { id: tournament.id } })
      if (data?.deleteTournament?.__typename === 'ResponseError') {
        setTournamentStatus({
          ...tournamentStatus,
          [tournament.id]: { loading: false, errorMessage: data.deleteTournament.error.message || 'An error occured!' },
        })
      } else {
        setTournamentStatus({ ...tournamentStatus, [tournament.id]: { loading: false, errorMessage: '' } })
      }
    } catch (error) {
      setTournamentStatus({
        ...tournamentStatus,
        [tournament.id]: { loading: false, errorMessage: error.message || 'An error occured!' },
      })
    }
  }

  return (
    <$Vertical spacing={4}>
      <$SearchInput
        type="search"
        placeholder="🔍 Search Tournaments by Name"
        onChange={(e) => setSearchTerm(e.target.value || '')}
      />
      {filteredTournaments.map((tournament, index) => {
        return (
          <$SettingContainer key={`tournament-${index}`}>
            <$Horizontal key={tournament.id} justifyContent="space-between" flexWrap>
              <$span
                lineHeight="40px"
                style={{
                  marginLeft: screen !== 'mobile' ? '20px' : '0px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {tournament.title}
              </$span>
              <$Horizontal
                width={screen === 'mobile' ? '100%' : '30%'}
                key={tournament.id}
                justifyContent={screen === 'mobile' ? 'flex-start' : 'center'}
              >
                <$span lineHeight="40px" style={{ paddingRight: '15px' }}>
                  <$Link
                    href={`${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`}
                    style={{ textDecoration: 'none', fontStyle: 'normal' }}
                  >
                    view
                  </$Link>
                </$span>
                <$span lineHeight="40px" style={{ paddingRight: '15px' }}>
                  <$Link
                    href={`${manifest.microfrontends.webflow.tournamentManagePage}?tid=${tournament.id}`}
                    style={{ textDecoration: 'none', fontStyle: 'normal' }}
                  >
                    edit
                  </$Link>
                </$span>
                {tournamentStatus[tournament.id]?.loading ? (
                  <$Spinner color={`${COLORS.surpressedFontColor}ae`} style={{ textAlign: 'center' }} />
                ) : (
                  <PopConfirm onOk={() => handleRemoveTournament(tournament)}>
                    <$span
                      lineHeight="40px"
                      width="100%"
                      textAlign="center"
                      color={COLORS.dangerFontColor}
                      style={{ cursor: 'pointer' }}
                    >
                      remove
                    </$span>
                  </PopConfirm>
                )}
              </$Horizontal>
            </$Horizontal>
          </$SettingContainer>
        )
      })}
    </$Vertical>
  )
}

const MyTournaments = () => {
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_TOURNAMENTS)

  const navigateToCreateTournament = () => {
    window.open(manifest.microfrontends.webflow.tournamentCreatePage, '_self')
  }

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} icon="🤕" title="Error loading Tournaments" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies message={data?.getMyProfile?.error?.message || ''} icon="🤕" title="Error loading Tournaments" />
  }

  const tournaments = (data?.getMyProfile as GetMyProfileSuccess)?.user?.tournaments || []

  return (
    <$Vertical spacing={4}>
      <$Vertical>
        <$h1>My Tournaments</$h1>
        <TournamentList tournaments={tournaments} />
      </$Vertical>
      <div>
        <$Button
          screen={screen}
          onClick={navigateToCreateTournament}
          backgroundColor={`${COLORS.trustBackground}C0`}
          backgroundColorHover={`${COLORS.trustBackground}`}
          color={COLORS.trustFontColor}
          style={{
            fontWeight: TYPOGRAPHY.fontWeight.regular,
            fontSize: TYPOGRAPHY.fontSize.large,
            boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
          }}
        >
          New Tournament
        </$Button>
      </div>
    </$Vertical>
  )
}

export default MyTournaments
