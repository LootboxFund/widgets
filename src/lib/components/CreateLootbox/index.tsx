import react, { useEffect, useState } from 'react'
import styled from 'styled-components'
import $Button from 'lib/components/Button'
import { COLORS } from 'lib/theme'
import { updateStateToChain, useUserInfo } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { useSnapshot } from 'valtio'
import { BLOCKCHAINS } from 'lib/hooks/constants'
import useWindowSize from 'lib/hooks/useScreenSize'
import WalletButton from 'lib/components/WalletButton';

export interface CreateLootboxProps {}
const CreateLootbox = (props: CreateLootboxProps) => {
  const snapUserState = useSnapshot(userState)
  const { screen } = useWindowSize()
  const isWalletConnected = snapUserState.accounts.length > 0

  // if (!isWalletConnected) {
  //   return <WalletButton></WalletButton>
  // }
  return (
    <$CreateLootbox>
      Create Lootbox
    </$CreateLootbox>
  )
}

const $CreateLootbox = styled.div<{}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

export default CreateLootbox
