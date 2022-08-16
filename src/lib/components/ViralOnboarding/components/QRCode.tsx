import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  background1,
  $Heading,
  $GiantHeading,
  $SubHeading,
  $SupressedParagraph,
  $NextButton,
  $TournamentStampPreviewContainer,
  $TournamentStampPreviewImage,
  $SmallText,
} from '../contants'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { Referral } from 'lib/api/graphql/generated/types'
import QRCodeComponent from 'easyqrcodejs'
import { useEffect } from 'react'
import { manifest } from 'manifest'

interface Props {
  referral: Referral
}
const QRCode = (props: Props) => {
  const intl = useIntl()
  const words = useWords()

  useEffect(() => {
    const link = `${manifest.microfrontends.webflow.referral}?r=${props.referral.slug}`
    var options_object = {
      // ====== Basic
      text: link,
      width: 120,
      height: 120,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCodeComponent.CorrectLevel.H, // L, M, Q, <H></H>
      quietZone: 12,
      /*
        title: 'QR Title', // content 
        
        titleColor: "#004284", // color. default is "#000"
        titleBackgroundColor: "#fff", // background color. default is "#fff"
        titleHeight: 70, // height, including subTitle. default is 0
        titleTop: 25, // draws y coordinates. default is 30
    */
    }
    const el = document.getElementById('qrcode')
    if (el) {
      if (el.firstChild) {
        el.removeChild(el.firstChild)
      }
      new QRCodeComponent(el, options_object)
    }
  }, [props.referral])

  const LootboxSnapshots = () => {
    const seedLootboxAddress = props.referral?.seedPartyBasket?.lootboxAddress
    let showCasedLootboxImages: string[]
    if (props.referral?.tournament?.lootboxSnapshots && props.referral?.tournament?.lootboxSnapshots?.length > 0) {
      const showcased = seedLootboxAddress
        ? props.referral.tournament.lootboxSnapshots.find((snap) => snap.address === seedLootboxAddress)
        : undefined
      const secondary = seedLootboxAddress
        ? props.referral.tournament.lootboxSnapshots.find((snap) => snap.address !== seedLootboxAddress)
        : undefined
      showCasedLootboxImages = showcased
        ? [showcased.stampImage, secondary?.stampImage || TEMPLATE_LOOTBOX_STAMP]
        : [...props.referral.tournament.lootboxSnapshots.map((snap) => snap.stampImage)]
    } else {
      showCasedLootboxImages = [TEMPLATE_LOOTBOX_STAMP, TEMPLATE_LOOTBOX_STAMP]
    }

    return (
      <$TournamentStampPreviewContainer style={{ marginLeft: '30%', padding: '2rem 0px', boxSizing: 'content-box' }}>
        {showCasedLootboxImages.slice(0, 2).map((img, idx) => (
          <$TournamentStampPreviewImage key={`tournament-${idx}`} src={img} cardNumber={idx as 0 | 1} />
        ))}
      </$TournamentStampPreviewContainer>
    )
  }
  const defaultWinText = intl.formatMessage({
    id: 'viralOnboarding.acceptGift.winAFreeNFT',
    defaultMessage: 'Win a Free NFT',
    description: 'Prize message to win a free Lootbox NFT',
  })

  const formattedDate: string = props.referral?.tournament?.tournamentDate
    ? new Date(props.referral.tournament.tournamentDate).toDateString()
    : words.tournament

  const renderQRCode = () => {
    return <div id="qrcode" style={{ margin: 'auto' }} />
  }

  const shortlink = `${manifest.microfrontends.webflow.referral}?r=${props.referral.slug}`.replace('https://www.', '')

  return (
    <$ViralOnboardingCard background={background1}>
      <$ViralOnboardingSafeArea>
        <$Vertical>
          <$SupressedParagraph>
            <FormattedMessage
              id="viralOnboarding.qrcode.screenshotAndShare"
              defaultMessage="Screenshot & Share"
              description="Message to show user to screen shot a picture & share w friends"
            />
          </$SupressedParagraph>
          <LootboxSnapshots />
          <$GiantHeading>{props.referral?.seedPartyBasket?.nftBountyValue || defaultWinText}</$GiantHeading>
          <$SubHeading>
            <FormattedMessage
              id="viralOnboarding.qrcode.description"
              defaultMessage="Scan QR Code to accept a FREE Fan Lottery Ticket for an ESports Tournament."
            />
          </$SubHeading>
          <$SubHeading>🔒 {shortlink}</$SubHeading>
          <br />
          {renderQRCode()}
          <br />
          <$SmallText style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
            {words.event}:
            <$SmallText style={{ display: 'inline' }}>
              {' '}
              {props.referral.tournament?.title || 'ESports Tournament'}
            </$SmallText>
          </$SmallText>

          <$SmallText style={{ marginTop: '0px', fontWeight: TYPOGRAPHY.fontWeight.bold }}>
            {words.date}:<$SmallText style={{ marginTop: '0px', display: 'inline' }}> {formattedDate}</$SmallText>
          </$SmallText>
        </$Vertical>
      </$ViralOnboardingSafeArea>
    </$ViralOnboardingCard>
  )
}

export default QRCode
