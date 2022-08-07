import { useQuery } from '@apollo/client'
import { COLORS } from '@wormgraph/helpers'
import {
  Claim,
  GetMyProfileResponse,
  QueryUserClaimsArgs,
  UserClaimsResponse,
  UserClaimsResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { userState } from 'lib/state/userState'
import { UserID } from 'lib/types'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Spinner from '../Generics/Spinner'
import { GET_MY_PROFILE } from '../Profile/api.gql'
import { Oopsies } from '../Profile/common'
import { GET_USER_CLAIMS } from './api.gql'
import { extractURLState_PublicProfilePage } from './utils'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'

interface PublicProfileProps {
  userId: UserID
}
/**
 * @terran edit this component
 */
const PublicProfile = (props: PublicProfileProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [lastCreatedAt, setLastCreatedAt] = useState<null | number>(null)
  const [userClaims, setUserClaims] = useState<Claim[]>([])
  const {
    data: profileData,
    loading: profileLoading,
    error: errorLoading,
  } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_PROFILE)
  const {
    data: claimsData,
    loading: loadingData,
    error: errorData,
  } = useQuery<{ userClaims: UserClaimsResponse }, QueryUserClaimsArgs>(GET_USER_CLAIMS, {
    variables: { userId: props.userId, first: 1, after: lastCreatedAt },
    onCompleted: (claimsData) => {
      if (claimsData?.userClaims?.__typename === 'UserClaimsResponseSuccess') {
        const nodes = claimsData.userClaims.edges
        setUserClaims([...userClaims, ...nodes.map((node) => node.node)])
      }
    },
  })

  if (loadingData) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (errorData) {
    return <Oopsies title={words.anErrorOccured} message={errorData?.message || ''} icon="🤕" />
  } else if (claimsData?.userClaims?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={claimsData?.userClaims?.error?.message || ''} icon="🤕" />
  }

  // Here we kinda coalesce the response into a predictable type
  const { edges, pageInfo } = (claimsData?.userClaims as UserClaimsResponseSuccess) || {}

  const handleMore = () => {
    // fetchs another batch of claims
    setLastCreatedAt(pageInfo.endCursor || null)
  }
  console.log(profileData)
  console.log(edges)
  return (
    <$PublicProfilePageContainer>
      <$Horizontal justifyContent="space-between">
        <$ProfileImage src="https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg" />
        <$Vertical justifyContent="flex-start" spacing={2} style={{ marginLeft: '20px', alignItems: 'center' }}>
          <$InviteButton>INVITE</$InviteButton>
          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
            Extra tickets for each friend invited
          </span>
        </$Vertical>
      </$Horizontal>
      <$Vertical style={{ marginTop: '10px' }}>
        <$Horizontal alignItems="center">
          <b style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>User34535</b>
          <a href="" style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            {`[Edit]`}
          </a>
        </$Horizontal>
        <span style={{ fontWeight: 'lighter', color: 'rgba(0,0,0,0.7)', margin: '10px 0px 30px 0px' }}>
          Lorem ipsum dolar discarate simpar fiat nolan compare. Innocent lamar descartes.
        </span>
      </$Vertical>

      <span
        style={{
          color: screen === 'desktop' ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.7)',
          fontWeight: screen === 'desktop' ? 'bold' : 'normal',
        }}
      >
        Claimed Lottery Tickets
      </span>
      <$ClaimsGrid>
        {edges.map((edge) => {
          return (
            <a href="" target="_blank">
              <$ClaimCard key={edge.node.id}>
                <img
                  src={edge.node?.chosenPartyBasket?.lootboxSnapshot?.image}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </$ClaimCard>
            </a>
          )
        })}
        <$ClaimCard onClick={() => console.log('Invite Friend')}>
          <$InviteFriend>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: screen === 'desktop' ? '5rem' : '2.5rem',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              +
            </span>
            <span
              style={{
                fontWeight: 'normal',
                fontSize: screen === 'desktop' ? '1.3rem' : '1rem',
                textAlign: 'center',
                color: 'rgba(0,0,0,0.7)',
              }}
            >
              Invite Friend
            </span>
            <span
              style={{
                fontWeight: 'lighter',
                fontSize: screen === 'desktop' ? '0.8rem' : '0.6rem',
                textAlign: 'center',
                color: 'rgba(0,0,0,0.7)',
                marginTop: '5px',
              }}
            >
              Both get a bonus FREE Lottery Ticket
            </span>
          </$InviteFriend>
        </$ClaimCard>
      </$ClaimsGrid>
      {/* <button onClick={handleMore}>load more (intl me)</button> */}
    </$PublicProfilePageContainer>
  )
}

const PublicProfilePage = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
    }
    load()
  }, [])

  const userId = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_PublicProfilePage()
    return INITIAL_URL_PARAMS.userId
  }, [])

  if (!userId) {
    return <>No uid url param (intl me)</>
  }

  return <PublicProfile userId={userId as UserID} />
}

const $PublicProfilePageContainer = styled.div`
  font-family: sans-serif;
  padding: 10px;
`

const $ClaimsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  margin-top: 10px;
`

const $ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 70px;
  min-width: 70px;
  min-height: 70px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
`

const $ClaimCard = styled.div`
  flex: 1;
  width: 100%;
  cursor: pointer;
`

const $InviteFriend = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-color: rgba(225, 225, 225, 0.2);
  border-style: dashed;
  padding: 10px 0px 10px 0px;
`

const $InviteButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  border: 0px solid white;
`

export default PublicProfilePage
