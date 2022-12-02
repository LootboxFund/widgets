import useWords from 'lib/hooks/useWords'
import { $Vertical, $ViralOnboardingCard, $ViralOnboardingSafeArea } from 'lib/components/Generics'
import { useViralOnboarding } from 'lib/hooks/useViralOnboarding'
import { useEffect, useState } from 'react'
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
} from '../contants'
import { COLORS, TournamentID } from '@wormgraph/helpers'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { useMutation } from '@apollo/client'
import { CreateClaimResponseFE, CREATE_CLAIM } from '../api.gql'
import { MutationCreateClaimArgs, ResponseError } from 'lib/api/graphql/generated/types'
import { ErrorCard } from './GenericCard'
import { LoadingText } from 'lib/components/Generics/Spinner'
import { convertFilenameToThumbnail } from 'lib/utils/storage'
import './OnePager.css'
import { detectMobileAddressBarSettings } from 'lib/api/helpers'

interface Props {
  onNext: () => void
  onBack: () => void
}
const AcceptGift = (props: Props) => {
  const { onNext } = props
  const intl = useIntl()
  const words = useWords()
  const { referral, setClaim } = useViralOnboarding()
  const [errorMessage, setErrorMessage] = useState<string>()
  useEffect(() => {
    startFlight()
  }, [])
  const [createClaim, { loading }] = useMutation<
    { createClaim: CreateClaimResponseFE | ResponseError },
    MutationCreateClaimArgs
  >(CREATE_CLAIM)
  const acceptGiftText = intl.formatMessage({
    id: 'viralOnboarding.acceptGift.next',
    defaultMessage: 'Accept Gift',
    description: 'Button to accept a gift',
  })

  const LootboxSnapshots = () => {
    const seedLootboxID = referral.seedLootboxID

    let showCasedLootboxImages: string[]
    if (referral?.tournament?.lootboxSnapshots && referral?.tournament?.lootboxSnapshots?.length > 0) {
      const showcased = seedLootboxID
        ? referral.tournament.lootboxSnapshots.find((snap) => snap.lootboxID === seedLootboxID)
        : undefined
      const secondary = seedLootboxID
        ? referral.tournament.lootboxSnapshots.find((snap) => snap.lootboxID !== seedLootboxID)
        : undefined
      showCasedLootboxImages = !!showcased?.stampImage
        ? [
            convertFilenameToThumbnail(showcased.stampImage, 'sm'),
            secondary?.stampImage ? convertFilenameToThumbnail(secondary.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP,
          ]
        : [
            ...referral.tournament.lootboxSnapshots.map((snap) =>
              snap.stampImage ? convertFilenameToThumbnail(snap.stampImage, 'sm') : TEMPLATE_LOOTBOX_STAMP
            ),
          ]
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

  const formattedDate: string = referral?.tournament?.tournamentDate
    ? new Date(referral.tournament.tournamentDate).toDateString()
    : words.tournament

  const startFlight = async () => {
    try {
      if (!referral?.slug) {
        console.error('No referral slug')
        throw new Error(words.anErrorOccured)
      }
      const { data } = await createClaim({
        variables: {
          payload: {
            referralSlug: referral?.slug,
          },
        },
      })

      if (
        !data?.createClaim ||
        data?.createClaim?.__typename === 'ResponseError' ||
        data?.createClaim?.__typename !== 'CreateClaimResponseSuccess'
      ) {
        throw new Error(words.anErrorOccured)
      }

      const claim = (data.createClaim as CreateClaimResponseFE).claim

      setClaim(claim)
    } catch (err) {
      console.error(err)
      setErrorMessage(err?.message || words.anErrorOccured)
    }
  }

  if (errorMessage) {
    return (
      <ErrorCard title={words.anErrorOccured} message={errorMessage} icon="🤕">
        <$SubHeading
          onClick={() => setErrorMessage(undefined)}
          style={{ fontStyle: 'italic', textTransform: 'lowercase' }}
        >
          {words.retry + '?'}
        </$SubHeading>
      </ErrorCard>
    )
  }
  const { userAgent, addressBarlocation, addressBarHeight } = detectMobileAddressBarSettings()
  return (
    <div
      className="viral-invite-loop-intro-slid"
      style={{
        maxHeight: screen.availHeight - addressBarHeight,
      }}
    >
      <div className="powered-by-banner" id="fan-rewards-banner">
        <div className="powered-by-banner-text">
          <span>Fan Rewards Powered by</span>
          <b>{` 🎁 `}</b>
          <span className="lootbox-span">LOOTBOX</span>
        </div>
      </div>
      <div className="main-layout-div">
        <div className="cover-info-div">
          <div className="host-logo-image">
            <img
              className="host-logo-icon"
              alt="event organizer logo"
              src="https://s2.coinmarketcap.com/static/img/coins/200x200/10688.png"
            />
          </div>
          <div className="main-info-text">
            <b className="main-heading-b">Win $5 Cash</b>
            <i className="social-proof-oneliner">28 people already accepted</i>
          </div>
        </div>
        <div className="email-input-div">
          <div className="frame-div">
            <input className="email-field-input" type="email" placeholder="enter your email" required autoFocus />
          </div>
          <div className="frame-div1">
            <div className="terms-and-conditions-checkbox">
              <input className="terms-and-conditions-input-che" type="checkbox" required />
              <a className="terms-and-conditions-fine-prin" href="https://lootbox.fund/terms" target="_blank">
                <span className="i-accept-the">I accept the</span>
                <span className="span">{` `}</span>
                <span className="terms-and-conditions">terms and conditions</span>
              </a>
            </div>
          </div>
        </div>
        <div className="lootbox-selection-list">
          <div className="faq-primer-div">
            <div className="primer-heading-div">How will I know if I won?</div>
            <div className="primer-subheading-div">
              <p className="you-will-receive">
                You will receive an email after the event if your chosen team wins the competition. Scroll down for
                more.
              </p>
            </div>
          </div>
          <div className="lootbox-options-list">
            <article className="lootbox-option-article">
              <img
                className="lootbox-preview-image"
                alt=""
                src="https://storage.googleapis.com/lootbox-stamp-staging/tnGJdz1rL8Cr0Oo9hcar/thumbs/lootbox_160x224.png?alt=media"
              />
              <div className="lootbox-option-info">
                <div className="lootbox-prize-value">Win $5 USD</div>
                <div className="lootbox-name-div">Freya Guild</div>
                <div className="lootbox-description-div">Lorem ipsum solar descarte simpar fie valor decorum.</div>
              </div>
            </article>
            <article className="lootbox-option-article1">
              <img
                className="lootbox-preview-image"
                alt=""
                src="https://storage.googleapis.com/lootbox-stamp-staging/tnGJdz1rL8Cr0Oo9hcar/thumbs/lootbox_160x224.png?alt=media"
              />
              <div className="lootbox-option-info">
                <div className="lootbox-prize-value">Win $5 USD</div>
                <div className="lootbox-name-div">Freya Guild</div>
                <div className="lootbox-description-div">Lorem ipsum solar descarte simpar fie valor decorum.</div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div className="action-button-div">
        <button onClick={() => onNext()} className="email-submit-button">
          <b className="email-submit-button-text">FINISH</b>
        </button>
      </div>
    </div>
  )
}

export default AcceptGift
