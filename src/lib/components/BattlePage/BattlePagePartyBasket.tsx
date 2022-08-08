import { $SocialLogo, LootboxPartyBasket, $BattlePageSection, $BattleCardsContainer, $BattleCardImage } from './index'
import { useQuery } from '@apollo/client'
import { COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { LootboxTournamentSnapshot } from 'lib/api/graphql/generated/types'
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
import { PartyBasketID, TournamentID } from 'lib/types'
import CreatePartyBasketReferral from 'lib/components/Referral/CreatePartyBasketReferral'
import AuthGuard from '../AuthGuard'
import Modal from 'react-modal'

interface Props {
  lootboxPartyBasket: LootboxPartyBasket
  tournamentId: TournamentID
}
const BattlePagePartyBasket = (props: Props) => {
  const intl = useIntl()
  const words = useWords()
  const { screen } = useWindowSize()
  const SOCIALS = getSocials(intl)
  const [isCreateReferralLinkOpen, setIsCreateReferralLinkOpen] = useState(false)
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
      maxHeight: '500px',
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

  const Socials = ({ lootboxSnapshot }: { lootboxSnapshot: LootboxTournamentSnapshot }) => {
    const flatSocials = Object.entries(lootboxSnapshot.socials)
      .filter((fack) => fack[0] !== '__typename')
      .filter((fack) => !!fack[1]) // Filter graphql ting
    return (
      <$Vertical spacing={4} style={{ paddingTop: screen === 'mobile' ? '10px' : 'auto' }}>
        <$h3
          style={{
            textTransform: 'capitalize',
            color: COLORS.black,
            textAlign: screen === 'mobile' ? 'center' : 'left',
          }}
        >
          <FormattedMessage
            id="battlePage.socials.followSocials"
            defaultMessage="Follow socials"
            description="Text prompting user to follow social media"
          />
        </$h3>
        <$Horizontal flexWrap justifyContent="space-between">
          {flatSocials.map(([platform, value]) => {
            const socialData = SOCIALS.find((soc) => soc.slug === platform.toLowerCase())
            if (socialData) {
              const url = getSocialUrlLink(socialData.slug as SocialType, value as string)
              return (
                <$Horizontal
                  key={`${props.lootboxPartyBasket.lootbox.address}-${platform}`}
                  spacing={2}
                  style={{ paddingBottom: '10px' }}
                >
                  <$SocialLogo src={socialData.icon} />
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
                    <$span>{value}</$span>
                  </a>
                </$Horizontal>
              )
            } else {
              return null
            }
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
          <br />
          <br />
          {!props.lootboxPartyBasket.partyBasket?.id && <Oopsies title={words.anErrorOccured} icon="🤕" />}
          {props.lootboxPartyBasket.partyBasket?.id && (
            <AuthGuard>
              <CreatePartyBasketReferral
                partyBasketId={props.lootboxPartyBasket.partyBasket.id as PartyBasketID}
                tournamentId={props.tournamentId}
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
            color: props.lootboxPartyBasket.partyBasket ? `${COLORS.trustBackground}B0` : COLORS.white,
            border: `1px solid ${
              props.lootboxPartyBasket.partyBasket ? `${COLORS.trustBackground}B0` : 'rgba(0,0,0,0.05)'
            }`,
            background: props.lootboxPartyBasket.partyBasket ? `rgba(0,0,0,0.05)` : `${COLORS.surpressedBackground}ae`,
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
        {props.lootboxPartyBasket.partyBasket?.nftBountyValue && (
          <$span
            style={{
              textTransform: 'capitalize',
              color: COLORS.surpressedFontColor,
              textAlign: 'center',
              paddingTop: '10px',
            }}
          >
            {words.win} {props.lootboxPartyBasket.partyBasket.nftBountyValue}
          </$span>
        )}
      </$Vertical>
    )
  }

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
            {screen !== 'mobile' && <ClaimLotteryButton />}
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
                  textAlign: screen === 'mobile' ? 'center' : 'left',
                  marginTop: screen === 'mobile' ? '20px' : undefined,
                }}
              >
                {props.lootboxPartyBasket?.partyBasket?.name || props.lootboxPartyBasket?.lootbox?.name}
              </$h1>
              <$p style={{ color: COLORS.black, textAlign: screen === 'mobile' ? 'center' : 'left' }}>
                {props.lootboxPartyBasket?.lootbox?.description &&
                props.lootboxPartyBasket?.lootbox?.description?.length > 250
                  ? props.lootboxPartyBasket?.lootbox?.description.slice(0, 250) + '...'
                  : props.lootboxPartyBasket?.lootbox?.description
                  ? props.lootboxPartyBasket?.lootbox?.description
                  : ''}
              </$p>
            </$Vertical>
            <$Vertical
              style={{
                margin: screen === 'mobile' ? '0 auto' : 'unset',
              }}
              width={screen === 'mobile' ? '100%' : '35%'}
              minWidth={screen !== 'desktop' ? '175px' : 'unset'}
            >
              <div>
                <$Button
                  screen={screen}
                  onClick={() => props.lootboxPartyBasket?.partyBasket && setIsInviteModalOpen(true)}
                  style={{
                    textTransform: 'capitalize',
                    color: COLORS.trustFontColor,
                    background: props.lootboxPartyBasket.partyBasket
                      ? COLORS.trustBackground
                      : `${COLORS.surpressedBackground}ae`,
                    whiteSpace: 'nowrap',
                    marginTop: '0.67em',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    cursor: props.lootboxPartyBasket.partyBasket ? 'pointer' : 'not-allowed',
                  }}
                >
                  <FormattedMessage
                    id="battlePage.button.inviteFriend"
                    defaultMessage="Invite Friend"
                    description="Invite button on Party Basket on the Battle page"
                  />
                </$Button>
                <p style={{ color: COLORS.surpressedBackground, textAlign: 'center', marginTop: '10px' }}>
                  <FormattedMessage
                    id="battlePage.button.inviteFriendRewardPrompt"
                    defaultMessage="Both get a FREE lottery ticket"
                    description="Text prompting user on why they should invite a friend"
                  />
                </p>
                {screen === 'mobile' && <ClaimLotteryButton />}
              </div>
            </$Vertical>
          </$Horizontal>
          <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />
        </$Vertical>
      </$Horizontal>
    </$BattlePageSection>
  )
}

export default BattlePagePartyBasket
