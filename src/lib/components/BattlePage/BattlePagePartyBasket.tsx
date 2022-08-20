import { $SocialLogo, LootboxPartyBasket, $BattlePageSection, $BattleCardsContainer, $BattleCardImage } from './index'
import { useQuery } from '@apollo/client'
import { COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { LootboxTournamentSnapshot, PartyBasketStatus } from 'lib/api/graphql/generated/types'
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
import { PartyBasketID, SocialFragment, TournamentID } from 'lib/types'
import CreatePartyBasketReferral from 'lib/components/Referral/CreatePartyBasketReferral'
import AuthGuard from '../AuthGuard'
import Modal from 'react-modal'
import { BattlePageLootboxSnapshotFE } from './api.gql'

interface Props {
  lootboxPartyBasket: LootboxPartyBasket
  tournamentId: TournamentID
}
const BattlePagePartyBasket = (props: Props) => {
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

  const Socials = ({ lootboxSnapshot }: { lootboxSnapshot: BattlePageLootboxSnapshotFE }) => {
    const flatSocials = Object.entries(lootboxSnapshot.socials)
      .filter((fack) => fack[0] !== '__typename')
      .filter((fack) => !!fack[1]) // Filter graphql ting

    const data: SocialFragment[] = flatSocials
      .map(([platform, value]) => {
        const socialData = SOCIALS.find((soc) => soc.slug === platform.toLowerCase())
        return socialData
      })
      .filter((d) => d != undefined) as SocialFragment[]

    if (data.length === 0) {
      return null
    }
    return (
      <$Vertical spacing={4} style={{ paddingTop: screen === 'mobile' ? '10px' : 'auto' }}>
        <$h3
          style={{
            textTransform: 'capitalize',
            color: COLORS.black,
          }}
        >
          <FormattedMessage
            id="battlePage.socials.followSocials"
            defaultMessage="Follow socials"
            description="Text prompting user to follow social media"
          />
        </$h3>
        <$Horizontal flexWrap justifyContent="flex-start">
          {data.map((social) => {
            const url = getSocialUrlLink(social.slug as SocialType, social.slug as string)
            return (
              <$Horizontal
                key={`${props.lootboxPartyBasket.lootbox.address}-${social.slug}`}
                spacing={2}
                style={{ paddingBottom: '10px' }}
              >
                <$SocialLogo src={social.icon} />
                <a
                  href={url}
                  style={{
                    width: '100px',
                    margin: 'auto 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: url ? 'pointer' : 'unset',
                    textDecoration: 'none',
                  }}
                >
                  <$span>{social.slug}</$span>
                </a>
              </$Horizontal>
            )
          })}
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
          {!props.lootboxPartyBasket.partyBasket?.id && <Oopsies title={words.anErrorOccured} icon="🤕" />}
          {props.lootboxPartyBasket.partyBasket?.id && (
            <AuthGuard>
              <CreatePartyBasketReferral
                partyBasketId={props.lootboxPartyBasket.partyBasket.id as PartyBasketID}
                tournamentId={props.tournamentId}
                qrcodeMargin={'0px -40px'}
              />
            </AuthGuard>
          )}
        </Modal>
      </$Vertical>
    )
  }

  const ClaimLotteryButton = () => {
    return (
      <$Vertical>
        <div style={{ textAlign: 'center' }}>
          <$Button
            screen={screen}
            onClick={() =>
              props.lootboxPartyBasket?.partyBasket &&
              window.open(
                `${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.lootboxPartyBasket.partyBasket.address}`,
                '_blank'
              )
            }
            style={{
              textTransform: 'capitalize',
              color: props.lootboxPartyBasket.partyBasket
                ? `${COLORS.trustBackground}B0`
                : `rgba(154, 154, 154, 0.682)`,
              border: `1px solid ${
                props.lootboxPartyBasket.partyBasket ? `${COLORS.trustBackground}B0` : 'rgba(0,0,0,0.05)'
              }`,
              background: props.lootboxPartyBasket.partyBasket
                ? `rgba(0,0,0,0.02)`
                : `${COLORS.surpressedBackground}2e`,
              whiteSpace: 'nowrap',
              marginTop: '0.67em',
              fontWeight: 'ligher',
              width: '100%',
              cursor: props.lootboxPartyBasket.partyBasket ? 'pointer' : 'not-allowed',
              maxHeight: '50px',
              fontSize: '1.2rem',
            }}
          >
            {props.lootboxPartyBasket.partyBasket ? (
              <FormattedMessage
                id="battlePage.button.claimLottery"
                defaultMessage="Claim lottery"
                description="Text prompting user to claim a lottery ticket"
              />
            ) : (
              <FormattedMessage
                id="battlePage.button.noneAvailable"
                defaultMessage="None available"
                description="Text indicating that something is not available"
              />
            )}
          </$Button>
        </div>
        {props.lootboxPartyBasket.partyBasket?.nftBountyValue && (
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
            {words.win} {props.lootboxPartyBasket.partyBasket.nftBountyValue}
          </$span>
        )}
      </$Vertical>
    )
  }

  const isInviteEnabled =
    !!props?.lootboxPartyBasket?.partyBasket &&
    props.lootboxPartyBasket.partyBasket?.status !== PartyBasketStatus.SoldOut &&
    props.lootboxPartyBasket.partyBasket?.status !== PartyBasketStatus.Disabled

  props.lootboxPartyBasket.partyBasket?.id && props.lootboxPartyBasket.partyBasket.id !== '0'

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
              src={props.lootboxPartyBasket.lootbox?.stampImage}
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
                {props.lootboxPartyBasket?.partyBasket?.name || props.lootboxPartyBasket?.lootbox?.name}
              </$h1>
              <$p style={{ color: COLORS.black }}>
                {props.lootboxPartyBasket?.lootbox?.description &&
                props.lootboxPartyBasket?.lootbox?.description?.length > 250
                  ? props.lootboxPartyBasket?.lootbox?.description.slice(0, 250) + '...'
                  : props.lootboxPartyBasket?.lootbox?.description
                  ? props.lootboxPartyBasket?.lootbox?.description
                  : ''}
              </$p>
              <$Horizontal flexWrap justifyContent={'flex-start'}>
                {props.lootboxPartyBasket?.partyBasket?.address && (
                  <$span style={{ margin: '10px 10px 10px 0px' }}>
                    <$Link
                      color={'inherit'}
                      href={`${manifest.microfrontends.webflow.basketRedeemPage}?basket=${props.lootboxPartyBasket?.partyBasket?.address}`}
                      style={{ textDecoration: 'none' }}
                    >
                      👉 Redeem
                    </$Link>
                  </$span>
                )}
                {props.lootboxPartyBasket?.lootbox?.address && (
                  <$span style={{ margin: '10px 10px 10px 0px' }}>
                    <$Link
                      color={'inherit'}
                      href={`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${props.lootboxPartyBasket?.lootbox?.address}`}
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
              {screen === 'mobile' && <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />}
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
          {screen !== 'mobile' && <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />}
        </$Vertical>
      </$Horizontal>
    </$BattlePageSection>
  )
}

export default BattlePagePartyBasket
