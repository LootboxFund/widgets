import react, { forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/CreateLootbox/StepCard'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $Button } from 'lib/components/Generics/Button'
import { COLORS, TYPOGRAPHY } from 'lib/theme'
import { NetworkOption } from 'lib/api/network'
import WalletStatus from 'lib/components/WalletStatus'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { useSnapshot } from 'valtio'
import { getUserBalanceOfNativeToken } from 'lib/hooks/useContract'
import { userState } from 'lib/state/userState'
import { Address } from '@wormgraph/helpers'
import { InitialUrlParams } from '../state'

export interface StepChooseTypeProps {
  stage: StepStage
  selectedNetwork?: NetworkOption
  onSelectType: (type: LootboxType) => void
  selectedType: LootboxType
  onNext: () => void
  setValidity: (bool: boolean) => void
  initialUrlParams?: InitialUrlParams
}

export type LootboxType = 'escrow' | 'instant' | 'tournament'
export const LOOTBOX_TYPE_OPTIONS = [
  {
    key: 'escrow' as LootboxType,
    emoji: '🎁',
    title: 'Escrow',
    bio: 'Use this if you have a target amount to fundraise. You can only access the money if you hit your target goal.',
    idealFor: 'Most Gamers, Guilds & Asset Purchases',
    helpText: 'An Escrow Lootbox is best when you need a minimum amount of funds ready before you start playing.',
  },
  {
    key: 'instant' as LootboxType,
    emoji: '🎉',
    title: 'Instant',
    bio: 'Use this if you want to instantly get the money and continue fundraising while you play.',
    idealFor: 'Streamers, Dungeon Crawls, Continous Spending',
    helpText:
      'An Instant Lootbox is best for when you do not know how much money you need, and the requirements may change as you play.',
  },
  {
    key: 'tournament' as LootboxType,
    emoji: '⚔️',
    title: 'Tournament',
    bio: 'Use this if you want to participate in an ESports Tournament with a set buy-in. Acts like Escrow.',
    idealFor: 'Casual & Competitive ESports',
    helpText:
      'ESports Tournaments have set buy-in price, such as $10 per player. Use a Tournament Lootbox to fundraise your buy-in and share profits with your sponsors.',
  },
]

const StepChooseType = forwardRef((props: StepChooseTypeProps, ref: React.RefObject<HTMLDivElement>) => {
  const { screen } = useWindowSize()
  const isMobile = screen === 'tablet' || screen === 'mobile'
  const snapUserState = useSnapshot(userState)
  const [errors, setErrors] = useState<string[] | undefined>(undefined)
  const [hasNonZeroTokens, setHasNonZeroToken] = useState<boolean>(false)

  const getLootboxType = (type: LootboxType) => {
    return LOOTBOX_TYPE_OPTIONS.find((option) => option.key === type)
  }

  const renderTypeOptions = () => {
    const selectType = (type: LootboxType) => {
      if (!!props.initialUrlParams?.type) {
        return // don't allow type to be changed if it's set in the url
      }
      props.onSelectType(type)
      props.setValidity(true)
    }
    return (
      <$Vertical spacing={2}>
        {LOOTBOX_TYPE_OPTIONS.map((option) => (
          <$NetworkOption
            isSelected={props.selectedType === option.key}
            themeColor={props.selectedNetwork?.themeColor}
            onClick={() => selectType(option.key)}
            key={option.key}
            isAvailable={!props.initialUrlParams?.type}
          >
            <$TypeIcon>{option.emoji}</$TypeIcon>

            <$Horizontal flex={1} justifyContent="space-between">
              <$NetworkName isAvailable={true} isSelected={props.selectedType === option.key}>
                {option.title}
              </$NetworkName>
            </$Horizontal>
          </$NetworkOption>
        ))}
      </$Vertical>
    )
  }
  return (
    <$StepChooseType style={props.stage === 'not_yet' ? { opacity: 0.2, cursor: 'not-allowed' } : {}}>
      {ref && <div ref={ref}></div>}
      <StepCard
        themeColor={props.selectedNetwork?.themeColor}
        stage={props.selectedNetwork ? props.stage : 'in_progress'}
        onNext={props.onNext}
        errors={errors}
      >
        <$Wrapper screen={screen}>
          <$Vertical flex={1}>
            <$StepHeading>
              2. Choose Lootbox Type
              <HelpIcon tipID="stepNetwork" />
              <ReactTooltip id="stepNetwork" place="right" effect="solid">
                Choose a Lootbox type based on your use case. Read the descriptions of each type to find which is right
                for you.
              </ReactTooltip>
            </$StepHeading>
            <$StepSubheading>Use the default option “Escrow” if you don’t know which to pick.</$StepSubheading>
            <br />
            {renderTypeOptions()}
          </$Vertical>
          <$Vertical flex={1} style={{ justifyContent: 'flex-end' }}>
            <div
              style={
                isMobile
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      paddingBottom: '20px',
                      flex: 1,
                      width: '100%',
                    }
                  : {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }
              }
            >
              <$BigTypeOption screen={screen}>{getLootboxType(props.selectedType)?.emoji || '💰'}</$BigTypeOption>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  paddingLeft: '20px',
                }}
              >
                <$Horizontal>
                  <$TypeTitle>{getLootboxType(props.selectedType)?.title}</$TypeTitle>
                  <HelpIcon tipID={`stepType${props.selectedType}`} />
                  <ReactTooltip id={`stepType${props.selectedType}`} place="right" effect="solid">
                    {getLootboxType(props.selectedType)?.helpText}
                  </ReactTooltip>
                </$Horizontal>
                <$StepSubheading style={{ width: '100%' }}>{getLootboxType(props.selectedType)?.bio}</$StepSubheading>
                <span style={{ display: 'inline', marginTop: '10px' }}>
                  <b style={{ color: COLORS.surpressedFontColor }}>Ideal for:</b>{' '}
                  <$StepSubheading>{getLootboxType(props.selectedType)?.idealFor}</$StepSubheading>
                </span>
              </div>
            </div>
          </$Vertical>
        </$Wrapper>
      </StepCard>
    </$StepChooseType>
  )
})

