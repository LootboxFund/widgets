import { useQuery } from '@apollo/client'
import { GetMyProfileResponse, GetMyProfileSuccess, LootboxSnapshot } from 'lib/api/graphql/generated/types'
import { $h1, $Horizontal, $p, $Vertical } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { GET_MY_WALLET_LOOTBOXES } from './api.gql'
import { Oopsies, $Link } from '../common'
import { manifest } from 'manifest'

interface LootboxListProps {
  onClickLootbox?: (lootbox: LootboxSnapshot) => void
  lootboxes: LootboxSnapshot[]
  screen: ScreenSize
}
const LootboxList = ({ lootboxes, screen, onClickLootbox }: LootboxListProps) => {
  return (
    <$Horizontal justifyContent="flex-start" flexWrap spacing={4}>
      {lootboxes.map((lootbox, index) => (
        <$LootboxThumbailContainer
          key={index}
          screen={screen}
          onClick={() => {
            onClickLootbox && onClickLootbox(lootbox)
          }}
        >
          <img alt={lootbox.address} src={lootbox.stampImage} width="100%" />
        </$LootboxThumbailContainer>
      ))}
    </$Horizontal>
  )
}

const MyLootboxes = () => {
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{
    getMyProfile: GetMyProfileResponse
  }>(GET_MY_WALLET_LOOTBOXES)

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies title="Error loading Lootboxes" message={error?.message || ''} icon="🤕" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies title="Error loading Lootboxes" message={data?.getMyProfile?.error?.message || ''} icon="🤕" />
  }

  const lootboxSnapshots: LootboxSnapshot[] = []
  const user = (data?.getMyProfile as GetMyProfileSuccess)?.user

  if (user?.wallets) {
    for (const wallet of user.wallets) {
      if (wallet.lootboxSnapshots) {
        lootboxSnapshots.push(...wallet.lootboxSnapshots)
      }
    }
  }

  return (
    <$Vertical spacing={4}>
      <$h1>My Lootboxes</$h1>
      {lootboxSnapshots.length > 0 ? (
        <LootboxList lootboxes={lootboxSnapshots} screen={screen} />
      ) : (
        <Oopsies
          title="We couldn't find your Lootbox"
          message={
            <span>
              Already made one? Then you need to add your wallet ☝️ Otherwise, you can{' '}
              <$Link target="_blank" href={manifest.microfrontends.webflow.createPage}>
                create a Lootbox here.
              </$Link>
            </span>
          }
          icon="🧐"
        />
      )}
    </$Vertical>
  )
}

const $LootboxThumbailContainer = styled.div<{ screen: ScreenSize }>`
  max-width: ${(props) => (props.screen === 'mobile' ? '100%' : '30%')};
  width: 100%;
  cursor: pointer;
  margin-bottom: 24px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
`
export default MyLootboxes
