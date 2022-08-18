import { useQuery } from '@apollo/client'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
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
import { useLocalStorage } from 'lib/hooks/useLocalStorage'

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
  const [chosenClaim, setChosenClaim] = useState<PublicUserFEClaims>()
  const [notificationClaims, setNotificationClaims] = useLocalStorage<string[]>('notification_claims', [])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: userData,
    loading: loadingData,
    error: errorData,
  } = useQuery<{ publicUser: ResponseError | PublicUserLotteriesFE }, PublicUserClaimsGQLArgs>(PUBLIC_USER_CLAIMS, {
    variables: { publicUserId: props.userId, first: 8, after: lastClaimCreatedAt },
    onCompleted: (userData) => {
      if (userData?.publicUser?.__typename === 'PublicUserResponseSuccess') {
        const nodes = userData?.publicUser?.user?.claims?.edges
        const newClaims = [...userClaims, ...(nodes ? nodes.map((node) => node.node) : [])]
        setUserClaims(newClaims)
        props.onLookupComplete && props.onLookupComplete(newClaims)
      }
    },
  })

  useEffect(() => {
    if (chosenClaim) {
      setIsModalOpen(true)
    }
  }, [chosenClaim])

  const removeClaimNotification = (claimId: string) => {
    const filteredClaims = notificationClaims.filter((claim) => claim !== claimId)
    setNotificationClaims(filteredClaims)
  }

  // const bonusTicketText = intl.formatMessage({
  //   id: 'profile.public.bothGetBonusTickets',
  //   defaultMessage: 'Both get bonus FREE Lottery Tickets',
  //   description: 'Reward caption for inviting friend',
  // })

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
    setChosenClaim(undefined)
  }

  const handleButtonToggle = (elId: string) => {
    const el = document.getElementById(elId)
    const el2 = document.getElementById(`btn${elId}`)
    try {
      const els = document.getElementsByClassName('dd-container') as HTMLCollectionOf<HTMLElement>
      for (let i = 0; i < els.length; i++) {
        if (els[i] !== el) {
          els[i].style.display = 'none'
        }
      }
    } catch (err) {
      console.error(err)
    }

    try {
      if (el) {
        if (el.style.display === 'block') {
          el.style.display = 'none'
          if (el2) {
            el2.innerText = '︙'
          }
        } else {
          el.style.display = 'block'
          if (el2) {
            el2.innerText = '−'
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
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
        {/* <$ClaimCard onClick={() => console.log('Invite Friend')}>
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
              {words.inviteFriend}
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
        </$ClaimCard> */}
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
              const elId = `dropdown${claim.id}`
              const isNotifReq = notificationClaims.indexOf(claim.id) > -1
              const joinNotif = isNotifReq && !!claim?.chosenPartyBasket?.joinCommunityUrl
              const isNotif = !!joinNotif
              return (
                <$ClaimCard key={claim.id}>
                  <a
                    href={`${manifest.microfrontends.webflow.basketRedeemPage}?basket=${claim.chosenPartyBasket.address}`}
                    target="_blank"
                    style={{ display: 'block', cursor: 'pointer' }}
                  >
                    <img
                      src={claim?.chosenPartyBasket?.lootboxSnapshot?.stampImage || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        paddingBottom: '5px',
                        // filter: 'drop-shadow(rgba(0, 178, 255, 0.5) 0px 4px 30px)',
                        // boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
                      }}
                    />
                  </a>
                  <$Vertical
                    width="100%"
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <$Horizontal
                      width="100%"
                      style={{
                        // filter: 'drop-shadow(rgba(0, 178, 255, 0.5) 0px 4px 30px)',
                        // boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
                        boxShadow: `0px 3px 4px ${COLORS.surpressedBackground}aa`,
                        borderRadius: '6px',
                      }}
                    >
                      <$ActionsButton onClick={() => setChosenClaim(claim)}>{words.inviteFriend}</$ActionsButton>
                      <$ActionsMenuButton onClick={(e) => handleButtonToggle(elId)}>
                        {isNotif && <$ButtonBadge />}
                        <div id={`btn${elId}`}>︙</div>
                      </$ActionsMenuButton>
                    </$Horizontal>
                    <$DropDownContainer id={elId} className="dd-container">
                      <$Vertical>
                        {claim?.chosenPartyBasket?.joinCommunityUrl ? (
                          <$DropDownOption
                            href={claim.chosenPartyBasket.joinCommunityUrl}
                            target="_blank"
                            style={{ borderRadius: '10px 10px 0px 0px' }}
                            onClick={() => {
                              removeClaimNotification(claim.id)
                            }}
                          >
                            <FormattedMessage id="profile.public.joinCommunity" defaultMessage="Join Community" />
                            {joinNotif && <$ButtonBadge inline />}
                          </$DropDownOption>
                        ) : null}

                        <$DropDownOption
                          href={`${manifest.microfrontends.webflow.battlePage}?tournament=${claim.tournamentId}`}
                          target="_blank"
                        >
                          <FormattedMessage id="profile.public.watchStream" defaultMessage="Watch Stream" />{' '}
                        </$DropDownOption>
                        <$DropDownOption
                          href={`${manifest.microfrontends.webflow.tournamentPublicPage}?tid=${claim.tournamentId}`}
                          target="_blank"
                        >
                          <FormattedMessage id="profile.public.eventDetails" defaultMessage="Event Details" />
                        </$DropDownOption>

                        <$DropDownOption
                          href={`${manifest.microfrontends.webflow.basketRedeemPage}?basket=${claim.chosenPartyBasket.address}`}
                          target="_blank"
                          style={{ borderRadius: '0px 0px 10px 10px' }}
                        >
                          {words.redeemNFTText}
                        </$DropDownOption>
                        {/* <$DropDownOption href="#" style={{ borderRadius: '0px 0px 10px 10px' }}>
                          <FormattedMessage id="profile.public.viewLootbox" defaultMessage="View Lootbox" />
                        </$DropDownOption> */}
                      </$Vertical>
                    </$DropDownContainer>
                  </$Vertical>
                </$ClaimCard>
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
              partyBasketId={
                chosenClaim != undefined ? chosenClaim.chosenPartyBasket.id : userClaims[0].chosenPartyBasket.id
              }
              tournamentId={chosenClaim != undefined ? chosenClaim.tournamentId : userClaims[0].tournamentId}
              qrcodeMargin={'0px -40px'}
            />
          </AuthGuard>
        )}
      </Modal>
    </$Vertical>
  )
}

const $ActionsButton = styled.button`
  width: 100%;
  height: 40px;
  max-width: 200px;
  padding: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px 0px 0px 6px;
  background-color: ${COLORS.trustBackground};
  color: ${COLORS.white};
  border: 0px solid white;
  text-transform: capitalize;
`

const $ActionsMenuButton = styled.button`
  width: 30px;
  height: 40px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 0px 6px 6px 0px;
  background-color: ${COLORS.trustBackground}ba;
  color: ${COLORS.white};
  border: 0px solid white;
  position: relative;
`

/* Make the badge float in the top right corner of the button */
const $ButtonBadge = styled.div<{ inline?: boolean }>`
  background-color: #fa3e3e;
  color: white;
  border-radius: 100px;
  width: 12px;
  height: 12px;
  position: absolute; /* Position the badge within the relatively positioned button */
  top: -3px;
  right: -5px;
  ${(props) =>
    props.inline &&
    `position: relative;
  display: inline-block;`}
`

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

const $DropDownContainer = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 1;
  // background-color: ${COLORS.trustBackground};
`

const $DropDownOption = styled.a`
  height: 40px;
  padding: 2px 10px;
  border-bottom: 1px lightblue solid;
  line-height: 40px;
  background-color: ${COLORS.trustBackground}ba;
  color: ${COLORS.white};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  text-decoration: none;
`

export default UserLotteryTickets
