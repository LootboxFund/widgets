import BattlePage from './index'
import LocalizationWrapper from '../LocalizationWrapper'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import { $CardViewport } from '../Generics'

export default {
  title: 'BattlePage',
  component: BattlePage,
}

const Demo = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$CardViewport width="100%" maxWidth="1200px" height="auto" margin="0 auto">
          <BattlePage />
          <br />
          <br />
          <br />
          <br />
          <br />
        </$CardViewport>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Demo.bind({})
Basic.args = {}
