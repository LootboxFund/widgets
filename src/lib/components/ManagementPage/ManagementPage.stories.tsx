import React, { useEffect, useState } from 'react'
import ManagementPage, { ManagementPageProps } from 'lib/components/ManagementPage'
import client from 'lib/api/graphql/client'
import { ApolloProvider } from '@apollo/client'

export default {
  title: 'Management Page',
  component: ManagementPage,
}

const Template = (args: ManagementPageProps) => {
  return (
    <ApolloProvider client={client}>
      <ManagementPage {...args} />
    </ApolloProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {}
