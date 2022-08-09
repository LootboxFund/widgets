import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { ScreenSize } from 'lib/hooks/useScreenSize'
import { manifest } from 'manifest'
import styled from 'styled-components'

export const handIconImg = `${manifest.storage.downloadUrl}/${manifest.storage.buckets.constants.id}%2Fassets%2FhandIcon.png?alt=media`
export const background1 = `${manifest.storage.downloadUrl}/${manifest.storage.buckets.constants.id}%2Fassets%2FViralOnboardingBG1-compressed.png?alt=media`
export const background2 = `${manifest.storage.downloadUrl}/${manifest.storage.buckets.constants.id}%2Fassets%2FViralOnboardingBG2.png?alt=media`

export const $Heading = styled.h1`
  color: ${COLORS.white};
  text-align: center;
  text-transform: capitalize;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $Heading2 = styled.h2`
  color: ${COLORS.white};
  text-align: center;
  text-transform: capitalize;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $GiantHeading = styled.h1`
  color: ${COLORS.white};
  text-align: center;
  text-transform: capitalize;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: 3rem;
  line-height: 3.2rem;
  margin: 0.55rem auto;
`

export const $SupressedParagraph = styled.p`
  color: ${COLORS.white}ba;
  text-align: center;
  text-transform: none;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.large};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
`

export const $SubHeading = styled.p`
  color: ${COLORS.white};
  text-align: center;
  text-transform: none;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.large};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
`

export const $SmallText = styled.p`
  color: ${COLORS.white};
  text-align: center;
  text-transform: none;
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  margin: 8px 0px;
`

export const $NextButton = styled.button<{
  backgroundColor?: string
  color?: string
  colorHover?: string
  backgroundColorHover?: string
  disabled?: boolean
}>`
  padding: 15px 10px 15px 20px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  text-align: center;
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  line-height: ${TYPOGRAPHY.fontSize.xxlarge};
  text-transform: uppercase;
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  border: 0px solid transparent;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.75);
  ${(props) => (props.disabled ? 'cursor: not-allowed' : 'cursor: pointer')};
  ${(props) => props.color && `color: ${props.color}`};
  ${(props) => props.backgroundColor && `background-color: ${props.backgroundColor}`};
  &:hover {
    ${(props) => !props.disabled && props.backgroundColorHover && `background-color: ${props.backgroundColorHover}`};
    ${(props) => !props.disabled && props.colorHover && `color: ${props.colorHover}`};
  }
`

export const $TournamentStampPreviewContainer = styled.div`
  position: relative;
  height: 160px;
`

export const $TournamentStampPreviewImage = styled.img<{ cardNumber: 0 | 1 }>`
  position: absolute;
  height: 160px;
  background-size: cover;
  transform: ${(props) => (props.cardNumber === 0 ? 'rotate(-20deg)' : 'rotate(20deg)')};
  left: ${(props) => (props.cardNumber === 0 ? '-50px' : '50px')};
  z-index: ${(props) => (props.cardNumber === 0 ? '1' : '0')};
  object-fit: contain;
  filter: drop-shadow(0px 0px 25px #ff0000);
`

export interface LocalClaim {
  tournamentId: string
  partyBasketId?: string
  campaignName?: string
}
