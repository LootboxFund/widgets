import { NetworkOption } from 'lib/api/network'
import react from 'react'
import styled from 'styled-components'
import StepCard, { $StepHeading, $StepSubheading } from 'lib/components/CreateLootbox/StepCard'
import { $Vertical } from 'lib/components/Generics'
import HelpIcon from 'lib/theme/icons/Help.icon'
import ReactTooltip from 'react-tooltip'
import { TournamentID } from 'lib/types'
import { $Link } from 'lib/components/Profile/common'
import { manifest } from 'manifest'
import { FormattedMessage } from 'react-intl'

export interface StepPrefillDisclaimerProps {
  selectedNetwork?: NetworkOption | undefined
  prefilledFields: string[]
  tournamentId?: TournamentID
}
const StepPrefillDisclaimer = (props: StepPrefillDisclaimerProps) => {
  return (
    <$StepPrefillDisclaimer>
      <StepCard themeColor={props.selectedNetwork?.themeColor} stage={'may_proceed'} onNext={() => {}} errors={[]}>
        <$Vertical>
          <$StepHeading>
            <FormattedMessage
              id="step.magicLink.disclaimer.heading"
              defaultMessage="You are using a Magic Link"
              description="Header when a user is making a lootbox with a magic link. for the information section of a user when they are using a magic link. A magic link is just a special URL used that speeds up the process of making a Lootbox"
            />
            <HelpIcon tipID="stepNetwork" />
            <ReactTooltip id="stepNetwork" place="right" effect="solid">
              <FormattedMessage
                id="step.magicLink.disclaimer.tooltip"
                defaultMessage='Want to create your own Magic Link? Scroll all the way down past "Step 7. Terms & Conditions". Click the button labeled "Create Magic Link".'
                description="Tooltip help message when a user is making a lootbox with a magic link"
              />
            </ReactTooltip>
          </$StepHeading>
          <$StepSubheading>
            <FormattedMessage
              id="step.magicLink.disclaimer.subheading"
              defaultMessage="Creating this Lootbox is easy because you are using a magic link that pre-fills several fields for you. Please use the pre-sets and customize the rest."
              description="Subheading for the information section of a user when they are using a magic link."
            />
          </$StepSubheading>
          <br />
          {props.tournamentId && (
            <$StepSubheading>
              <span>
                <FormattedMessage
                  id="step.magicLink.disclaimer.tournament"
                  defaultMessage="You're part of a tournament! Visit the tournament page by clicking 👉 {link}."
                  description="If a lootbox is part of a tournament, we tell the user here with a link to the tournament page."
                  values={{
                    link: (
                      <$Link
                        href={`${manifest.microfrontends.webflow.battlePage}?tid=${props.tournamentId}`}
                        target="_blank"
                      >
                        <FormattedMessage
                          id="step.magicLink.disclaimer.tournament.link"
                          defaultMessage="here"
                          description="This is a hyperlink to a different website page."
                        />
                      </$Link>
                    ),
                  }}
                />
              </span>
            </$StepSubheading>
          )}
          <br />
          <$StepSubheading>
            <FormattedMessage
              id="step.magicLink.disclaimer.subheading2"
              defaultMessage="The following {numFields} fields have been pre-filled and cannot be edited:"
              description="When using a magic link, certain fields for your Lootbox are pre-filled. This message indicates that to user."
              values={{
                numFields: props.prefilledFields.length,
              }}
            />
          </$StepSubheading>
          <br />
          {props.prefilledFields.map((desc, index) => (
            <$StepSubheading key={index}>
              <span style={{ marginRight: '20px' }}>✅</span>
              {desc}
            </$StepSubheading>
          ))}
        </$Vertical>
      </StepCard>
    </$StepPrefillDisclaimer>
  )
}

const $StepPrefillDisclaimer = styled.div<{}>`
  font-family: sans-serif;
  width: 100%;
`

export default StepPrefillDisclaimer
