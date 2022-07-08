import { useQuery } from '@apollo/client'
import { GetMyProfileResponse, GetMyProfileSuccess, LootboxSnapshot } from 'lib/api/graphql/generated/types'
import { $h1, $Horizontal, $p, $span, $Vertical } from 'lib/components/Generics'
import Spinner from 'lib/components/Generics/Spinner'
import useWindowSize, { ScreenSize } from 'lib/hooks/useScreenSize'
import styled from 'styled-components'
import { GET_MY_WALLET_LOOTBOXES } from './api.gql'
import { Oopsies, $Link, $SearchInput } from '../common'
import { manifest } from 'manifest'
import { useState } from 'react'
import { TEMPLATE_LOOTBOX_STAMP } from 'lib/hooks/constants'

interface LootboxListProps {
  onClickLootbox?: (lootbox: LootboxSnapshot) => void
  lootboxes: LootboxSnapshot[]
  screen: ScreenSize
}
const LootboxList = ({ lootboxes, screen, onClickLootbox }: LootboxListProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLootboxes: LootboxSnapshot[] = !!searchTerm
    ? [
        ...(lootboxes?.filter(
          (snapshot) =>
            snapshot?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            snapshot?.address?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []),
      ]
    : [...(lootboxes || [])]

  return (
    <$Vertical spacing={4}>
      <$SearchInput
        type="search"
        placeholder="🔍 Search Lootboxes by Name or Address"
        onChange={(e) => setSearchTerm(e.target.value || '')}
      />
      <$Horizontal justifyContent="flex-start" flexWrap spacing={4}>
        {filteredLootboxes.map((lootbox, index) => (
          <$LootboxThumbailContainer
            key={index}
            screen={screen}
            onClick={() => {
              onClickLootbox && onClickLootbox(lootbox)
            }}
          >
            <img alt={lootbox.name} src={lootbox.stampImage || TEMPLATE_LOOTBOX_STAMP} width="100%" />
          </$LootboxThumbailContainer>
        ))}
      </$Horizontal>
    </$Vertical>
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

  const navigateToLootbox = ({ address }: LootboxSnapshot) => {
    window.open(`${manifest.microfrontends.webflow.lootboxUrl}?lootbox=${address}`, '_self')
  }

  const navigateToCreateLootbox = () => {
    window.open(`${manifest.microfrontends.webflow.createPage}`, '_self')
  }

  return (
    <$Vertical spacing={4}>
      <$Vertical>
        <$h1>My Lootboxes</$h1>
        <$span>
          <$Link fontStyle="normal" style={{ marginBottom: '15px' }} onClick={navigateToCreateLootbox}>
            Create a Lootbox
          </$Link>
        </$span>
      </$Vertical>
      {lootboxSnapshots.length > 0 ? (
        <LootboxList lootboxes={lootboxSnapshots} screen={screen} onClickLootbox={navigateToLootbox} />
      ) : (
        <Oopsies
          title="We couldn't find your Lootbox"
          message={
            <span>
              Already made one? Then you need to add your wallet ☝️ Otherwise, you can{' '}
              <$Link target="_self" href={manifest.microfrontends.webflow.createPage}>
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
  overflow: hidden;
`
export default MyLootboxes
