import { useLazyQuery } from '@apollo/client'
import { GET_LOOTBOX } from './operations.gql'
import { QueryGetLootboxByAddressArgs, GetLootboxByAddressResponse, Lootbox } from 'lib/types'

interface Props {}

interface GetLootboxQueryResponse {
  getLootboxByAddress: {
    lootbox: Lootbox
  }
}

const Login = (props: Props) => {
  const [getLootbox, { data, loading, error }] = useLazyQuery<GetLootboxQueryResponse, QueryGetLootboxByAddressArgs>(
    GET_LOOTBOX
  )

  const queryDaBish = async () => {
    console.log('....querying....')
    await getLootbox({ variables: { address: '0xDb4c88fC88e1ca18d6b970038a97fb6f086974A2' } })
  }

  console.log('gql data:', data, loading, error)
  console.log('data:', data?.getLootboxByAddress?.lootbox)

  return (
    <div>
      Login
      <br />
      <button onClick={queryDaBish}>click</button>
    </div>
  )
}

export default Login
