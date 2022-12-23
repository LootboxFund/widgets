import { COLORS, QuestionFieldType, TYPOGRAPHY, QuestionAnswerID } from '@wormgraph/helpers'
import { QuestionDef } from 'lib/hooks/useViralOnboarding'
import react, { useCallback } from 'react'
import styled from 'styled-components'
import { $InputMedium, renderAvailableQuestionTypes } from '../Authentication/Shared'
import { $Horizontal, $Vertical } from '../Generics'
import { $QuestionsDuringAd } from '../ViralOnboarding/components/AdVideoBeta2'

export interface QuestionInputProps {
  question: QuestionDef
  setValue: (value: any) => void
  color?: string
  backgroundColor?: string
}
const QuestionInput = ({ question, setValue, color = '#333', backgroundColor }: QuestionInputProps) => {
  const [choseOther, setChoseOther] = react.useState(false)
  const [otherValue, setOtherValue] = react.useState('')
  const getBackgroundColor = useCallback((fontColor: string) => {
    if (backgroundColor) return backgroundColor
    // Convert the font color to RGB values
    let r = parseInt(fontColor.substring(1, 3), 16)
    let g = parseInt(fontColor.substring(3, 5), 16)
    let b = parseInt(fontColor.substring(5, 7), 16)

    // Calculate the relative luminance of the font color
    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

    // Return a background color with good contrast against the font color
    if (luminance > 186) {
      return '#000000' // Dark background for light font
    } else {
      return '#FFFFFF' // Light background for dark font
    }
  }, [])

  const renderQuestionInput = () => {
    if (question.type === QuestionFieldType.Address) {
      let errorMessage = ''
      if (
        !checkIfValidSolanaAddress(question.answer) &&
        !isValidEvmAddress(question.answer) &&
        !isValidRoninAddress(question.answer) &&
        question.answer !== ''
      ) {
        errorMessage = 'Please enter a valid EVM or Solana address'
      }
      return (
        <$Vertical>
          <$InputMedium
            type="text"
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={question.answer}
            style={{ backgroundColor: getBackgroundColor(color) }}
          ></$InputMedium>
          {errorMessage && (
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'sans-serif',
                margin: '10px 5px 0px 0px',
                color,
              }}
            >
              {`🔴 `}
              {errorMessage}
            </span>
          )}
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.Checkbox) {
      return (
        <$Horizontal verticalCenter justifyContent="flex-start" style={{ fontFamily: 'sans-serif' }}>
          <$InputMedium
            type="checkbox"
            onClick={(e) => {
              // @ts-ignore
              setValue(e.target.checked)
            }}
            value={question.answer}
            style={{
              height: '30px',
              width: '30px',
              marginRight: '10px',
              cursor: 'pointer',
              backgroundColor: getBackgroundColor(color),
            }}
          ></$InputMedium>
          <label style={{ fontSize: '1.2rem', color }}>{question.question}</label>
        </$Horizontal>
      )
    }
    if (question.type == QuestionFieldType.Consent) {
      return (
        <$Horizontal verticalCenter justifyContent="flex-start" style={{ fontFamily: 'sans-serif' }}>
          <$InputMedium
            type="checkbox"
            onClick={(e) => {
              // @ts-ignore
              setValue(e.target.checked)
            }}
            value={question.answer}
            style={{
              height: '30px',
              width: '30px',
              marginRight: '10px',
              cursor: 'pointer',
              backgroundColor: getBackgroundColor(color),
            }}
          ></$InputMedium>
          <label style={{ fontSize: '1.2rem' }}>
            <span style={{ color }}>{question.question}</span>
            <a href={question.options} target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color }}>
              See Details
            </a>
          </label>
        </$Horizontal>
      )
    }
    if (question.type === QuestionFieldType.Date) {
      return (
        <$InputMedium
          type="date"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    if (question.type === QuestionFieldType.DateTime) {
      return (
        <$InputMedium
          type="datetime-local"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    if (question.type === QuestionFieldType.Email) {
      let errorMessage = ''
      if (!isValidEmail(question.answer) && question.answer !== '') {
        errorMessage = 'Please enter a valid email'
      }
      return (
        <$Vertical>
          <$InputMedium
            type="email"
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={question.answer}
            style={{ backgroundColor: getBackgroundColor(color) }}
          ></$InputMedium>
          {errorMessage && (
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'sans-serif',
                margin: '10px 5px 0px 0px',
                color,
              }}
            >
              {`🔴 `}
              {errorMessage}
            </span>
          )}
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.File) return 'file'
    if (question.type === QuestionFieldType.Link) {
      let errorMessage = ''
      if (!isValidUrl(question.answer) && question.answer !== '') {
        errorMessage = 'Please enter a valid url link'
      }
      return (
        <$Vertical>
          <$InputMedium
            type="url"
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={question.answer}
            style={{ backgroundColor: getBackgroundColor(color) }}
          ></$InputMedium>
          {errorMessage && (
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'sans-serif',
                margin: '10px 5px 0px 0px',
                color,
              }}
            >
              {`🔴 `}
              {errorMessage}
            </span>
          )}
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.MultiSelect) {
      const options = question.options?.split(',') || []

      return (
        <$Vertical>
          {options.map((option) => {
            return (
              <$Horizontal verticalCenter justifyContent="flex-start" style={{ fontFamily: 'sans-serif' }}>
                <$InputMedium
                  type="checkbox"
                  onClick={(e) => {
                    if (option.trim().toLowerCase() === 'other') {
                      // @ts-ignore
                      if (e.target.checked) {
                        setChoseOther(true)
                      } else {
                        setChoseOther(false)
                        setValue(
                          question.answer
                            .replace(otherValue, '')
                            .split(',')
                            .filter((a) => a)
                            .join(',')
                        )
                        setOtherValue('')
                      }
                    } else {
                      // @ts-ignore
                      if (e.target.checked) {
                        setValue(
                          (question.answer + ',' + option)
                            .split(',')
                            .filter((a) => a)
                            .join(',')
                        )
                      } else {
                        setValue(
                          question.answer
                            .split(',')
                            .filter((a) => a !== option)
                            .join(',')
                        )
                      }
                    }
                  }}
                  value={question.answer}
                  style={{
                    height: '30px',
                    width: '30px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    backgroundColor: getBackgroundColor(color),
                  }}
                ></$InputMedium>
                <label style={{ fontSize: '1.2rem', color }}>{option}</label>
              </$Horizontal>
            )
          })}

          {choseOther && (
            <$InputMedium
              type="text"
              onChange={(e) => {
                setOtherValue(e.target.value)
              }}
              value={otherValue}
              placeholder="Enter your other option"
              onBlur={() => {
                setValue(
                  (question.answer + ', ' + otherValue)
                    .split(',')
                    .filter((a) => a)
                    .join(',')
                )
              }}
              style={{ marginTop: '5px', backgroundColor: getBackgroundColor(color) }}
            ></$InputMedium>
          )}
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.Number) {
      return (
        <$InputMedium
          type="number"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    if (question.type === QuestionFieldType.Phone) {
      return (
        <$InputMedium
          type="tel"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          pattern="[\+\d\(\)-]*"
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    if (question.type === QuestionFieldType.Range) {
      const [min, max, step] = parseMinMaxRange(question.options || '')
      return (
        <$Vertical>
          <label
            style={{
              fontFamily: 'sans-serif',
              marginBottom: '10px',
              color,
              fontWeight: 500,
              fontSize: '1.2rem',
            }}
          >
            <$Horizontal justifyContent="space-between" style={{ fontFamily: 'sans-serif' }}>
              {question.question}
              {question.mandatory && <span style={{ fontSize: '0.8rem', fontFamily: 'sans-serif' }}>* required</span>}
            </$Horizontal>
          </label>
          <br />
          <$Vertical>
            <$Horizontal justifyContent="space-between" width="100%" style={{ fontFamily: 'sans-serif' }}>
              <b style={{ color }}>{min}</b>
              <span style={{ color }}>{question.answer}</span>
              <b style={{ color }}>{max}</b>
            </$Horizontal>
            <$Horizontal width="100%">
              <$InputMedium
                type="range"
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                min={min}
                max={max}
                step={step}
                value={question.answer}
                style={{ width: '100%', backgroundColor: getBackgroundColor(color) }}
              ></$InputMedium>
            </$Horizontal>
          </$Vertical>
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.Screenshot) return 'file'
    if (question.type === QuestionFieldType.SingleSelect) {
      const parsedSelectOptions = question.options?.split(',') || []
      return (
        <$Vertical>
          <select
            onChange={(e) => {
              if (e.target.value.toLowerCase() === 'other') {
                setChoseOther(true)
                setValue('')
              } else {
                setChoseOther(false)
                setValue(e.target.value)
              }
            }}
            style={{
              fontFamily: 'sans-serif',
              backgroundColor: getBackgroundColor(color),
              border: 'none',
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: TYPOGRAPHY.fontSize.medium,
              height: '40px',
            }}
          >
            <option disabled selected>
              {' '}
              -- select an option --{' '}
            </option>
            {parsedSelectOptions.map((opt) => (
              <option value={opt.trim()}>{opt.trim()}</option>
            ))}
          </select>
          {choseOther && (
            <$InputMedium
              type="text"
              onChange={(e) => {
                setValue(e.target.value)
              }}
              value={question.answer}
              placeholder="Enter your other option"
              style={{ marginTop: '5px', backgroundColor: getBackgroundColor(color) }}
            ></$InputMedium>
          )}
        </$Vertical>
      )
    }
    if (question.type === QuestionFieldType.Text) {
      return (
        <$InputMedium
          type="text"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    if (question.type === QuestionFieldType.Time) {
      return (
        <$InputMedium
          type="time"
          onChange={(e) => {
            setValue(e.target.value)
          }}
          value={question.answer}
          style={{ backgroundColor: getBackgroundColor(color) }}
        ></$InputMedium>
      )
    }
    return (
      <$InputMedium
        type="text"
        onChange={(e) => {
          setValue(e.target.value)
        }}
        value={question.answer}
        style={{ backgroundColor: getBackgroundColor(color) }}
      ></$InputMedium>
    )
  }
  return (
    <$QuestionInput>
      <$Vertical style={{ padding: '10px 10px 10px 10px' }}>
        {question.type !== QuestionFieldType.Checkbox &&
          question.type !== QuestionFieldType.Consent &&
          question.type !== QuestionFieldType.Range && (
            <label
              style={{
                fontFamily: 'sans-serif',
                marginBottom: '10px',
                color,
                fontWeight: 500,
                fontSize: '1.2rem',
              }}
            >
              <$Horizontal justifyContent="space-between">
                {question.question}
                {question.mandatory && <span style={{ fontSize: '0.8rem', fontFamily: 'sans-serif' }}>* required</span>}
              </$Horizontal>
            </label>
          )}
        {renderQuestionInput()}
      </$Vertical>
    </$QuestionInput>
  )
}

const checkIfValidSolanaAddress = (address: string) => {
  let regex = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{55}$/
  let isValid = regex.test(address)

  if (isValid) {
    return true
  }
  return false
}

function isValidEvmAddress(address: string) {
  // Regular expression that matches hexadecimal strings of length 40
  let regex = /^0x[0-9a-fA-F]{40}$/
  return regex.test(address)
}

function isValidRoninAddress(address: string) {
  // Regular expression that matches strings that start with "ronin:" followed by a hexadecimal string of length 40
  let regex = /^ronin:[0-9a-fA-F]{40}$/
  return regex.test(address)
}

function isValidEmail(email: string) {
  // Regular expression that matches email addresses
  let regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return regex.test(email)
}

function isValidUrl(url: string) {
  // Regular expression that matches URLs
  let regex =
    /^(?:(?:https?|ftp):\/\/|www\.)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
  return regex.test(url)
}

const parseMinMaxRange = (options: string) => {
  const [min, max, step] = options.split(',')

  if (!min || !max || !step) {
    return [0, 10, 1]
  }
  const minInt = parseInt(min.trim())
  const maxInt = parseInt(max.trim())
  const stepFloat = parseFloat(step.trim())
  if (isNaN(minInt) || isNaN(maxInt) || isNaN(stepFloat)) {
    return [0, 10, 1]
  }
  return [minInt, maxInt, stepFloat]
}

const $QuestionInput = styled.div<{}>`
  font-family: 'sans-serif';
`

export default QuestionInput