const $StepChooseType = styled.section<{}>`
  font-family: sans-serif;
  width: 100%;
  color: ${COLORS.black};
`

export const $TypeIcon = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  font-size: ${(props) => (props.size === 'large' ? '2.2rem' : props.size === 'medium' ? '1.7rem' : '1.5rem')};
`

export const $BigTypeOption = styled.span<{ screen?: 'mobile' | 'tablet' | 'desktop' }>`
  font-size: ${(props) => (props.screen === 'desktop' ? '4rem' : props.screen === 'tablet' ? '3rem' : '3rem')};
  ${(props) => props.screen !== 'desktop' && `margin-left: 20px; margin-top: 30px; margin-bottom: 10px;`}
`

export const $Wrapper = styled.div<{ screen: ScreenSize }>`
  flex: 1;
  display: flex;
  flex-direction: ${(props) => (props.screen === 'mobile' || props.screen === 'tablet' ? 'column' : 'row')};
  justify-content: space-between;
`

const $TypeTitle = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${COLORS.surpressedFontColor};
  line-height: 2rem;
`

const $NetworkOption = styled.button<{ isAvailable?: boolean; themeColor?: string; isSelected?: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 8px 10px;
  flex: 1;
  display: flex;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: 0.5px solid #cdcdcd;
  ${(props) => (props.isAvailable ? 'cursor: pointer' : 'cursor: not-allowed')};
  ${(props) =>
    props.themeColor && props.isSelected
      ? `background-color: ${props.themeColor}`
      : props.isAvailable && 'background-color: white'};
  ${(props) => !props.isSelected && props.isAvailable && 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);'}
`

const $NetworkName = styled.span<{ isAvailable?: boolean; isSelected?: boolean }>`
  font-size: ${TYPOGRAPHY.fontSize.large};
  ${(props) => props.isAvailable && 'text-transform: uppercase'};
  ${(props) =>
    props.isAvailable ? `font-weight: ${TYPOGRAPHY.fontWeight.bold}` : `font-weight: ${TYPOGRAPHY.fontWeight.light}`};
  margin-left: 20px;
  ${(props) => props.isSelected && 'color: white'};
`

export default StepChooseType
