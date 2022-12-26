import { useMutation } from '@apollo/client'
import {
  ClaimID,
  COLORS,
  LootboxAirdropMetadata,
  LootboxID,
  QuestionFieldType,
  QuestionAnswerID,
  AdID,
  SessionID,
  AdEventAction,
  OfferID,
  AdSetID,
  TournamentID,
  FlightID,
  AffiliateID,
  AdEventNonce,
} from '@wormgraph/helpers'
import {
  AdOfferQuestion,
  AdServed,
  AnswerAirdropQuestionResponseSuccess,
  ClaimRedemptionStatus,
  LootboxAirdropMetadataQuestion,
  MutationAnswerAirdropQuestionArgs,
  MutationUpdateClaimRedemptionStatusArgs,
  ResponseError,
  UpdateClaimRedemptionStatusResponse,
} from 'lib/api/graphql/generated/types'
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import $Spinner from '../Generics/Spinner'
import {
  CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS,
  UPDATE_CLAIM_REDEMPTION_STATUS,
} from '../RedeemCosmicLootbox/api.gql'
import { ANSWER_AIRDROP_QUESTIONS } from './api.gql'
import './index.css'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import QuestionInput from '../QuestionInput'
import { useBeforeAirdropAd } from 'lib/hooks/useBeforeAirdropAd'
import StickyBottomFrame from '../StickyBottomFrame'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import Video from '../ViralOnboarding/components/Video'
import { loadAdTrackingPixel } from 'lib/utils/pixel'
import { useAuth } from 'lib/hooks/useAuth'
import { Tournament } from '../../api/graphql/generated/types'
import { v4 as uuidv } from 'uuid'
import { manifest } from 'manifest'

