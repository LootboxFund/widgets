import { $SocialLogo, LootboxPartyBasket, $BattlePageSection, $BattleCardsContainer, $BattleCardImage } from './index'
import { useQuery } from '@apollo/client'
import {
  COLORS,
  ContractAddress,
  LootboxStatus_Firestore,
  LootboxTournamentStatus_Firestore,
  TYPOGRAPHY,
} from '@wormgraph/helpers'
import {
  LootboxTournamentSnapshot,
  PartyBasketStatus,
  LootboxStatus,
  LootboxTournamentStatus,
} from 'lib/api/graphql/generated/types'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import { $h1, $h2, $h3, $Horizontal, $p, $span, $Vertical } from '../Generics'
import { $Link, Oopsies } from '../Profile/common'
import { getSocials, TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import $Button from '../Generics/Button'
import { manifest } from 'manifest'
import { getSocialUrlLink, SocialType } from 'lib/utils/socials'
import { useState } from 'react'
import { PartyBasketID, TournamentID } from '@wormgraph/helpers'
import CreateLootboxReferral from 'lib/components/Referral/CreateLootboxReferral'
import AuthGuard from '../AuthGuard'
import Modal from 'react-modal'
import { BattlePageLootboxSnapshotFE } from './api.gql'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

interface Props {
  lootboxSnapshot: BattlePageLootboxSnapshotFE
  tournamentId: TournamentID
}

const BattlePageLootbox = (props: Props) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

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
    },
  }

  const ClaimLotteryButton = () => {
    return (
      <$Vertical>
        <div style={{ textAlign: 'center' }}>
          <$Button
            screen={screen}
            onClick={
              () => {}
              //   props.lootboxSnapshot &&
              //   window.open(
              //     `${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.lootboxPartyBasket.partyBasket.address}`,
              //     '_blank'
              //   )
            }
            style={{
              textTransform: 'capitalize',
              color: props.lootboxSnapshot.lootbox ? `${COLORS.trustBackground}B0` : `rgba(154, 154, 154, 0.682)`,
              border: `1px solid ${props.lootboxSnapshot.lootbox ? `${COLORS.trustBackground}B0` : 'rgba(0,0,0,0.05)'}`,
              background: props.lootboxSnapshot.lootbox ? `rgba(0,0,0,0.02)` : `${COLORS.surpressedBackground}2e`,
              whiteSpace: 'nowrap',
              marginTop: '0.67em',
              fontWeight: 'ligher',
              width: '100%',
              cursor: props.lootboxSnapshot.lootbox ? 'pointer' : 'not-allowed',
              maxHeight: '50px',
              fontSize: '1.2rem',
            }}
          >
            <FormattedMessage
              id="battlePage.button.claimLottery2"
              defaultMessage="Claim lottery"
              description="Text prompting user to claim a lottery ticket"
            />
          </$Button>
        </div>
        {props.lootboxSnapshot?.lootbox?.nftBountyValue && (
          <$span
            style={{
              textTransform: 'capitalize',
              textAlign: 'center',
              paddingTop: '30px',
              color: COLORS.surpressedFontColor,
              fontSize: TYPOGRAPHY.fontSize.medium,
              lineHeight: TYPOGRAPHY.fontSize.large,
              fontFamily: TYPOGRAPHY.fontFamily.regular,
            }}
          >
            {words.win} {props.lootboxSnapshot.lootbox?.nftBountyValue}
          </$span>
        )}
      </$Vertical>
    )
  }

  const isInviteEnabled =
    !!props.lootboxSnapshot.lootbox &&
    props.lootboxSnapshot.lootbox?.status !== LootboxStatus.SoldOut &&
    props.lootboxSnapshot.lootbox?.status !== LootboxStatus.Disabled &&
    props.lootboxSnapshot.status !== LootboxTournamentStatus.Disabled

  return (
    <$BattlePageSection screen={screen}>
      <$Horizontal height="100%" width="100%" flexWrap={screen === 'mobile'} spacing={4}>
        <$Vertical spacing={2} style={screen === 'mobile' ? { margin: '0 auto' } : {}}>
          <$BattleCardsContainer
            screen={screen}
            width="220px"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <$BattleCardImage
              src={
                props.lootboxSnapshot.stampImage
                  ? convertFilenameToThumbnail(props.lootboxSnapshot.stampImage, 'md')
                  : TEMPLATE_LOOTBOX_STAMP
              }
              cardNumber={0}
              style={{ position: 'relative', maxWidth: '100%' }}
            />
            {/* {screen !== 'mobile' && <ClaimLotteryButton />} */}
          </$BattleCardsContainer>

          {/* <span
              style={{
                textAlign: 'center',
                width: '90%',
                paddingBottom: screen === 'mobile' ? '12px' : 'auto',
              }}
            >
              🎁{' '}
              <$Link
                href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${props.lootboxPartyBasket.lootbox.address}`}
                style={{
                  color: `${COLORS.surpressedFontColor}ce`,
                  textDecoration: 'none',
                }}
                target="_blank"
              >
                {words.buyLootbox}
              </$Link>
            </span> */}
        </$Vertical>
        <$Vertical height="100%" width="100%" spacing={2}>
          <$Horizontal justifyContent="space-between" flexWrap={screen !== 'desktop'} spacing={2}>
            <$Vertical width={screen === 'mobile' ? '100%' : '65%'} style={{ flex: 2 }}>
              <$h1
                style={{
                  marginBottom: '0',
                  marginTop: screen === 'mobile' ? '35px' : undefined,
                }}
              >
                {props?.lootboxSnapshot?.lootbox?.name || ''}
              </$h1>
              <$p style={{ color: COLORS.black }}>
                {props.lootboxSnapshot?.lootbox?.description &&
                props.lootboxSnapshot?.lootbox?.description?.length > 250
                  ? props.lootboxSnapshot?.lootbox?.description.slice(0, 250) + '...'
                  : props.lootboxSnapshot?.lootbox?.description
                  ? props.lootboxSnapshot?.lootbox?.description
                  : ''}
              </$p>
              <$Horizontal flexWrap justifyContent={'flex-start'}>
                {props.lootboxSnapshot?.lootbox?.joinCommunityUrl && (
                  <$span style={{ margin: '10px 10px 10px 0px' }}>
                    <$Link
                      color={'inherit'}
                      href={props.lootboxSnapshot?.lootbox.joinCommunityUrl}
                      style={{ textDecoration: 'none' }}
                    >
                      👉 Join Community
                    </$Link>
                  </$span>
                )}
                {props.lootboxSnapshot?.address && (
                  <$span style={{ margin: '10px 10px 10px 0px' }}>
                    <$Link
                      color={'inherit'}
                      href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${props.lootboxSnapshot.address}`}
                      style={{ textDecoration: 'none' }}
                    >
                      👉 View Lootbox
                    </$Link>
                  </$span>
                )}
              </$Horizontal>
            </$Vertical>
            <$Vertical
              style={{
                margin: screen === 'mobile' ? '0 auto' : 'unset',
              }}
              width={screen === 'mobile' ? '100%' : '35%'}
              minWidth={screen !== 'desktop' ? '175px' : 'unset'}
            >
              {/* {screen === 'mobile' && <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />} */}
              <div>
                <$Button
                  screen={screen}
                  onClick={() => isInviteEnabled && setIsInviteModalOpen(true)}
                  style={{
                    textTransform: 'capitalize',
                    color: COLORS.trustFontColor,
                    background: isInviteEnabled ? COLORS.trustBackground : `${COLORS.surpressedBackground}ae`,
                    whiteSpace: 'nowrap',
                    marginTop: '0.67em',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    cursor: isInviteEnabled ? 'pointer' : 'not-allowed',
                    width: '100%',
                  }}
                >
                  {words.inviteFriend}
                </$Button>
                {/* <p
                    style={{
                      color: COLORS.surpressedFontColor,
                      textAlign: 'center',
                      marginTop: '10px',
                      fontSize: TYPOGRAPHY.fontSize.medium,
                      lineHeight: TYPOGRAPHY.fontSize.large,
                      fontFamily: TYPOGRAPHY.fontFamily.regular,
                    }}
                  >
                    <FormattedMessage
                      id="battlePage.button.inviteFriendRewardPrompt"
                      defaultMessage="Both get a FREE lottery ticket"
                      description="Text prompting user on why they should invite a friend"
                    />
                  </p> */}
                <ClaimLotteryButton />
              </div>
            </$Vertical>
          </$Horizontal>
          {/* {screen !== 'mobile' && <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />} */}
        </$Vertical>
      </$Horizontal>
      <Modal
        isOpen={isInviteModalOpen}
        onRequestClose={() => setIsInviteModalOpen(false)}
        contentLabel="Invite Link Modal"
        style={customStyles}
      >
        <$Horizontal width="100%" justifyContent="space-between">
          <span style={{ fontWeight: 'bold' }}></span>
          <span onClick={() => setIsInviteModalOpen(false)} style={{ cursor: 'pointer' }}>
            X
          </span>
        </$Horizontal>
        <br />
        <AuthGuard>
          <CreateLootboxReferral
            lootboxID={props.lootboxSnapshot.lootboxID}
            tournamentId={props.tournamentId}
            qrcodeMargin={'0px -40px'}
          />
        </AuthGuard>
        {/* {!props.lootboxSnapshot.partyBasket?.id && <Oopsies title={words.anErrorOccured} icon="🤕" />}
        {props.lootboxPartyBasket.partyBasket?.id && (
          <AuthGuard>
            <CreatePartyBasketReferral
              partyBasketId={props.lootboxPartyBasket.partyBasket.id as PartyBasketID}
              tournamentId={props.tournamentId}
              qrcodeMargin={'0px -40px'}
            />
          </AuthGuard>
        )} */}
      </Modal>
    </$BattlePageSection>
  )
}

export default BattlePageLootbox
