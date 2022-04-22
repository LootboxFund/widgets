import react, { useState, forwardRef } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import useWindowSize from 'lib/hooks/useScreenSize'
import { NetworkOption } from 'lib/api/network'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { checkIfValidEmail } from 'lib/api/helpers'
import { ScreenSize } from '../../../hooks/useScreenSize/index'
import { SOCIALS } from 'lib/hooks/constants'

export interface StepSocialsProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  onNext: () => void
  socialState: Record<string, string>
  updateSocialState: (slug: string, text: string) => void
  setValidity: (bool: boolean) => void
}
const StepSocials = forwardRef((props: StepSocialsProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const initialErrors = {
    twitter: '',
    email: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    discord: '',
    youtube: '',
    snapchat: '',
    twitch: '',
    web: '',
  }
  const [errors, setErrors] = useState(initialErrors)

  const parseInput = (slug: string, value: string) => {
    props.updateSocialState(slug, value)
    if (slug === 'email') {
      if (!checkIfValidEmail(value)) {
        setErrors({
          ...errors,
          email: 'Invalid email',
        })
        props.setValidity(false)
      } else if (value.length === 0) {
        setErrors({
          ...errors,
          email: 'Email is mandatory',
        })
      } else {
        setErrors({
          ...errors,
          email: '',
        })
        props.setValidity(true)
      }
    } else if (!props.socialState.email) {
      setErrors({
        ...errors,
        email: 'Email is mandatory',
      })
      props.setValidity(false)
    } else {
      props.setValidity(true)
    }
  }

  return (
    <$StepSocials style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.stage}
        onNext={props.onNext}
        errors={Object.values(errors)}
      >
        <$Vertical flex={1}>
          <$StepHeading>
            6. Contact Information
            <HelpIcon tipID="stepSocials" />
            <ReactTooltip id="stepSocials" place="right" effect="solid">
              Having public profiles is important for building trust with investors.
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            Email is mandatory. Twitter is important for easy public communication with your investors. We also highly
            recommend you film a 1 minute self-introduction YouTube video and paste the link here (it helps build
            trust).
          </$StepSubheading>
          <br />
          <br />
          <$SocialGridInputs screen={screen}>
            {SOCIALS.map((social) => {
              return (
                <$Horizontal
                  key={social.slug}
                  style={screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px' }}
                >
                  <$SocialLogo src={social.icon} />
                  <$InputMedium
                    style={{ width: '100%' }}
                    value={props.socialState[social.slug]}
                    onChange={(e) => parseInput(social.slug, e.target.value)}
                    placeholder={social.placeholder}
                  ></$InputMedium>
                </$Horizontal>
              )
            })}
          </$SocialGridInputs>
        </$Vertical>
      </StepCard>
    </$StepSocials>
  )
})

const $StepSocials = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`
export const $SocialGridInputs = styled.div<{ screen: ScreenSize }>`
  ${({ screen }) => {
    if (screen === 'mobile') {
      return `
        display: flex;
        flex-direction: column;
      `
    } else {
      return `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        column-gap: 10px;
        row-gap: 15px;
      `
    }
  }}
`

export const $SocialLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export default StepSocials
