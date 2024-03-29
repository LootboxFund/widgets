import { useEffect, useState } from 'react'
import { COLORS, ContractAddress, TYPOGRAPHY } from '@wormgraph/helpers'
import { $Horizontal, $Container, $Vertical } from '../Generics'
import { getSocials } from 'lib/hooks/constants'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { readLootboxMetadata } from 'lib/api/storage'
import styled from 'styled-components'
import { useWeb3Utils } from 'lib/hooks/useWeb3Api'
import { FormattedMessage, useIntl } from 'react-intl'
import useWords from 'lib/hooks/useWords'

interface SocialsProps {
  lootbox: ContractAddress | undefined
}

interface SocialsState {
  [key: string]: string
}

const Socials = ({ lootbox }: SocialsProps) => {
  const intl = useIntl()
  const words = useWords()
  const SOCIALS = getSocials(intl)
  const { screen } = useWindowSize()
  const web3Utils = useWeb3Utils()
  const [basisPointsReturnTarget, setBasisPointsReturnTarget] = useState('0')
  const [targetPaybackDateUnix, setTargetPaybackDateUnix] = useState(0)
  const [lootboxDescription, setLootboxDescription] = useState('')
  const [socials, setSocials] = useState<SocialsState>({
    twitter: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    discord: '',
    snapchat: '',
    twitch: '',
    web: '',
  })

  useEffect(() => {
    if (lootbox) {
      readLootboxMetadata(lootbox)
        .then((metadata) => {
          setBasisPointsReturnTarget(metadata?.lootboxCustomSchema?.lootbox?.basisPointsReturnTarget || '0')
          setTargetPaybackDateUnix(metadata?.lootboxCustomSchema?.lootbox?.targetPaybackDate || 0)
          setLootboxDescription(metadata?.lootboxCustomSchema?.lootbox.description || '')
          setSocials({
            twitter: metadata?.lootboxCustomSchema?.socials?.twitter || '',
            youtube: metadata?.lootboxCustomSchema?.socials?.youtube || '',
            instagram: metadata?.lootboxCustomSchema?.socials?.instagram || '',
            tiktok: metadata?.lootboxCustomSchema?.socials?.tiktok || '',
            facebook: metadata?.lootboxCustomSchema?.socials?.facebook || '',
            discord: metadata?.lootboxCustomSchema?.socials?.discord || '',
            snapchat: metadata?.lootboxCustomSchema?.socials?.snapchat || '',
            twitch: metadata?.lootboxCustomSchema?.socials?.twitch || '',
            web: metadata?.lootboxCustomSchema?.socials?.web || '',
          })
        })
        .catch((err) => {
          console.error('Error fetching metadata for socials', err)
        })
    }
  }, [lootbox])

  const formattedROI = web3Utils
    .fromWei(new web3Utils.BN(basisPointsReturnTarget).mul(new web3Utils.BN(10)), 'kwei')
    .toString()
  const today = new Date()
  const paybackDate = new Date(targetPaybackDateUnix)
  const diffTime = paybackDate.valueOf() - today.valueOf()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <$Container screen={screen}>
      <$Vertical spacing={2}>
        {/* <$Vertical spacing={1}>
          <$TargetReturnHeader>
            <FormattedMessage
              id="socials.targetReturn"
              defaultMessage="{returnPercentage}% Target Return"
              description="Percentage return on investment that investors can expect to receive from a lootbox"
              values={{
                returnPercentage: formattedROI,
              }}
            />
          </$TargetReturnHeader>
          <$PaybackDateSubHeader>{words.inDays(diffDays < 0 ? 0 : diffDays)}</$PaybackDateSubHeader>
        </$Vertical> */}
        {lootboxDescription ? (
          <$Vertical spacing={2}>
            <$TargetReturnHeader>
              <FormattedMessage
                id="socials.aboutLootbox"
                defaultMessage="About this Lootbox"
                description="Header for the Lootbox description section"
              />
            </$TargetReturnHeader>
            <$LootboxDescription>{lootboxDescription}</$LootboxDescription>
          </$Vertical>
        ) : undefined}

        <$SocialGridInputs screen={screen} style={{ paddingBottom: '20px' }}>
          {SOCIALS.filter((social) => social.slug !== 'email').map((social) => {
            return (
              <$Horizontal
                key={social.slug}
                style={screen === 'mobile' ? { marginBottom: '10px' } : { marginRight: '20px' }}
              >
                <$SocialLogo src={social.icon} />
                <$InputMedium
                  style={{ width: '100%' }}
                  value={socials[social.slug]}
                  placeholder={social.placeholder}
                  disabled
                ></$InputMedium>
              </$Horizontal>
            )
          })}
        </$SocialGridInputs>
      </$Vertical>
    </$Container>
  )
}

const $TargetReturnHeader = styled.h1`
  font-size: ${TYPOGRAPHY.fontSize.xxlarge};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
`

const $PaybackDateSubHeader = styled.p`
  font-size: ${TYPOGRAPHY.fontSize.large};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  color: ${COLORS.surpressedFontColor};
  margin-top: 0.5em;
  margin-bottom: 0;
`

const $AboutLootboxHeader = styled.h1`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
`

const $LootboxDescription = styled.p`
  font-size: ${TYPOGRAPHY.fontSize.medium};
  font-family: ${TYPOGRAPHY.fontFamily.regular};
  font-weight: ${TYPOGRAPHY.fontWeight.light};
  margin-top: 0.5em;
  margin-bottom: 1.5em;
  color: ${COLORS.surpressedFontColor};
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

export default Socials