interface BeforeAirdropClaimQuestionsProps {
  name: string
  claimID?: ClaimID
  nftBountyValue: string
  stampImage: string
  lootboxID: LootboxID
  airdropMetadata: LootboxAirdropMetadata
  airdropQuestions: AdOfferQuestion[]
  ad?: AdServed
  sessionID?: SessionID
}
const BeforeAirdropClaimQuestions = (props: BeforeAirdropClaimQuestionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [viewPixelRendered, setViewPixelRendered] = useState(false)
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const [minimizedAd, setMinimizedAd] = useState(false)
  // Prevents caching & helps dedupe
  const nonce = useMemo(() => {
    return uuidv() as AdEventNonce
  }, [])
  const { user } = useAuth()
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; type: QuestionFieldType; mandatory: boolean; options: string }>
  >({})
  const [updateClaimRedemptionStatus] = useMutation<
    { updateClaimRedemptionStatus: ResponseError | UpdateClaimRedemptionStatusResponse },
    MutationUpdateClaimRedemptionStatusArgs
  >(UPDATE_CLAIM_REDEMPTION_STATUS)
  useEffect(() => {
    setAnswers(
      (props.airdropQuestions || []).reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: {
            answer: '',
            type: curr.type,
            options: curr.options,
            mandatory: curr.mandatory,
          },
        }
      }, {} as Record<string, { answer: string; type: QuestionFieldType }>) as Record<
        string,
        { answer: string; type: QuestionFieldType; mandatory: boolean; options: string }
      >
    )
  }, [props.airdropQuestions])
  const ad = useMemo(() => {
    return props.ad
  }, [props.ad])
  useEffect(() => {
    if (ad && !viewPixelRendered) {
      loadAdTrackingPixel({
        adID: ad.adID as AdID,
        sessionID: props.sessionID,
        eventAction: AdEventAction.View,
        userID: user?.id,
        claimID: (ad.inheritedClaim?.claimID || '') as ClaimID,
        adSetID: ad.adSetID as AdSetID,
        offerID: ad.offerID as OfferID,
        campaignID: undefined,
        tournamentID: (ad.inheritedClaim?.tournamentID || '') as TournamentID,
        promoterID: (ad.inheritedClaim?.promoterID || '') as AffiliateID,
        flightID: ad.flightID as FlightID,
        nonce,
        timeElapsed: undefined,
      })
      setViewPixelRendered(true)
    }
  }, [ad])
  const [answerAirdropQuestionsMutation] = useMutation<
    { answerAirdropQuestion: any },
    MutationAnswerAirdropQuestionArgs
  >(ANSWER_AIRDROP_QUESTIONS, {
    refetchQueries: [{ query: CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS, variables: { lootboxID: props.lootboxID } }],
  })
  const answersInput = Object.keys(answers).map((a) => {
    return {
      questionID: a,
      lootboxID: props.lootboxID,
      answer: (answers[a]?.answer || '').toString(),
    }
  })
  const answerQuestions = async () => {
    setIsSubmitting(true)
    const res = await answerAirdropQuestionsMutation({
      variables: {
        payload: {
          lootboxID: props.lootboxID,
          claimID: props.claimID,
          answers: answersInput,
          flightID: ad?.flightID,
        },
      },
    })
    if (res?.data?.answerAirdropQuestion.error) {
      setErrorMessage(res.data.answerAirdropQuestion.error.message)
      setIsSubmitting(false)
    }
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 1000)
  }
  const proceedFromVideoAd = () => {
    setMinimizedAd(true)
  }
  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: true,
    controls: false,
    muted: true,
    responsive: true,
    loop: false,
    // bigPlayButton: true,
    retryOnError: true,
    // fluid: true,
    poster: ad?.creative?.thumbnail,
    // fill: true,
    // aspectRatio: ad?.creative?.creativeAspectRatio || '9:16',
    sources: ad?.creative?.creativeLinks
      ? ad.creative.creativeLinks.map((link: string) => {
          return {
            src: link,
            type: `video/${
              link.toLowerCase().endsWith('webm') ? 'webm' : link.toLowerCase().endsWith('ogv') ? 'ogv' : 'mp4'
            }`,
          }
        })
      : [],
  }
  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player

    player.on('ready', () => {
      player.play()
      setTimeout(() => {
        player.muted(false)
      }, 5000)
    })

    player.on('ended', () => {
      proceedFromVideoAd()
    })
  }
  if (props.ad && !minimizedAd) {
    return (
      <StickyBottomFrame
        backgroundCover={{
          backgroundImage: `url(${ad?.creative?.creativeLinks[0]})`,
        }}
        submitText={props.ad.creative.callToAction}
        loading={false}
        submitForm={proceedFromVideoAd}
      >
        <section
          style={{
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0)',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {ad?.creative?.creativeType === 'video' && (
            <Video
              options={videoJsOptions}
              onReady={handlePlayerReady}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '600px',
                position: 'absolute',
              }}
            />
          )}
          {ad?.creative.creativeType === 'image' && (
            <div>
              <img src={ad?.creative?.creativeLinks[0]} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
        </section>
      </StickyBottomFrame>
    )
  }

  const determineInputType = (type: QuestionFieldType) => {
    if (type === QuestionFieldType.Date) {
      return 'date'
    } else if (type === QuestionFieldType.Number) {
      return 'number'
    } else if (type === QuestionFieldType.Phone) {
      return 'tel'
    } else if (type === QuestionFieldType.Email) {
      return 'email'
    } else if (type === QuestionFieldType.Address) {
      return 'text'
    } else if (type === QuestionFieldType.DateTime) {
      return 'datetime-local'
    } else if (type === QuestionFieldType.File) {
      return 'file'
    } else if (type === QuestionFieldType.Range) {
      return 'range'
    } else if (type === QuestionFieldType.Screenshot) {
      return 'image'
    } else if (type === QuestionFieldType.Link) {
      return 'url'
    }
    return 'text'
  }
  const questionsToCollect = (props.airdropQuestions || [])
    .slice()
    .sort((a, b) => {
      if (a.mandatory === b.mandatory) {
        return 0
      }
      return a.mandatory ? -1 : 1
    })
    .sort((a, b) => (b.order || 99) - (a.order || 99))

  const filledAllMandatoryAnswers =
    (props.airdropQuestions || []).length === 0
      ? true
      : Object.values(answers)
          .filter((a) => a.mandatory)
          .every((a) => !!a.answer)
  const showPartOne =
    props.airdropMetadata && (props.airdropMetadata.instructionsLink || props.airdropMetadata.callToActionLink)
  const showPartTwo = props.airdropQuestions && props.airdropQuestions.length > 0

  return (
    <div className="beforeairdropclaim-questions-div">
      {/* <div className="prize-showcase-div">
        <img className="lootbox-image-icon1" alt="" src={props.stampImage} />
        <div className="showcase-text-div">
          <h1 className="title-h1">{props.nftBountyValue}</h1>
          <div className="subtitle-div">Airdrop Gift</div>
        </div>
      </div>
      <div className="congrats-div">
        <h2 className="congrats-heading-h2">Congratulations!</h2>
        <div className="receival-subheading-div">
          You received a FREE gift from a sponsor “
          {(props.airdropMetadata && props.airdropMetadata.advertiserName) || 'Unknown'}”.
        </div>
      </div> */}

      <div className="how-to-redeem">
        <h2 className="how-to-redeem-heading">How to Redeem</h2>
      </div>
      {props.airdropMetadata?.oneLiner && (
        <div className="sponsor-wants-div">
          <div className="callout-div">
            <i className="sponsor-wants-heading">The Sponsor wants you to...</i>
            <i className="sponsor-wants-subheading">
              {props.airdropMetadata.oneLiner || 'Redeem Gift, no strings attached'}
            </i>
          </div>
        </div>
      )}
      {showPartOne && (
        <div className="step-one-section">
          <h3 className="step-1-heading">Step 1</h3>
          <div className="step-1-subheading">
            Follow the sponsor’s instructions here. Do this at your own risk. LOOTBOX assumes no responsiblity between
            you and sponsor.
          </div>
          {props.airdropMetadata?.instructionsLink && (
            <iframe
              className="step-1-video"
              src={props.airdropMetadata?.instructionsLink}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          <a
            id="action-button-text-id"
            href={`${manifest.storage.buckets.redirectPage.accessUrl}/${
              manifest.storage.buckets.redirectPage.files.page
            }?flightID=${ad?.flightID}&destination=${encodeURIComponent(
              props.airdropMetadata?.callToActionLink || ''
            )}&eventAction=${AdEventAction.Click}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (props.claimID) {
                updateClaimRedemptionStatus({
                  variables: { payload: { claimID: props.claimID, status: ClaimRedemptionStatus.InProgress } },
                })
              }
            }}
            style={{ width: '100%' }}
          >
            <button className="action-button">
              <b className="action-button-text">{props.airdropMetadata.instructionsCallToAction || 'Complete Task'}</b>
            </button>
          </a>
        </div>
      )}
      {showPartTwo && (
        <div className="step-two-section">
          <h3 className="step-2-heading">{showPartOne ? `Step 2` : `Answer these questions`}</h3>
          <div className="step-2-subheading">Answer the two questions here for the advertiser.</div>
          <$Vertical style={{ width: '100%' }}>
            {questionsToCollect.map((q) => {
              return (
                <QuestionInput
                  color="#4a4a4a"
                  backgroundColor="#f3f3f3"
                  question={{
                    ...q,
                    id: q.id as QuestionAnswerID,
                    mandatory: q.mandatory || false,
                    options: q.options || '',
                    answer: answers[q.id]?.answer || '',
                  }}
                  setValue={(value) => {
                    setAnswers({
                      ...answers,
                      [q.id]: {
                        ...answers[q.id],
                        answer: value,
                      },
                    })
                    const someAnswered = Object.values(answers).some((v) => v.answer)

                    if (!someAnswered && props.claimID) {
                      updateClaimRedemptionStatus({
                        variables: { payload: { claimID: props.claimID, status: ClaimRedemptionStatus.InProgress } },
                      })
                    }
                  }}
                />
              )
            })}
          </$Vertical>
        </div>
      )}
      {errorMessage && (
        <span style={{ color: 'red', textAlign: 'center', margin: '20px auto', fontSize: '1rem' }}>{errorMessage}</span>
      )}
      <button
        onClick={() => answerQuestions()}
        disabled={isSubmitting || !filledAllMandatoryAnswers}
        className="action-button"
        style={{
          opacity: !filledAllMandatoryAnswers ? 0.1 : 1,
          cursor: !filledAllMandatoryAnswers ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? (
          <$Spinner color={COLORS.white} margin="auto auto 20px" />
        ) : (
          <b className="action-button-text">REDEEM PRIZE</b>
        )}
      </button>
    </div>
  )
}

export default BeforeAirdropClaimQuestions
