import { useQuery } from '@apollo/client'
import { COLORS } from '@wormgraph/helpers'
import { ResponseError } from 'lib/api/graphql/generated/types'
import useWords from 'lib/hooks/useWords'
import { UserID } from 'lib/types'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Spinner from '../Generics/Spinner'
import { Oopsies } from '../Profile/common'
import {
  PublicUserClaimsGQLArgs,
  PUBLIC_USER,
  PublicUserFEClaims,
  PUBLIC_USER_CLAIMS,
  PublicUserLotteriesFE,
} from './api.gql'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { FormattedMessage, useIntl } from 'react-intl'
import Modal from 'react-modal'
import AuthGuard from '../AuthGuard'
import CreatePartyBasketReferral from '../Referral/CreatePartyBasketReferral'
import { manifest } from 'manifest'

interface MyLotteryTicketsProps {
  userId: UserID
  onLookupComplete?: (claims: PublicUserFEClaims[]) => void
}
const UserLotteryTickets = (props: MyLotteryTicketsProps) => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [searchString, setSearchString] = useState('')
  const [lastClaimCreatedAt, setLastClaimCreatedAt] = useState<undefined | string>(undefined)
  const [userClaims, setUserClaims] = useState<PublicUserFEClaims[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()
  const {
    data: userData,
    loading: loadingData,
    error: errorData,
  } = useQuery<{ publicUser: ResponseError | PublicUserLotteriesFE }, PublicUserClaimsGQLArgs>(PUBLIC_USER_CLAIMS, {
    variables: { publicUserId: props.userId, first: 7, after: lastClaimCreatedAt },
    onCompleted: (userData) => {
      if (userData?.publicUser?.__typename === 'PublicUserResponseSuccess') {
        const nodes = userData?.publicUser?.user?.claims?.edges
        const newClaims = [...userClaims, ...(nodes ? nodes.map((node) => node.node) : [])]
        setUserClaims(newClaims)
        props.onLookupComplete && props.onLookupComplete(newClaims)
      }
    },
  })
  const inviteFriendText = intl.formatMessage({
    id: 'profile.public.inviteFriends',
    defaultMessage: 'Invite Friend',
    description: 'Button to invite friend',
  })
  const bonusTicketText = intl.formatMessage({
    id: 'profile.public.bothGetBonusTickets',
    defaultMessage: 'Both get bonus FREE Lottery Tickets',
    description: 'Reward caption for inviting friend',
  })

  const customStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px',
      inset: screen === 'mobile' ? '10px' : '60px',
      maxWidth: '500px',
      margin: 'auto',
      maxHeight: '800px',
      fontFamily: 'sans-serif',
    },
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 10000,
    },
  }

  if (errorData) {
    return <Oopsies title={words.anErrorOccured} message={errorData?.message || ''} icon="🤕" />
  } else if (userData?.publicUser?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={userData?.publicUser?.error?.message || ''} icon="🤕" />
  }

  // Here we kinda coalesce the response into a predictable type
  const { pageInfo } = (userData?.publicUser as PublicUserLotteriesFE)?.user?.claims || {}

  const handleMore = () => {
    // fetchs another batch of claims
    setLastClaimCreatedAt(pageInfo.endCursor || undefined)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <$Vertical>
      <$Vertical>
        <$Horizontal>
          <span
            style={{
              color: screen === 'desktop' ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.7)',
              fontWeight: screen === 'desktop' ? 'bold' : 'normal',
            }}
          >
            <FormattedMessage
              id="profile.public.userLotteryTicketsLabel"
              defaultMessage="My Lottery Tickets"
              description="Label for list of lottery tickets"
            />
          </span>
          <HelpIcon tipID="userLotteryTicketTip" />
          <ReactTooltip id="userLotteryTicketTip" place="right" effect="solid">
            <FormattedMessage
              id="profile.public.userLotteryTicketsTip"
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
          <$InviteFriend screen={screen} onClick={() => setIsModalOpen(true)}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: screen === 'desktop' ? '5rem' : '2.5rem',
                lineHeight: screen === 'desktop' ? '5rem' : '2.5rem',
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
              {inviteFriendText}
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
              {bonusTicketText}
            </span>
          </$InviteFriend>
        </$ClaimCard>
        {userClaims &&
          userClaims
            .filter(
              (claim) =>
                (claim.chosenPartyBasket?.name.toLowerCase().indexOf(searchString.toLowerCase()) as number) > -1 ||
                ((claim.chosenPartyBasket?.lootboxSnapshot.name || '')
                  .toLowerCase()
                  .indexOf(searchString.toLowerCase()) as number) > -1
            )
            .map((claim) => {
              return (
                <a
                  href={`${manifest.microfrontends.webflow.basketRedeemPage}?basket=${claim.chosenPartyBasket.address}`}
                  target="_blank"
                >
                  <$ClaimCard key={claim.id}>
                    <img
                      src={claim?.chosenPartyBasket?.lootboxSnapshot?.stampImage || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </$ClaimCard>
                </a>
              )
            })}

        {loadingData && <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="auto" />}
      </$ClaimsGrid>
      {pageInfo?.hasNextPage && (
        <$Horizontal justifyContent="center">
          <$MoreButton onClick={handleMore} style={{ marginTop: '20px' }}>
            {words.seeMore}
          </$MoreButton>
        </$Horizontal>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Stream Selection Modal"
        style={customStyles}
      >
        <$Horizontal
          justifyContent="flex-end"
          style={{ fontFamily: 'sans-serif', width: '100%', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span onClick={closeModal}>X</span>
        </$Horizontal>
        {!!userClaims && !!userClaims[0] && (
          <AuthGuard>
            <CreatePartyBasketReferral
              partyBasketId={userClaims[0].chosenPartyBasket.id}
              tournamentId={userClaims[0].tournamentId}
              qrcodeMargin={'0px -40px'}
            />
          </AuthGuard>
        )}
      </Modal>
    </$Vertical>
  )
}

const $PublicProfilePageContainer = styled.div<{ screen: ScreenSize }>`
  font-family: sans-serif;
  padding: ${(props) => (props.screen === 'mobile' ? '5px' : '10px')};
  max-width: 600px;
  margin: 0 auto;
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

const $InviteFriend = styled.div<{ screen: ScreenSize }>`
  width: auto;
  height: 90%;
  min-height: ${(props) => (props.screen === 'mobile' ? '180px' : '220px')};
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

const $MoreButton = styled.button`
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

export default UserLotteryTickets
