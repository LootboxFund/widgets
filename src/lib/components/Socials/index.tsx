import { useEffect, useState } from 'react'
import { ContractAddress } from '@wormgraph/helpers'
import { $Horizontal, $Container } from '../Generics'
import { $SocialGridInputs, $SocialLogo, $InputMedium } from '../CreateLootbox/StepSocials'
import { SOCIALS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import { readTicketMetadata } from 'lib/api/storage'

interface SocialsProps {
  lootbox: ContractAddress | undefined
}

interface SocialsState {
  [key: string]: string
}

const Socials = ({ lootbox }: SocialsProps) => {
  const { screen } = useWindowSize()
  const [socials, setSocials] = useState<SocialsState>({
    email: '',
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
      readTicketMetadata(lootbox)
        .then((metadata) => {
          setSocials({
            email: metadata?.socials?.email || '',
            twitter: metadata?.socials?.twitter || '',
            youtube: metadata?.socials?.youtube || '',
            instagram: metadata?.socials?.instagram || '',
            tiktok: metadata?.socials?.tiktok || '',
            facebook: metadata?.socials?.facebook || '',
            discord: metadata?.socials?.discord || '',
            snapchat: metadata?.socials?.snapchat || '',
            twitch: metadata?.socials?.twitch || '',
            web: metadata?.socials?.web || '',
          })
        })
        .catch((err) => {
          console.error('Error fetching metadata for socials', err)
        })
    }
  }, [lootbox])

  return (
    <$Container screen={screen}>
      <$SocialGridInputs screen={screen} style={{ paddingBottom: '20px' }}>
        {SOCIALS.map((social) => {
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
    </$Container>
  )
}

export default Socials
