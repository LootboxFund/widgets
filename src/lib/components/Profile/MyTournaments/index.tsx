import { useQuery } from '@apollo/client'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { GetMyProfileResponse, GetMyProfileSuccess, Tournament } from 'lib/api/graphql/generated/types'
import { $h1, $h3, $Horizontal, $span, $Vertical } from 'lib/components/Generics'
import $Button from 'lib/components/Generics/Button'
import Spinner from 'lib/components/Generics/Spinner'
import useWindowSize from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import { useState } from 'react'
import { $Link, $SearchInput, $SettingContainer, Oopsies } from '../common'
import { GET_MY_TOURNAMENTS } from './api.gql'

const TournamentList = ({ tournaments }: { tournaments: Tournament[] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { screen } = useWindowSize()

  const filteredTournaments: Tournament[] = !!searchTerm
    ? [...(tournaments?.filter((snapshot) => snapshot?.title.toLowerCase().includes(searchTerm.toLowerCase())) || [])]
    : [...(tournaments || [])]

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
            <$Horizontal key={tournament.id} justifyContent="space-between">
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
              <$Horizontal width="30%" key={tournament.id} justifyContent="center">
                <$span lineHeight="40px" style={{ paddingRight: '15px' }}>
                  <$Link href={`${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${tournament.id}`}>
                    view
                  </$Link>
                </$span>
                <$span lineHeight="40px">
                  <$Link href={`${manifest.microfrontends.webflow.tournamentManagePage}?tid=${tournament.id}`}>
                    edit
                  </$Link>
                </$span>
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
