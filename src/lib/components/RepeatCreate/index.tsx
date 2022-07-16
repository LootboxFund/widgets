import react, { useState } from 'react'
import styled from 'styled-components'
import { $Vertical, $Horizontal } from 'lib/components/Generics'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { FormattedMessage } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import $Button from 'lib/components/Generics/Button'
import useWindowSize from 'lib/hooks/useScreenSize'
import Spinner from 'lib/components/Generics/Spinner'

export interface RepeatCreateProps {
  tournamentName: string
  themeColor: string
}
const RepeatCreate = (props: RepeatCreateProps) => {
  const { screen } = useWindowSize()
  const [submitStatus, setSubmitStatus] = useState<'unsubmitted' | 'loading' | 'error' | 'success'>('unsubmitted')
  const [chosenLootbox, setChosenLootbox] = useState<Address>()
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const pastLootboxes = [
    {
      chain: {
        address: '0x27e66fbB949f9853B0E406ddCde42E8362349f96',
      },
      image:
        'https://storage.googleapis.com/lootbox-stamp-prod/0x27e66fbB949f9853B0E406ddCde42E8362349f96%2Flootbox.png?alt=media',
    },
    {
      chain: {
        address: '0xC380b2751663975C25d2e7e0514df80ee0baC847',
      },
      image:
        'https://storage.googleapis.com/lootbox-stamp-prod/0xC380b2751663975C25d2e7e0514df80ee0baC847%2Flootbox.png?alt=media',
    },
    {
      chain: {
        address: '0xd0b948d0B348a06E6fB344161406938cbe55A207',
      },
      image:
        'https://storage.googleapis.com/lootbox-stamp-prod/0xd0b948d0B348a06E6fB344161406938cbe55A207%2Flootbox.png?alt=media',
    },
    {
      chain: {
        address: '0x6D2742Bb7D0d15F6B8EB4ba235aAA12437261421',
      },
      image:
        'https://storage.googleapis.com/lootbox-stamp-prod/0x6D2742Bb7D0d15F6B8EB4ba235aAA12437261421%2Flootbox.png?alt=media',
    },
    {
      chain: {
        address: '0x5Abba31a70Abf589FBDeb234F8364702628c2eF7',
      },
      image:
        'https://storage.googleapis.com/lootbox-stamp-prod/0x5Abba31a70Abf589FBDeb234F8364702628c2eF7%2Flootbox.png?alt=media',
    },
  ]
  const joinTournament = async () => {
    setSubmitStatus('loading')
    setTimeout(() => {
      setSubmitStatus('success')
      setErrorMessages([])
    }, 2000)
    setTimeout(() => {
      setSubmitStatus('error')
      setErrorMessages(['Something went wrong'])
    }, 4000)
  }
  const renderButton = () => {
    if (submitStatus === 'loading') {
      return (
        <$Button
          screen={screen}
          backgroundColor={`${props.themeColor}30`}
          backgroundColorHover={props.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
          disabled={true}
        >
          <Spinner color={`${COLORS.surpressedFontColor}ae`} size="15px" margin="auto" />
        </$Button>
      )
    }
    if (submitStatus === 'success') {
      return (
        <$Button
          screen={screen}
          backgroundColor={COLORS.successFontColor}
          backgroundColorHover={COLORS.successFontColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          SUCCESSFULLY JOINED!
        </$Button>
      )
    }
    if (submitStatus === 'error') {
      return (
        <$Button
          screen={screen}
          onClick={() => joinTournament()}
          backgroundColor={COLORS.dangerFontColor}
          backgroundColorHover={props.themeColor}
          color={COLORS.white}
          style={{
            boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontSize: TYPOGRAPHY.fontSize.large,
            padding: '15px',
            borderRadius: '5px',
          }}
        >
          FAILURE! TRY AGAIN?
        </$Button>
      )
    }
    return (
      <$Button
        screen={screen}
        onClick={() => joinTournament()}
        backgroundColor={chosenLootbox ? props.themeColor : `${props.themeColor}30`}
        backgroundColorHover={props.themeColor}
        color={COLORS.white}
        style={{
          boxShadow: '0px 4px 4px rgb(0 0 0 / 10%)',
          fontWeight: TYPOGRAPHY.fontWeight.bold,
          fontSize: TYPOGRAPHY.fontSize.large,
          padding: '15px',
          borderRadius: '5px',
        }}
        disabled={!chosenLootbox}
      >
        JOIN TOURNAMENT
      </$Button>
    )
  }
  return (
    <$RepeatCreate>
      <$Vertical>
        <$HeadText>{`Join ${props.tournamentName}`}</$HeadText>
        <span
          style={{ fontSize: '1.3rem', marginTop: '10px', fontFamily: 'sans-serif', color: COLORS.surpressedFontColor }}
        >
          Reusing a past design
        </span>
        <br />
        <$Vertical>
          <$Horizontal style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8rem', fontFamily: 'sans-serif', color: COLORS.surpressedFontColor }}>
              Pick a Past Design
            </p>
            <HelpIcon tipID="stepFunding" />
          </$Horizontal>
          <ReactTooltip id="stepFunding" place="right" effect="solid">
            <FormattedMessage
              id="create.lootbox.step.funding.helpTextMessage"
              defaultMessage="We cannot guarantee you will be able to fundraise your target amount. Maximize your chances by watching videos on our YouTube channel teaching best practices on how to fundraise."
              description="Help text for step 3: how much money do you need?"
            />
          </ReactTooltip>
        </$Vertical>
        <$Horizontal style={{ overflowX: 'scroll' }}>
          {pastLootboxes.map((lootbox, index) => {
            const blurred = chosenLootbox && chosenLootbox !== lootbox.chain.address ? true : false
            return (
              <$PastLootbox
                themeColor={props.themeColor}
                blurred={blurred}
                chosen={chosenLootbox === lootbox.chain.address}
              >
                <img
                  src={lootbox.image}
                  onClick={() => setChosenLootbox(lootbox.chain.address as Address)}
                  style={{ width: '100px', height: 'auto' }}
                />
              </$PastLootbox>
            )
          })}
        </$Horizontal>
        <br />
        {renderButton()}
        <$Horizontal justifyContent="center">
          {errorMessages.map((err) => {
            return <p style={{ color: COLORS.dangerFontColor, fontFamily: 'sans-serif' }}>{err}</p>
          })}
        </$Horizontal>
      </$Vertical>
    </$RepeatCreate>
  )
}

const $HeadText = styled.span`
  font-size: 1.7rem;
  font-weight: bold;
  font-family: sans-serif;
`

const $PastLootbox = styled.div<{ themeColor: string; blurred: boolean; chosen: boolean }>`
  margin: 5px;
  cursor: pointer;
  ${(props) => props.blurred && `opacity: 0.2;`};
  ${(props) => props.chosen && `filter: drop-shadow(0px 4px 10px ${props.themeColor});`}
  &:hover {
    ${(props) => `filter: drop-shadow(0px 4px 10px ${props.themeColor});`}
  }
`

const $RepeatCreate = styled.div<{}>`
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 10%);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
`

export default RepeatCreate