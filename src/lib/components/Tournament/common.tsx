import styled from 'styled-components'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { useState } from 'react'
import $Button from '../Generics/Button'
import { ScreenSize } from 'lib/hooks/useScreenSize'
import { Lootbox, LootboxTournamentSnapshot } from 'lib/api/graphql/generated/types'
import { $Horizontal, $p, $h1, $span, $Vertical, $h3, $h2 } from '../Generics'
import { $Link, Oopsies } from '../Profile/common'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

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
`

const $DescriptionContainer = styled.div`
  position: relative;
`

export const HiddenDescription = ({ description, screen }: { description: string; screen: ScreenSize }) => {
  const words = useWords()
  const [isHidden, setIsHidden] = useState(true)

  const truncate = screen === 'mobile' ? 250 : 550

  if (description.length < 250) {
    return (
      <$DescriptionContainer>
        <$p whitespace="pre-line">{description}</$p>
      </$DescriptionContainer>
    )
  }

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
              textTransform: 'capitalize',
            }}
          >
            {words.readMore}
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
            textTransform: 'capitalize',
          }}
        >
          {words.hide}
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
  const intl = useIntl()
  const words = useWords()
  const [searchTerm, setSearchTerm] = useState('')

  const joinTournamentText = intl.formatMessage({
    id: 'tournament.lootboxList.joinTournament',
    defaultMessage: 'Join by creating a Lootbox!',
    description: 'Text prompting user to join an esports tournament by making a new Lootbox',
  })

  const filteredLootboxSnapshots: LootboxTournamentSnapshot[] = !!searchTerm
    ? [
        ...(lootboxes?.filter(
          (snapshot) =>
            snapshot?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            snapshot?.address?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []),
      ]
    : [...(lootboxes || [])]

  return (
    <$Vertical spacing={4}>
      {!!templateAction && screen === 'mobile' && (
        <$Button
          screen={screen}
          onClick={templateAction}
          style={{
            height: '60px',
            backgroundColor: `${COLORS.trustBackground}`,
            color: `${COLORS.trustFontColor}`,
            filter: 'drop-shadow(rgba(0, 178, 255, 0.5) 0px 4px 30px)',
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
          }}
        >
          <FormattedMessage
            id="tournament.lootboxList.templateActionButton"
            defaultMessage="Join the Tournament"
            description="message to prompt a user to join an esports tournament"
          />
        </$Button>
      )}
      <$h2>
        <FormattedMessage
          id="tournament.lootboxList.title"
          defaultMessage="Teams in this Tournament"
          description="Header for section that displays lootboxes (or teams) in a tournament. A team is actually a Lootbox."
        />
      </$h2>
      <$SearchInput
        type="search"
        placeholder={`🔍 ${words.searchLootboxesByNameOrAddress}`}
        onChange={(e) => setSearchTerm(e.target.value || '')}
      />
      <$Horizontal justifyContent="flex-start" flexWrap spacing={4}>
        {!!templateAction && screen !== 'mobile' && (
          <$PlaceHolderLootboxListItem screen={screen} onClick={templateAction}>
            <$Vertical justifyContent="center" height="100%" spacing={3}>
              <$PlusIcon screen={screen} />
              <$h3 color={`${COLORS.surpressedFontColor}ae`} textAlign="center" style={{ textTransform: 'uppercase' }}>
                {words.createNew}
              </$h3>
            </$Vertical>
          </$PlaceHolderLootboxListItem>
        )}
        {lootboxes.length === 0 ? (
          <Oopsies
            title={joinTournamentText}
            message={
              <FormattedMessage
                id="tournament.lootboxList.firstHere"
                defaultMessage="Looks like your the first one here!"
                description="Message to display when there are no lootboxes in a tournament. It should make the user want to create a Lootbox."
              />
            }
            icon={'🎉'}
          />
        ) : null}
        {filteredLootboxSnapshots.map((lootbox, index) => {
          return (
            <$LootboxThumbailContainer
              key={index}
              screen={screen}
              onClick={() => {
                onClickLootbox && onClickLootbox(lootbox)
              }}
            >
              <img alt={lootbox.name} src={lootbox.stampImage || TEMPLATE_LOOTBOX_STAMP} width="100%" />
            </$LootboxThumbailContainer>
          )
        })}
      </$Horizontal>
    </$Vertical>
  )
}

export const tournamentWords = (intl: IntlShape) => {
  const titleRequired = intl.formatMessage({
    id: 'tournament.form.titleRequired',
    defaultMessage: 'Title is required',
    description: 'Error message shown to user when they dont have a tournament title',
  })

  const descriptionRequired = intl.formatMessage({
    id: 'tournament.form.descriptionRequired',
    defaultMessage: 'Description is required',
    description: 'Error message shown to user when they dont have a tournament description whem creating / editing one',
  })

  const startDateRequired = intl.formatMessage({
    id: 'tournament.form.startDateRequired',
    defaultMessage: 'Battle date is required',
    description: 'Error message shown to user when they dont have a tournament battle date',
  })

  const landscapeRecommended = intl.formatMessage({
    id: 'tournament.form.landscapeRecommended',
    defaultMessage: 'Landscape image is recommended',
    description: 'Picture orientation recommened to look the best on website',
  })

  const editCoverPhoto = intl.formatMessage({
    id: 'tournament.form.editCoverPhoto',
    defaultMessage: 'Edit cover photo',
    description: 'Button to edit the cover photo of a tournament',
  })

  const addCoverPhoto = intl.formatMessage({
    id: 'tournament.form.addCoverPhoto',
    defaultMessage: 'Add a cover photo',
    description: 'Button to add a cover photo to a tournament',
  })

  const linkToOfficalTournament = intl.formatMessage({
    id: 'tournament.form.linkToOfficalTournament',
    defaultMessage: 'Link to official tournament',
    description:
      'This is a url to another website that is actually streaming the esport tournament, or where someone can go to get more info',
  })

  const titlePlaceholder = intl.formatMessage({
    id: 'tournament.edit.title.placeholder',
    defaultMessage: 'e.x. My Awesome Tournament',
    description: 'Placeholder for the tournament title form. Its an example tournament title.',
  })

  const prizePlaceholder = intl.formatMessage({
    id: 'tournament.edit.prize.placeholder',
    defaultMessage: 'e.x. $50 USD',
    description: 'Placeholder for the tournament prize form. Its an example tournament prize.',
  })

  const createTournament = intl.formatMessage({
    id: 'tournament.create.header',
    defaultMessage: 'Create a Tournament',
    description: 'Button text for the create tournament form - these are e-sports tournaments and or 1v1 battles etc',
  })

  const visitTournament = intl.formatMessage({
    id: 'tournament.visit.header',
    defaultMessage: 'Visit Tournament',
    description: 'Button text for the user to navigate to the public page of a given tournament',
  })

  return {
    titleRequired,
    descriptionRequired,
    startDateRequired,
    landscapeRecommended,
    editCoverPhoto,
    addCoverPhoto,
    linkToOfficalTournament,
    titlePlaceholder,
    createTournament,
    prizePlaceholder,
    visitTournament,
  }
}

const $PlusIcon = styled.div<{ screen: ScreenSize }>`
  width: 75px;
  height: 75px;
  background-color: ${COLORS.surpressedBackground}30;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

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

export const $TournamentCover = styled.img`
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  border: 0px solid transparent;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
`
