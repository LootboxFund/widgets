import { useQuery } from '@apollo/client'
import { COLORS } from '@wormgraph/helpers'
import {
  Claim,
  QueryUserClaimsArgs,
  UserClaimsResponse,
  UserClaimsResponseSuccess,
} from 'lib/api/graphql/generated/types'
import { initLogging } from 'lib/api/logrocket'
import useWords from 'lib/hooks/useWords'
import { userState } from 'lib/state/userState'
import { UserID } from 'lib/types'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import Spinner from '../Generics/Spinner'
import { Oopsies } from '../Profile/common'
import { GET_USER_CLAIMS } from './api.gql'
import { extractURLState_PublicProfilePage } from './utils'

interface PublicProfileProps {
  userId: UserID
}
/**
 * @terran edit this component
 */
const PublicProfile = (props: PublicProfileProps) => {
  const words = useWords()
  const [lastCreatedAt, setLastCreatedAt] = useState<null | number>(null)
  const [userClaims, setUserClaims] = useState<Claim[]>([])
  const { data, loading, error } = useQuery<{ userClaims: UserClaimsResponse }, QueryUserClaimsArgs>(GET_USER_CLAIMS, {
    variables: { userId: props.userId, first: 6, after: lastCreatedAt },
    onCompleted: (data) => {
      if (data?.userClaims?.__typename === 'UserClaimsResponseSuccess') {
        const nodes = data.userClaims.edges
        setUserClaims([...userClaims, ...nodes.map((node) => node.node)])
      }
    },
  })

  if (loading) {
    return <Spinner color={`${COLORS.surpressedFontColor}ae`} size="50px" margin="10vh auto" />
  } else if (error) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.userClaims?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.userClaims?.error?.message || ''} icon="🤕" />
  }

  // Here we kinda coalesce the response into a predictable type
  const { edges, pageInfo } = (data?.userClaims as UserClaimsResponseSuccess) || {}

  const handleMore = () => {
    // fetchs another batch of claims
    setLastCreatedAt(pageInfo.endCursor || null)
  }

  return (
    <$PublicProfilePageContainer>
      {JSON.stringify(edges)}
      <button onClick={handleMore}>load more (intl me)</button>
    </$PublicProfilePageContainer>
  )
}

const PublicProfilePage = () => {
  useEffect(() => {
    const load = async () => {
      initLogging()
    }
    load()
  }, [])

  const userId = useMemo(() => {
    const { INITIAL_URL_PARAMS } = extractURLState_PublicProfilePage()
    return INITIAL_URL_PARAMS.userId
  }, [])

  if (!userId) {
    return <>No uid url param (intl me)</>
  }

  return <PublicProfile userId={userId as UserID} />
}

const $PublicProfilePageContainer = styled.div``

export default PublicProfilePage
