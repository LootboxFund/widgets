import { useMutation } from '@apollo/client'
import {
  ClaimID,
  COLORS,
  LootboxAirdropMetadata,
  LootboxID,
  QuestionFieldType,
  QuestionAnswerID,
} from '@wormgraph/helpers'
import {
  AnswerAirdropQuestionResponseSuccess,
  ClaimRedemptionStatus,
  LootboxAirdropMetadataQuestion,
  MutationAnswerAirdropQuestionArgs,
  MutationUpdateClaimRedemptionStatusArgs,
  ResponseError,
  UpdateClaimRedemptionStatusResponse,
} from 'lib/api/graphql/generated/types'
import { FunctionComponent, useEffect, useState } from 'react'
import $Spinner from '../Generics/Spinner'
import {
  CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS,
  UPDATE_CLAIM_REDEMPTION_STATUS,
} from '../RedeemCosmicLootbox/api.gql'
import { ANSWER_AIRDROP_QUESTIONS } from './api.gql'
import './index.css'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import QuestionInput from '../QuestionInput'

interface BeforeAirdropClaimQuestionsProps {
  name: string
  claimID?: ClaimID
  nftBountyValue: string
  stampImage: string
  lootboxID: LootboxID
  airdropMetadata: LootboxAirdropMetadata
  airdropQuestions: LootboxAirdropMetadataQuestion[]
}
const BeforeAirdropClaimQuestions = (props: BeforeAirdropClaimQuestionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; type: QuestionFieldType; mandatory: boolean; options: string }>
  >({})
  const [updateClaimRedemptionStatus] = useMutation<
    { updateClaimRedemptionStatus: ResponseError | UpdateClaimRedemptionStatusResponse },
    MutationUpdateClaimRedemptionStatusArgs
  >(UPDATE_CLAIM_REDEMPTION_STATUS)
  useEffect(() => {
    setAnswers(
      props.airdropQuestions.reduce((acc, curr) => {
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
  }, [])
  const [answerQuestionsMutation] = useMutation<{ answerAirdropQuestion: any }, MutationAnswerAirdropQuestionArgs>(
    ANSWER_AIRDROP_QUESTIONS,
    {
      refetchQueries: [{ query: CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS, variables: { lootboxID: props.lootboxID } }],
    }
  )
  const answersInput = Object.keys(answers).map((a) => {
    return {
      questionID: a,
      lootboxID: props.lootboxID,
      answer: (answers[a]?.answer || '').toString(),
    }
  })
  const answerQuestions = async () => {
    setIsSubmitting(true)
    const res = await answerQuestionsMutation({
      variables: {
        payload: {
          lootboxID: props.lootboxID,
          claimID: props.claimID,
          answers: answersInput,
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
  const questionsToCollect = props.airdropQuestions
    .slice()
    .sort((a, b) => {
      if (a.mandatory === b.mandatory) {
        return 0
      }
      return a.mandatory ? -1 : 1
    })
    .sort((a, b) => (b.order || 99) - (a.order || 99))

  const filledAllMandatoryAnswers =
    Object.values(answers)
      .filter((a) => a.mandatory)
      .some((a) => a.answer) || props.airdropQuestions.length === 0
  const showPartOne = props.airdropMetadata.instructionsLink || props.airdropMetadata.callToActionLink
  const showPartTwo = props.airdropQuestions && props.airdropQuestions.length > 0
  return (
    <div className="beforeairdropclaim-questions-div">
      <div className="prize-showcase-div">
        <img className="lootbox-image-icon1" alt="" src={props.stampImage} />
        <div className="showcase-text-div">
          <h1 className="title-h1">{props.nftBountyValue}</h1>
          <div className="subtitle-div">Airdrop Gift</div>
        </div>
      </div>
      <div className="congrats-div">
        <h2 className="congrats-heading-h2">Congratulations!</h2>
        <div className="receival-subheading-div">
          You received a FREE gift from a sponsor “{props.airdropMetadata.advertiserName || 'Unknown'}”.
        </div>
      </div>
      {props.airdropMetadata.oneLiner && (
        <div className="sponsor-wants-div">
          <div className="callout-div">
            <i className="sponsor-wants-heading">The Sponsor wants you to...</i>
            <i className="sponsor-wants-subheading">
              {props.airdropMetadata.oneLiner || 'Redeem Gift, no strings attached'}
            </i>
          </div>
        </div>
      )}

      <div className="how-to-redeem">
        <h2 className="how-to-redeem-heading">How to Redeem</h2>
      </div>
      {showPartOne && (
        <div className="step-one-section">
          <h3 className="step-1-heading">Step 1</h3>
          <div className="step-1-subheading">
            Follow the sponsor’s instructions here. Do this at your own risk. LOOTBOX assumes no responsiblity between
            you and sponsor.
          </div>
          {props.airdropMetadata.instructionsLink && (
            <iframe
              className="step-1-video"
              src={props.airdropMetadata.instructionsLink}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          <a
            id="action-button-text-id"
            href={props.airdropMetadata.callToActionLink}
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
              // return (
              //   <div key={q.id} className="questionset-div">
              //     <$Horizontal width="100%" justifyContent="space-between">
              //       <i className="question">{q.question}</i>
              //       <div>{q.mandatory && <i style={{ fontSize: '0.8rem', color: 'gray' }}>* Required</i>}</div>
              //     </$Horizontal>

              //     <input
              //       className="answer-input"
              //       value={answers[q.id]?.answer || ''}
              //       onChange={(e) => {
              //         setAnswers({
              //           ...answers,
              //           [q.id]: {
              //             ...answers[q.id],
              //             answer: e.target.value,
              //           },
              //         })
              //         const someAnswered = Object.values(answers).some((v) => v.answer)

              //         if (!someAnswered && props.claimID) {
              //           updateClaimRedemptionStatus({
              //             variables: { payload: { claimID: props.claimID, status: ClaimRedemptionStatus.InProgress } },
              //           })
              //         }
              //       }}
              //       type={determineInputType(
              //         // answers[q.id]?.type ||
              //         QuestionFieldType.Text
              //       )}
              //     />
              //   </div>
              // )
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
