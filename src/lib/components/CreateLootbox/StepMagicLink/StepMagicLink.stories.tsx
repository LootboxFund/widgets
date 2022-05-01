import React from 'react'
import StepMagicLink, { StepMagicLinkProps } from 'lib/components/CreateLootbox/StepMagicLink'

export default {
  title: 'StepMagicLink',
  component: StepMagicLink,
}

const Demo = (args: StepMagicLinkProps) => {
  return (
    <StepMagicLink
      network="0x61"
      type={undefined}
      fundingTarget={undefined}
      fundingLimit={undefined}
      receivingWallet={undefined}
      returnsTarget={undefined}
      returnsDate={undefined}
      logoImage={undefined}
      coverImage={undefined}
      themeColor={undefined}
      campaignBio={undefined}
      campaignWebsite={undefined}
    />
  )
}
export const Basic = Demo.bind({})
Basic.args = {}
