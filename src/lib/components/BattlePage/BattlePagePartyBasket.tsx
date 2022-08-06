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
      </$Vertical>
    )
  }

  const ReferralLinkGeneration = ({ partyBasketId }: { partyBasketId: PartyBasketID }) => {
    return (
      <$Vertical spacing={4}>
        <span
          style={{
            width: '90%',
            paddingBottom: screen === 'mobile' ? '12px' : 'auto',
          }}
        >
          ⭐️{' '}
          <$Link
            onClick={() => setIsCreateReferralLinkOpen(!isCreateReferralLinkOpen)}
            style={{
              color: `${COLORS.surpressedFontColor}ce`,
              textDecoration: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.bold,
            }}
          >
            <FormattedMessage
              id="battlePagePartyBasket.referralLinkToggle.text"
              defaultMessage="Promote this Lootbox"
            />
          </$Link>
        </span>
        {isCreateReferralLinkOpen && (
          <AuthGuard>
            <CreatePartyBasketReferral partyBasketId={partyBasketId} tournamentId={props.tournamentId} />
          </AuthGuard>
        )}
      </$Vertical>
    )
  }

  return (
    <$BattlePageSection screen={screen}>
      <$Horizontal height="100%" width="100%" flexWrap={screen === 'mobile'} spacing={2}>
        <$Vertical spacing={2} style={{ margin: '0 auto' }}>
          <$BattleCardsContainer screen={screen} width="220px">
            <$BattleCardImage src={props.lootboxPartyBasket.lootbox?.stampImage} cardNumber={0} />
          </$BattleCardsContainer>
          <span
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
          </span>
        </$Vertical>
        <$Vertical height="100%" width="100%" spacing={2}>
          <$Horizontal justifyContent="space-between" flexWrap={screen !== 'desktop'} spacing={2}>
            <$Vertical width={screen === 'mobile' ? '100%' : 'auto'}>
              <$h1 style={{ marginBottom: '0', textAlign: screen === 'mobile' ? 'center' : 'left' }}>
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
            >
              <div>
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
                    color: COLORS.trustFontColor,
                    background: props.lootboxPartyBasket.partyBasket
                      ? COLORS.trustBackground
                      : `${COLORS.surpressedBackground}ae`,
                    whiteSpace: 'nowrap',
                    marginTop: '0.67em',
                    cursor: props.lootboxPartyBasket.partyBasket ? 'pointer' : 'not-allowed',
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
                    color: COLORS.black,
                    textAlign: 'center',
                    paddingTop: '10px',
                  }}
                >
                  {words.win} {props.lootboxPartyBasket.partyBasket.nftBountyValue}
                </$span>
              )}
            </$Vertical>
          </$Horizontal>
          <Socials lootboxSnapshot={props.lootboxPartyBasket.lootbox} />

          {!!props.lootboxPartyBasket?.partyBasket?.id && (
            <ReferralLinkGeneration partyBasketId={props.lootboxPartyBasket.partyBasket.id as PartyBasketID} />
          )}
        </$Vertical>
      </$Horizontal>
    </$BattlePageSection>
  )
}

export default BattlePagePartyBasket
