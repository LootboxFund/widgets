import { useMutation } from '@apollo/client'
import { COLORS, LootboxAirdropMetadata, LootboxID, QuestionFieldType } from '@wormgraph/helpers'
import {
  AnswerAirdropQuestionResponseSuccess,
  LootboxAirdropMetadataQuestion,
  MutationAnswerAirdropQuestionArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { FunctionComponent, useEffect, useState } from 'react'
import $Spinner from '../Generics/Spinner'
import { CHECK_IF_USER_ANSWERED_AIRDROP_QUESTIONS } from '../RedeemCosmicLootbox/api.gql'
import { ANSWER_QUESTIONS } from './api.gql'
import './index.css'

interface BeforeAirdropClaimQuestionsProps {
  name: string
  nftBountyValue: string
  stampImage: string
  lootboxID: LootboxID
  airdropMetadata: LootboxAirdropMetadata
  airdropQuestions: LootboxAirdropMetadataQuestion[]
}
const BeforeAirdropClaimQuestions = (props: BeforeAirdropClaimQuestionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Record<string, { answer: string; type: QuestionFieldType }>>({})
  useEffect(() => {
    setAnswers(
      props.airdropQuestions.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: {
            answer: '',
            type: curr.type,
          },
        }
      }, {} as Record<string, { answer: string; type: QuestionFieldType }>)
    )
  }, [])
  const [answerQuestionsMutation] = useMutation<{ answerAirdropQuestion: any }, MutationAnswerAirdropQuestionArgs>(
    ANSWER_QUESTIONS,
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
    await answerQuestionsMutation({
      variables: {
        payload: {
          lootboxID: props.lootboxID,
          answers: answersInput,
        },
      },
    })
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
  const questionsToCollect = props.airdropQuestions.slice().sort((a, b) => (b.order || 99) - (a.order || 99))
  const filledAllAnswers = Object.values(answers).some((a) => !a.answer)
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
      <div className="sponsor-wants-div">
        <div className="callout-div">
          <i className="sponsor-wants-heading">The Sponsor wants you to...</i>
          <i className="sponsor-wants-subheading">
            {props.airdropMetadata.oneLiner || 'Redeem Gift, no strings attached'}
          </i>
        </div>
      </div>
      <div className="how-to-redeem">
        <h2 className="how-to-redeem-heading">How to Redeem</h2>
      </div>
      <div className="step-one-section">
        <h3 className="step-1-heading">Step 1</h3>
        <div className="step-1-subheading">
          Follow the sponsor’s instructions here. Do this at your own risk. LOOTBOX assumes no responsiblity between you
          and sponsor.
        </div>
        <iframe
          className="step-1-video"
          src={props.airdropMetadata.instructionsLink}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <a
          id="action-button-text-id"
          href={props.airdropMetadata.callToActionLink}
          target="_blank"
          rel="noreferrer"
          style={{ width: '100%' }}
        >
          <button className="action-button">
            <b className="action-button-text">{props.airdropMetadata.instructionsCallToAction || 'Complete Task'}</b>
          </button>
        </a>
      </div>
      <div className="step-two-section">
        <h3 className="step-2-heading">Step 2</h3>
        <div className="step-2-subheading">Answer the two questions here for the advertiser.</div>
        {questionsToCollect.map((q) => {
          return (
            <div key={q.id} className="questionset-div">
              <i className="question">{q.question}</i>
              <input
                className="answer-input"
                value={answers[q.id]?.answer || ''}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.id]: {
                      ...answers[q.id],
                      answer: e.target.value,
                    },
                  })
                }
                type={determineInputType(answers[q.id]?.type || QuestionFieldType.Text)}
              />
            </div>
          )
        })}
        <button
          onClick={() => answerQuestions()}
          disabled={isSubmitting || filledAllAnswers}
          className="action-button"
          style={{ opacity: filledAllAnswers ? 0.1 : 1, cursor: filledAllAnswers ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? (
            <$Spinner color={COLORS.white} margin="auto auto 20px" />
          ) : (
            <b className="action-button-text">REDEEM PRIZE</b>
          )}
        </button>
      </div>
    </div>
  )
}

export default BeforeAirdropClaimQuestions
