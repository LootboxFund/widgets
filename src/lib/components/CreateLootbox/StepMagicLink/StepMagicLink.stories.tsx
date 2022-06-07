import React from 'react'
import StepMagicLink, { StepMagicLinkProps } from 'lib/components/CreateLootbox/StepMagicLink'
import { ContractAddress } from '@wormgraph/helpers'

export default {
  title: 'StepMagicLink',
  component: StepMagicLink,
}

const Demo = (args: StepMagicLinkProps) => {
  const network = {
    name: 'Binance',
    symbol: 'BNB',
    themeColor: '#F0B90B',
    chainIdHex: 'a',
    chainIdDecimal: '',
    isAvailable: true,
    icon: 'https://firebasestorage.googleapis.com/v0/b/guildfx-exchange.appspot.com/o/assets%2Ftokens%2FBNB.png?alt=media',
    priceFeed: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526' as ContractAddress,
  }
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
      uploadLogo={async () => Promise.resolve('logoImage')}
      uploadCover={async () => Promise.resolve('coverImage')}
      stage="in_progress"
      selectedNetwork={network}
    />
  )
}
export const Basic = Demo.bind({})
Basic.args = {}
