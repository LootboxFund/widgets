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
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'
import $Button from 'lib/components/Generics/Button'
import { COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { convertFilenameToThumbnail } from '@wormgraph/helpers'

interface LootboxListProps {
  onClickLootbox?: (lootbox: LootboxSnapshot) => void
  lootboxes: LootboxSnapshot[]
  screen: ScreenSize
}
const LootboxList = ({ lootboxes, screen, onClickLootbox }: LootboxListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const words = useWords()

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
        placeholder={`🔍 ${words.searchLootboxesByNameOrAddress}`}
        onChange={(e) => setSearchTerm(e.target.value || '')}
      />
      <$Horizontal justifyContent="space-between" flexWrap>
        {filteredLootboxes.map((lootbox, index) => (
          <$LootboxThumbailContainer
            key={index}
            screen={screen}
            onClick={() => {
              onClickLootbox && onClickLootbox(lootbox)
            }}
          >
            <img
              alt={lootbox.name}
              src={lootbox.stampImage ? convertFilenameToThumbnail(lootbox.stampImage, 'md') : TEMPLATE_LOOTBOX_STAMP}
              width="100%"
            />
          </$LootboxThumbailContainer>
        ))}
      </$Horizontal>
    </$Vertical>
  )
}

const MyLootboxes = () => {
  const words = useWords()
  const intl = useIntl()
  const { screen } = useWindowSize()
  const { data, loading, error } = useQuery<{
    getMyProfile: GetMyProfileResponse
  }>(GET_MY_WALLET_LOOTBOXES)

  const couldNotFindLootboxText = intl.formatMessage({
    id: 'profile.lootboxes.couldNotFindLootbox',
    defaultMessage: "We couldn't find your Lootbox",
    description: 'Message displayed when the user does not have any lootboxes.',
  })

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies title={words.anErrorOccured} message={error?.message || ''} icon="🤕" />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies title={words.anErrorOccured} message={data?.getMyProfile?.error?.message || ''} icon="🤕" />
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
        <$h1>
          <FormattedMessage
            id="profile.lootboxes.title"
            defaultMessage="My Lootboxes"
            description="Title for the user's Lootboxes section where they can browse the lootboxes they make"
          />
        </$h1>
        <$span>
          <$Link fontStyle="normal" style={{ marginBottom: '15px' }} onClick={navigateToCreateLootbox}>
            {words.createLootbox}
          </$Link>
        </$span>
      </$Vertical>
      {lootboxSnapshots.length > 0 ? (
        <LootboxList lootboxes={lootboxSnapshots} screen={screen} onClickLootbox={navigateToLootbox} />
      ) : (
        <$Vertical spacing={4}>
          <Oopsies
            icon="🎁"
            title={words.createLootbox}
            message={
              <FormattedMessage
                id="profile.lootboxes.noLootboxes"
                defaultMessage="Already made one? Then you need to add your wallet ☝️ Otherwise, you can {createLootboxHyperLink}."
                description="Message when the user has no Lootboxes listed on their page. There is a button shown above to add their wallet, which will help them find their lootboxes."
                values={{
                  createLootboxHyperLink: (
                    <$Link target="_self" href={manifest.microfrontends.webflow.createPage}>
                      {words.createLootbox}
                    </$Link>
                  ),
                }}
              />
            }
          />
          <$Link target="_self" href={manifest.microfrontends.webflow.createPage}>
            <$Button
              screen={screen}
              backgroundColor={`${COLORS.trustBackground}C0`}
              backgroundColorHover={`${COLORS.trustBackground}`}
              color={COLORS.trustFontColor}
              style={{
                fontWeight: TYPOGRAPHY.fontWeight.regular,
                fontSize: TYPOGRAPHY.fontSize.large,
                boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
              }}
            >
              {words.createLootbox}
            </$Button>
          </$Link>
        </$Vertical>
      )}
    </$Vertical>
  )
}

const $LootboxThumbailContainer = styled.div<{ screen: ScreenSize }>`
  max-width: ${(props) => (props.screen === 'mobile' ? '300px' : '32%')};
  width: 100%;
  cursor: pointer;
  margin-bottom: 10px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
  overflow: hidden;
`
export default MyLootboxes
