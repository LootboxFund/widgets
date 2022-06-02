import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import $Button from '../Generics/Button'
import { ScreenSize } from 'lib/hooks/useScreenSize'

export const $h1 = styled.h1`
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`
export const $h2 = styled.h2`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`
export const $p = styled.p`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  line-height: ${TYPOGRAPHY.fontSize.xlarge};
  font-weight: ${TYPOGRAPHY.fontWeight.regular};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor}ce;
`

export const $HideTings = styled.div<{ isHidden: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) =>
    props.isHidden
      ? `linear-gradient(
    180deg,
    rgba(196, 196, 196, 0) 0%,
    rgba(255, 255, 255, 0.47) 17.71%,
    rgba(255, 255, 255, 0.9) 40%,
    #ffffff 77.08%
  );`
      : 'none'};
  display: ${(props) => (props.isHidden ? 'auto' : 'none')};
  };
  `

const $DescriptionContainer = styled.div`
  position: relative;
`

export const HiddenDescription = ({ description, screen }: { description: string; screen: ScreenSize }) => {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <$DescriptionContainer>
      <$HideTings isHidden={isHidden}>
        {isHidden ? (
          <$Button
            onClick={() => setIsHidden(!isHidden)}
            screen={screen}
            backgroundColor={COLORS.white}
            color={`${COLORS.surpressedFontColor}80`}
            style={{
              position: 'absolute',
              bottom: '0px',
              border: 'none',
              boxShadow: 'none',
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              fontSize: TYPOGRAPHY.fontSize.medium,
              textDecoration: 'underline',
              fontStyle: 'italic',
              width: '100%',
              background: 'transparent',
            }}
          >
            Read More
          </$Button>
        ) : undefined}
      </$HideTings>
      <$p>{isHidden ? description.slice(0, 800) : description}</$p>
      {!isHidden ? (
        <$Button
          onClick={() => setIsHidden(!isHidden)}
          screen={screen}
          backgroundColor={COLORS.white}
          color={`${COLORS.surpressedFontColor}80`}
          style={{
            position: 'absolute',
            bottom: '0px',
            border: 'none',
            boxShadow: 'none',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.medium,
            textDecoration: 'underline',
            fontStyle: 'italic',
            width: '100%',
            background: 'transparent',
          }}
        >
          Hide
        </$Button>
      ) : null}
    </$DescriptionContainer>
  )
}

const $TournamentErrorContainer = styled.div`
  text-align: center;
`

const $Manz = styled.span`
  font-size: 3.5rem;
`

export const TournamentError = ({ message }: { message: string }) => {
  return (
    <$TournamentErrorContainer>
      <$Manz>🤕 </$Manz>
      <$h1>An error occured</$h1>
      <$p>{message}</$p>
    </$TournamentErrorContainer>
  )
}

export const EmptyResult = () => {
  return (
    <div>
      <$h1>🤷‍♂️ Tournament not found!</$h1>
    </div>
  )
}
