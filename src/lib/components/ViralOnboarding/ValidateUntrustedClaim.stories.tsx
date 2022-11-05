import { $ViralOnboardingCard } from '../Generics'
import { ApolloProvider } from '@apollo/client'
import client from 'lib/api/graphql/client'
import LocalizationWrapper from '../LocalizationWrapper'
import ValidateUntrustedClaim from './ValidateUntrustedClaim'

export default {
  title: 'ConvertUntrustedClaim',
  component: ValidateUntrustedClaim,
}

const Template = () => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <$ViralOnboardingCard>
          <ValidateUntrustedClaim />
          <br />
          <br />
        </$ViralOnboardingCard>
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
