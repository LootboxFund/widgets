import styled from 'styled-components'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import $Button from '../Generics/Button'
import { ScreenSize } from 'lib/hooks/useScreenSize'
import { Lootbox, LootboxTournamentSnapshot } from 'lib/api/graphql/generated/types'
import { $Horizontal, $p, $h1 } from '../Generics'

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

  const truncate = screen === 'mobile' ? 350 : 500

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
      <$p>{isHidden ? description.slice(0, truncate) : description}</$p>
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
      {!isHidden ? (
        <>
          <br />
        </>
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

interface LootboxListProps {
  onClickLootbox?: (lootbox: LootboxTournamentSnapshot) => void
  lootboxes: LootboxTournamentSnapshot[]
  screen: ScreenSize
}
export const LootboxList = ({ lootboxes, screen, onClickLootbox }: LootboxListProps) => {
  return (
    <$Horizontal justifyContent="flex-start" flexWrap spacing={4}>
      {lootboxes.map((lootbox, index) => {
        return (
          <$LootboxThumbailContainer
            key={index}
            screen={screen}
            onClick={() => {
              onClickLootbox && onClickLootbox(lootbox)
            }}
          >
            <img alt={lootbox.address} src={lootbox.stampImage} width="100%" />
          </$LootboxThumbailContainer>
        )
      })}
    </$Horizontal>
  )
}

const $LootboxThumbailContainer = styled.div<{ screen: ScreenSize }>`
  max-width: ${(props) => (props.screen === 'mobile' ? '100%' : '30%')};
  width: 100%;
  cursor: pointer;
  margin-bottom: 24px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
`

export const $SearchInput = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;
`

export const $ErrorMessage = styled.span`
  color: ${COLORS.dangerFontColor}ae;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
`

export const $Header = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor};
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  height: 40px;

  color: ${COLORS.surpressedFontColor}ae;

  &:focus {
    color: ${COLORS.black}ca;
  }
`

export const $InputLabel = styled.label`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor}ae;
`

export const $TextAreaMedium = styled.textarea`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  max-width: 100%;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  color: ${COLORS.surpressedFontColor}ae;

  &:focus {
    color: ${COLORS.black}ca;
  }
`
