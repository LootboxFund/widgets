import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import { NetworkOption, NETWORK_OPTIONS } from 'lib/api/network'
import ViewPartyBaskets, { ViewPartyBasketProps } from './index'

export default {
  title: 'ViewPartyBaskets',
  component: ViewPartyBaskets,
}

const Demo = (args: ViewPartyBasketProps) => {
  return (
    <ApolloProvider client={client}>
      <ViewPartyBaskets {...args} network={NETWORK_OPTIONS[0]} />{' '}
    </ApolloProvider>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
