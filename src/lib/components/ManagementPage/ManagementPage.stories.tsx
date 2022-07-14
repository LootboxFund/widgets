import React, { useEffect, useState } from 'react'
import ManagementPage, { ManagementPageProps } from 'lib/components/ManagementPage'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'
import LocalizationWrapper from '../Internationalization/LocalizationWrapper'

export default {
  title: 'Management Page',
  component: ManagementPage,
}

const Template = (args: ManagementPageProps) => {
  return (
    <ApolloProvider client={client}>
      <LocalizationWrapper>
        <ManagementPage {...args} />
      </LocalizationWrapper>
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
