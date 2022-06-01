import { ApolloClient, InMemoryCache } from '@apollo/client'
import { manifest } from 'manifest'

const client = new ApolloClient({
  uri: manifest.cloudRun.containers.lootboxServer.fullRoute || 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
  name: 'LootboxWidgets',
  version: '1.0',
})

export default client
