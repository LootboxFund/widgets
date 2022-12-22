import { QuestionFieldType } from '@wormgraph/helpers'
import react from 'react'
import styled from 'styled-components'
import { $InputMedium, renderAvailableQuestionTypes } from '../Authentication/Shared'
import { $Horizontal, $Vertical } from '../Generics'
import { $QuestionsDuringAd } from '../ViralOnboarding/components/AdVideoBeta2'

export interface TemplateProps {}
const Template = (props: TemplateProps) => {
  const [value, setValue] = react.useState<any>()
  const type = QuestionFieldType.Checkbox
  return (
    <$Template>
      <p>Template</p>
      <$QuestionsDuringAd>
        <$Vertical style={{ padding: '10px 10px 10px 10px' }}>
          <label
            style={{
              fontFamily: 'sans-serif',
              marginBottom: '10px',
              color: 'black',
              fontWeight: 500,
              fontSize: '1.2rem',
            }}
          >
            <$Horizontal justifyContent="space-between">Does it work?</$Horizontal>
          </label>
          <$InputMedium
            type={renderAvailableQuestionTypes(type)}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={value}
          ></$InputMedium>
        </$Vertical>
      </$QuestionsDuringAd>
    </$Template>
  )
}

const $Template = styled.div<{}>``

export default Template
