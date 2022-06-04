import styled from 'styled-components'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import $Button from '../Generics/Button'
import { ScreenSize } from 'lib/hooks/useScreenSize'
import { Lootbox, LootboxTournamentSnapshot } from 'lib/api/graphql/generated/types'
import { $Horizontal, $p, $h1, $span, $Vertical, $h3 } from '../Generics'
import { $Link, Oopsies } from '../Profile/common'

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

  const truncate = screen === 'mobile' ? 250 : 350

  return (
    <$DescriptionContainer>
      <$HideTings isHidden={isHidden}>
        {isHidden ? (
          <$Button
            onClick={() => setIsHidden(!isHidden)}
            screen={screen}
            backgroundColor={COLORS.white}
            color={`${COLORS.surpressedFontColor}5a`}
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
      <$p whitespace="pre-line">{isHidden ? description.slice(0, truncate) : description}</$p>
      {!isHidden ? (
        <$Button
          onClick={() => setIsHidden(!isHidden)}
          screen={screen}
          backgroundColor={COLORS.white}
          color={`${COLORS.surpressedFontColor}5a`}
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

interface LootboxListProps {
  onClickLootbox?: (lootbox: LootboxTournamentSnapshot) => void
  lootboxes: LootboxTournamentSnapshot[]
  screen: ScreenSize
  templateAction?: () => void
}
export const LootboxList = ({ lootboxes, screen, onClickLootbox, templateAction }: LootboxListProps) => {
  return (
    <$Horizontal justifyContent="flex-start" flexWrap spacing={4}>
      {!!templateAction ? (
        <$PlaceHolderLootboxListItem screen={screen} onClick={templateAction}>
          <$Vertical justifyContent="center" height="100%" spacing={3}>
            <$PlusIcon screen={screen} />
            <$h3 color={`${COLORS.surpressedFontColor}ae`} textAlign="center">
              CREATE NEW
            </$h3>
          </$Vertical>
        </$PlaceHolderLootboxListItem>
      ) : null}
      {lootboxes.length === 0 ? (
        <Oopsies
          title="Join by creating a Lootbox!"
          message={<$span>Looks like your the first one here! </$span>}
          icon={'🎉'}
        />
      ) : null}
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

const $PlusIcon = styled.div<{ screen: ScreenSize }>`
  width: 75px;
  height: 75px;
  background-color: ${COLORS.surpressedBackground}30;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;

  :before {
    content: '+';
    margin: auto;
    font-size: 60px;
    font-weight: ${TYPOGRAPHY.fontWeight.bold};
    text-align: center;
    color: ${COLORS.surpressedFontColor}ae;
  }
`

const $PlaceHolderLootboxListItem = styled.div<{ screen: ScreenSize }>`
  max-width: ${(props) => (props.screen === 'mobile' ? '100%' : '30%')};
  width: 100%;
  cursor: pointer;
  margin-bottom: 24px;
  background-color: ${COLORS.surpressedBackground}1a;
  border-radius: 10px;
  min-height: 300px;
  box-shadow: 0px 4px 30px rgb(33 182 246 / 67%);
`

const $LootboxThumbailContainer = styled.div<{ screen: ScreenSize }>`
  max-width: ${(props) => (props.screen === 'mobile' ? '100%' : '30%')};
  width: 100%;
  cursor: pointer;
  margin-bottom: 24px;
  border-radius: 10px;
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
