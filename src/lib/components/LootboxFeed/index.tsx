import { $Horizontal, $Vertical } from '../Generics'
import { useQuery } from '@apollo/client'
import {
  LootboxFeedResponse,
  LootboxFeedResponseSuccess,
  LootboxSnapshot,
  QueryLootboxFeedArgs,
} from 'lib/api/graphql/generated/types'
import { QUERY_LOOTBOX_FEED } from './api.gql'
import Spinner from '../Generics/Spinner'
import { Oopsies } from '../Profile/common'
import { useState } from 'react'
import $Button from '../Generics/Button'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import styled from 'styled-components'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'
import { manifest } from 'manifest'
import useWords from 'lib/hooks/useWords'
import { convertFilenameToThumbnail } from 'lib/utils/storage'

const LootboxFeed = () => {
  const words = useWords()
  const { screen } = useWindowSize()
  const [lootboxes, setLootboxes] = useState<LootboxSnapshot[]>([])
  const [lastLootbox, setLastLootbox] = useState<null | string>(null)
  const { data, loading, error } = useQuery<{ lootboxFeed: LootboxFeedResponse }, QueryLootboxFeedArgs>(
    QUERY_LOOTBOX_FEED,
    {
      variables: { first: 12, after: lastLootbox },
      onCompleted: (data) => {
        if (data?.lootboxFeed?.__typename === 'LootboxFeedResponseSuccess') {
          const nodes = data.lootboxFeed.edges
          setLootboxes([...lootboxes, ...nodes.map((node) => node.node)])
        }
      },
    }
  )

  if (error) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.lootboxFeed?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.lootboxFeed?.error?.message || ''} icon="🤕" />
  }

  const { pageInfo } = (data?.lootboxFeed as LootboxFeedResponseSuccess) || {}

  const handleMore = () => {
    setLastLootbox(pageInfo?.endCursor || null)
  }

  return (
    <$Vertical spacing={4}>
      <$Horizontal flexWrap spacing={screen === 'mobile' ? undefined : 2} justifyContent="center">
        {lootboxes.map((lootbox, idx) => {
          return (
            <$LootboxMainImageContainer screen={screen} key={idx}>
              <a href={`${manifest.microfrontends.webflow.cosmicLootboxPage}?lid=${lootbox.id}`}>
                <$LootboxImage
                  screen={screen}
                  src={
                    lootbox.stampImage ? convertFilenameToThumbnail(lootbox.stampImage, 'md') : TEMPLATE_LOOTBOX_STAMP
                  }
                  alt={`${lootbox.name}`}
                />
              </a>
            </$LootboxMainImageContainer>
          )
        })}
      </$Horizontal>
      {loading && (
        <Spinner color={COLORS.surpressedBackground} style={{ textAlign: 'center', margin: '0 auto' }} size="50px" />
      )}
      {pageInfo?.hasNextPage && (
        <div
          style={{
            margin: '0 auto',
          }}
        >
          <$Button
            screen={screen}
            onClick={handleMore}
            style={{
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              color: COLORS.trustFontColor,
              backgroundColor: COLORS.trustBackground,
              textTransform: 'capitalize',
            }}
          >
            {words.seeMore}
          </$Button>
        </div>
      )}
    </$Vertical>
  )
}

const $LootboxImage = styled.img<{ screen: ScreenSize }>`
  width: 100%;
  height: unset;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  box-sizing: border-box;
  cursor: pointer;
`

const $LootboxMainImageContainer = styled.div<{ screen: ScreenSize }>`
  width: ${(props) => (props.screen === 'mobile' ? '100%' : '24%')};
  min-width: 200px;
  max-width: 300px;
  margin: 0px auto 10px;
`

export default LootboxFeed
