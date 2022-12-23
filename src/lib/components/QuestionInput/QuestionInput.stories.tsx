import React from 'react'
import QuestionInput, { QuestionInputProps } from 'lib/components/QuestionInput'
import { QuestionAnswerID, QuestionFieldType } from '@wormgraph/helpers'
import { $QuestionsDuringAd } from '../ViralOnboarding/components/AdVideoBeta2'

export default {
  title: 'QuestionInput',
  component: QuestionInput,
}

const DemoQuestions = {
  [QuestionFieldType.Text]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'Are you there?',
    answer: '',
    type: QuestionFieldType.Text,
    mandatory: true,
    options: '',
  },
  [QuestionFieldType.Checkbox]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'Do you want us to message you?',
    answer: false,
    type: QuestionFieldType.Checkbox,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Consent]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'Do you agree to the terms of service?',
    answer: false,
    type: QuestionFieldType.Consent,
    mandatory: false,
    options: 'https://google.com',
  },
  [QuestionFieldType.Address]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'What is your Polygon address?',
    answer: '',
    type: QuestionFieldType.Address,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Date]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'When do you want?',
    answer: new Date(),
    type: QuestionFieldType.Date,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Time]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'When do you want?',
    answer: new Date(),
    type: QuestionFieldType.Time,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.DateTime]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'When do you want?',
    answer: new Date(),
    type: QuestionFieldType.DateTime,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Email]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'What is your email?',
    answer: '',
    type: QuestionFieldType.Email,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Link]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'What is your website?',
    answer: '',
    type: QuestionFieldType.Link,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Number]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'How old are you?',
    answer: 5,
    type: QuestionFieldType.Number,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Phone]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'What is your phone?',
    answer: '',
    type: QuestionFieldType.Phone,
    mandatory: false,
    options: '',
  },
  [QuestionFieldType.Range]: {
    id: 'QuestionAnswerID' as QuestionAnswerID,
    question: 'How would you rate us?',
    answer: 4,
    type: QuestionFieldType.Range,
    mandatory: false,
    options: '-1, 5, 0.25',
  },
  [QuestionFieldType.SingleSelect]: {
    id: 'QuestionAnswerID-SingleSelect' as QuestionAnswerID,
    question: 'Which is your favorite?',
    answer: '',
    type: QuestionFieldType.SingleSelect,
    mandatory: false,
    options: 'option A, option B, other',
  },
  [QuestionFieldType.MultiSelect]: {
    id: 'QuestionAnswerID-MultiSelect' as QuestionAnswerID,
    question: 'Choose your favorites',
    answer: '',
    type: QuestionFieldType.MultiSelect,
    mandatory: false,
    options: 'option A, option B, other',
  },
}

const Demo = (args: QuestionInputProps) => {
  const chosen = QuestionFieldType.Consent
  const [value2, setValue2] = React.useState<any>(DemoQuestions[QuestionFieldType.SingleSelect].answer)
  const [value, setValue] = React.useState<any>(DemoQuestions[chosen].answer)
  console.log(`value`, value)
  return (
    <$QuestionsDuringAd>
      <QuestionInput
        {...args}
        question={{ ...DemoQuestions[QuestionFieldType.SingleSelect], answer: value2 }}
        setValue={setValue2}
      />
      <QuestionInput {...args} question={{ ...DemoQuestions[chosen], answer: value }} setValue={setValue} />
    </$QuestionsDuringAd>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
