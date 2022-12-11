import { gql } from '@apollo/client'

export const ANSWER_QUESTIONS = gql`
  mutation AnswerAirdropQuestion($payload: AnswerAirdropQuestionPayload!) {
    answerAirdropQuestion(payload: $payload) {
      ... on AnswerAirdropQuestionResponseSuccess {
        answerIDs
      }
      ... on ResponseError {
        error {
          code
          message
        }
      }
    }
  }
`
