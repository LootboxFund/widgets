import { useMutation } from '@apollo/client'
import { COLORS, LootboxAirdropMetadata, LootboxID } from '@wormgraph/helpers'
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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  useEffect(() => {
    setAnswers(
      props.airdropQuestions.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: '',
        }
      }, {} as Record<string, string>)
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
      answer: answers[a],
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
  const questionsToCollect = props.airdropQuestions.slice().sort((a, b) => (b.order || 99) - (a.order || 99))
  const filledAllAnswers = Object.values(answers).some((a) => !a)
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
        <iframe className="step-1-video" src={props.airdropMetadata.instructionsLink} frameBorder="0" allowFullScreen />
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
                value={answers[q.id]}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.id]: e.target.value,
                  })
                }
                type="text"
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
