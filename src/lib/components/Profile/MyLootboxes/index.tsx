import { useQuery } from '@apollo/client'
import {
  GetMyProfileResponse,
  GetMyProfileResponseResolvers,
  GetMyProfileSuccess,
  LootboxSnapshot,
} from 'lib/api/graphql/generated/types'
import { $h1, $Horizontal, $p, $Vertical } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { GET_MY_WALLET_LOOTBOXES } from './api.gql'

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
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_WALLET_LOOTBOXES)

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <MyLootboxesError message={error?.message || ''} />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <MyLootboxesError message={data?.getMyProfile?.error?.message || ''} />
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
      <LootboxList lootboxes={lootboxSnapshots} screen={screen} />
    </$Vertical>
  )
}

const MyLootboxesError = ({ message }: { message: string }) => {
  return (
    <$Vertical>
      <$p>An error occured:</$p>
      <$p>{message}</$p>
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
