import react, { useState } from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading, StepStage } from 'lib/components/StepCard'
import { truncateAddress } from 'lib/api/helpers'
import { $Horizontal, $Vertical } from 'lib/components/Generics';
import NetworkText from 'lib/components/NetworkText';
import { ChainIDHex, ChainIDDecimal } from '@guildfx/helpers';
import { COLORS, TYPOGRAPHY } from 'lib/theme';
import $Input from 'lib/components/Input';
import useWindowSize from 'lib/hooks/useScreenSize';
import { $NetworkIcon, NetworkOption } from '../StepChooseNetwork';

export interface SocialFragment {
  slug: string;
  name: string;
  placeholder: string;
  icon: string;
}
const SOCIALS: SocialFragment[] = [
  { slug: 'twitter', name: 'Twitter', placeholder: 'Twitter handle', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftwitter.png?alt=media' },
  { slug: 'email', name: 'Email', placeholder: 'contact@you.com', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Femail.png?alt=media' },
  { slug: 'instagram', name: 'Instagram', placeholder: 'Instagram username', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Finstagram.png?alt=media' },
  { slug: 'tiktok', name: 'Tiktok', placeholder: 'Tiktok username', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftiktok.png?alt=media' },
  { slug: 'facebook', name: 'Facebook', placeholder: 'Facebook page or account', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ffacebook.png?alt=media' },
  { slug: 'discord', name: 'Discord', placeholder: 'Discord Server', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fdiscord.png?alt=media' },
  { slug: 'youtube', name: 'YouTube', placeholder: 'YouTube Video', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fyoutube.png?alt=media' },
  { slug: 'snapchat', name: 'Snapchat', placeholder: 'Snapchat username', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fsnapchat.png?alt=media' },
  { slug: 'twitch', name: 'Twitch', placeholder: 'Twitch handle', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Ftwitch.png?alt=media' },
  { slug: 'web', name: 'Website', placeholder: 'www.website.com', icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2Fweb.png?alt=media' }
]


export interface StepSocialsProps {
  stage: StepStage;
  selectedNetwork?: NetworkOption;
  onNext: () => void;
  socialState: Record<string, string>;
  updateSocialState: (slug: string, text: string) => void;
}
const StepSocials = (props: StepSocialsProps) => {
  const { screen } = useWindowSize()

  
	return (
		<$StepSocials>
      <StepCard primaryColor={props.selectedNetwork?.themeColor} stage={props.stage} onNext={props.onNext}>
        <$Vertical flex={1}>
          <$StepHeading>5. Contact Information</$StepHeading>
          <$StepSubheading>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</$StepSubheading>
          <br /><br />
          <$SocialGridInputs>
            {
              SOCIALS.map(social => {
                return (
                  <$Horizontal style={{ marginRight: "20px" }}>
                    <$SocialLogo src={social.icon} />
                    <$InputMedium style={{ width: '100%' }} value={props.socialState[social.slug]} onChange={(e) => props.updateSocialState(social.slug, e.target.value)} placeholder={social.name}></$InputMedium>
                  </$Horizontal>
                )
              })
            }
          </$SocialGridInputs>
        </$Vertical>
      </StepCard>
		</$StepSocials>
	)
}

const $StepSocials = styled.section<{}>`
  font-family: sans-serif;
`
const $SocialGridInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto; 
  column-gap: 10px;
  row-gap: 15px;
`

const $SocialLogo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`

export const $InputMedium = styled.input`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 20px;
  font-size: 1rem;
`

export default StepSocials;