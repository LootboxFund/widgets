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
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { FormattedMessage } from 'react-intl'

interface PublicProfileProps {
  userId: UserID
}
/**
 * @terran edit this component
 */
const PublicProfile = (props: PublicProfileProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [searchString, setSearchString] = useState('')
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
    variables: { userId: props.userId, first: 2, after: lastCreatedAt },
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
  return (
    <$PublicProfilePageContainer screen={screen}>
      <$Horizontal justifyContent="space-between">
        <$ProfileImage src="https://1.bp.blogspot.com/-W_7SWMP5Rag/YTuyV5XvtUI/AAAAAAAAuUQ/hm6bYcvlFgQqgv1uosog6K8y0dC9eglTQCLcBGAsYHQ/s880/Best-Profile-Pic-For-Boys%2B%25281%2529.jpg" />
        <$Vertical justifyContent="flex-start" spacing={2} style={{ marginLeft: '20px', alignItems: 'center' }}>
          <$InviteButton>
            <FormattedMessage
              id="profile.public.inviteFriends"
              defaultMessage="Invite Friend"
              description="Button to invite friend"
            />
          </$InviteButton>
          <span style={{ fontSize: '0.8rem', fontWeight: 200, color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
            <FormattedMessage
              id="profile.public.bothGetBonusTickets"
              defaultMessage="Both get a bonus FREE Lottery Ticket"
              description="Reward caption for inviting friend"
            />
          </span>
        </$Vertical>
      </$Horizontal>
      <$Vertical style={{ marginTop: '10px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: screen === 'mobile' ? 'column' : 'row',
          }}
        >
          <b style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>User34535</b>
          <span
            style={{
              margin: screen === 'mobile' ? '5px 0px' : '0px 10px',
              fontStyle: 'italic',
              fontSize: screen === 'mobile' ? '0.7rem' : '0.8rem',
            }}
          >
            <a href="" style={{ textDecoration: 'none' }}>
              <FormattedMessage
                id="profile.public.viewSocials"
                defaultMessage="View Socials"
                description="Public Profile Page link to view socials"
              />
            </a>
            <span>{` | `}</span>
            <a href="" style={{ textDecoration: 'none' }}>
              <FormattedMessage
                id="profile.public.editProfile"
                defaultMessage="Edit Profile"
                description="Public Profile Page link to edit profile"
              />
            </a>
          </span>
        </div>
        <span
          style={{
            fontWeight: 'lighter',
            color: 'rgba(0,0,0,0.7)',
            margin: '10px 0px 30px 0px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          Lorem ipsum dolar discarate simpar fiat nolan compare. Innocent lamar descartes.
        </span>
      </$Vertical>

      <$Vertical>
        <$Horizontal>
          <span
            style={{
              color: screen === 'desktop' ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.7)',
              fontWeight: screen === 'desktop' ? 'bold' : 'normal',
            }}
          >
            <FormattedMessage
              id="profile.public.myLotteryTicketsLabel"
              defaultMessage="My Lottery Tickets"
              description="Label for list of lottery tickets"
            />
          </span>
          <HelpIcon tipID="myLotteryTicketTip" />
          <ReactTooltip id="myLotteryTicketTip" place="right" effect="solid">
            <FormattedMessage
              id="profile.public.myLotteryTicketsTip"
              defaultMessage="Your list of lottery tickets are only claims - these are unverified tickets. The tournament host is responsible for verification and they have the final say on winners. Ask your tournament host for their list of verified tickets."
              description="Tooltip for my lottery tickets list on Public Profile Page"
            />
          </ReactTooltip>
        </$Horizontal>

        <input
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder={words.search}
          style={{
            width: '100%',
            height: '20px',
            maxWidth: '400px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid rgba(0,0,0,0.5)',
            margin: '5px 0px 5px 0px',
          }}
        ></input>
      </$Vertical>
      <$ClaimsGrid screen={screen}>
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
              <FormattedMessage
                id="profile.public.inviteFriends"
                defaultMessage="Invite Friend"
                description="Button to invite friend"
              />
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
              <FormattedMessage
                id="profile.public.bothGetBonusTickets"
                defaultMessage="Both get a bonus FREE Lottery Ticket"
                description="Reward caption for inviting friend"
              />
            </span>
          </$InviteFriend>
        </$ClaimCard>
        {edges
          .filter(
            (edge) =>
              (edge.node.chosenPartyBasket?.name.toLowerCase().indexOf(searchString.toLowerCase()) as number) > -1 ||
              (edge.node.chosenPartyBasket?.lootboxSnapshot?.name
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) as number) > -1
          )
          .map((edge) => {
            return (
              <a href="" target="_blank">
                <$ClaimCard key={edge.node.id}>
                  <img
                    src={edge.node?.chosenPartyBasket?.lootboxSnapshot?.stampImage || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </$ClaimCard>
              </a>
            )
          })}
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

const $PublicProfilePageContainer = styled.div<{ screen: ScreenSize }>`
  font-family: sans-serif;
  padding: ${(props) => (props.screen === 'mobile' ? '5px' : '10px')};
`

const $ClaimsGrid = styled.div<{ screen: ScreenSize }>`
  display: grid;
  grid-template-columns: ${(props) => {
    if (props.screen === 'desktop') return '1fr 1fr 1fr 1fr'
    else if (props.screen === 'tablet') return '1fr 1fr 1fr'
    else return '1fr 1fr'
  }};
  width: 100%;
  column-gap: 10px;
  row-gap: 10px;
  margin-top: 10px;
`

export const $ProfileImage = styled.img`
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
  height: 90%;
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
  text-transform: uppercase;
`

export default PublicProfilePage
