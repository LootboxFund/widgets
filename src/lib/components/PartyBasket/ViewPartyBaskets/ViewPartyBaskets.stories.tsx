import { ApolloProvider } from '@apollo/client'
import { Address } from '@wormgraph/helpers'
import client from 'lib/api/graphql/client'
import { NetworkOption, NETWORK_OPTIONS } from 'lib/api/network'
import parseUrlParams from 'lib/utils/parseUrlParams'
import { useEffect, useState } from 'react'
import ViewPartyBaskets, { ViewPartyBasketProps } from './index'

export default {
  title: 'ViewPartyBaskets',
  component: ViewPartyBaskets,
}

const Demo = (args: ViewPartyBasketProps) => {
  return (
    <ApolloProvider client={client}>
      <ViewPartyBaskets {...args} network={NETWORK_OPTIONS[0]} lootboxAddress={parseUrlParams('lootbox') as Address} />{' '}
    </ApolloProvider>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
