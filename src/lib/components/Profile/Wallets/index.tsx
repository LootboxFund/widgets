import { GET_MY_WALLETS, REMOVE_WALLET } from './api.gql'
import { useMutation, useQuery } from '@apollo/client'
import {
  GetMyProfileResponse,
  GetMyProfileSuccess,
  Wallet,
  RemoveWalletResponse,
  MutationRemoveWalletArgs,
} from 'lib/api/graphql/generated/types'
import Spinner, { $Spinner, LoadingText } from 'lib/components/Generics/Spinner'
import { $Horizontal, $Vertical } from 'lib/components/Generics'
import { $ErrorMessage, $h1, $p, $span } from 'lib/components/Generics/Typography'
import ReactTooltip from 'react-tooltip'
import HelpIcon from 'lib/theme/icons/Help.icon'
import { $SearchInput } from '../common'
import styled from 'styled-components'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { truncateAddress } from 'lib/api/helpers'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useState } from 'react'
import $Button from 'lib/components/Generics/Button'
import { useAuth } from 'lib/hooks/useAuth'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'

const Wallets = () => {
  const { screen } = useWindowSize()
  const { connectWallet } = useAuth()
  const { data, loading, error } = useQuery<{ getMyProfile: GetMyProfileResponse }>(GET_MY_WALLETS)
  const [removeWallet] = useMutation<{ removeWallet: RemoveWalletResponse }, MutationRemoveWalletArgs>(REMOVE_WALLET, {
    refetchQueries: [{ query: GET_MY_WALLETS }],
  })
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectErrorMessage, setConnectErrorMessage] = useState('')
  const userStateSnapshot = useSnapshot(userState)

  const [walletStatus, setWalletStatus] = useState<{ [key: Address]: { loading: boolean; errorMessage: string } }>({})

  const handleRemoveWallet = async (wallet: Wallet) => {
    setWalletStatus({ ...walletStatus, [wallet.address]: { loading: true, errorMessage: '' } })
    try {
      const { data } = await removeWallet({ variables: { payload: { id: wallet.id } } })
      if (data?.removeWallet?.__typename === 'ResponseError') {
        setWalletStatus({
          ...walletStatus,
          [wallet.address]: { loading: false, errorMessage: data.removeWallet.error.message || 'An error occured!' },
        })
      } else {
        setWalletStatus({ ...walletStatus, [wallet.address]: { loading: false, errorMessage: '' } })
      }
    } catch (error) {
      console.log(error)
      setWalletStatus({
        ...walletStatus,
        [wallet.address]: { loading: false, errorMessage: error.message || 'An error occured!' },
      })
    }
  }

  const handleWalletConnect = async () => {
    setConnectLoading(true)
    try {
      await connectWallet()
    } catch (err) {
      setConnectErrorMessage(err?.message || 'An error occured!')
    } finally {
      setConnectLoading(false)
    }
  }

  const WalletsList = ({ wallets }: { wallets: Wallet[] }) => {
    return (
      <$Vertical>
        <$WalletContainerSkeleton>
          <$Horizontal justifyContent="space-between">
            <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center">
              {'address'}
            </$span>
            {screen !== 'mobile' ? (
              <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center">
                {'date created'}
              </$span>
            ) : null}
            <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center"></$span>
          </$Horizontal>
        </$WalletContainerSkeleton>
        <$Vertical spacing={4}>
          {wallets.map((wallet) => {
            return (
              <$WalletContainer>
                <$Horizontal key={wallet.id} justifyContent="space-between">
                  <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center">
                    {truncateAddress((wallet.address || '') as Address)}
                  </$span>
                  {screen !== 'mobile' ? (
                    <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center">
                      {getFormattedDate(wallet.createdAt)}
                    </$span>
                  ) : null}

                  {walletStatus[wallet.address as Address]?.loading ? (
                    <$span
                      lineHeight={WALLET_CONTAINER_HEIGHT}
                      width="30%"
                      textAlign="center"
                      style={{ justifyContent: 'center', flexDirection: 'row', display: 'flex' }}
                    >
                      <$Spinner color={`${COLORS.surpressedFontColor}ae`} style={{ textAlign: 'center' }} />
                    </$span>
                  ) : (
                    <$span
                      lineHeight={WALLET_CONTAINER_HEIGHT}
                      width="30%"
                      textAlign="center"
                      color={COLORS.dangerFontColor}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveWallet(wallet)}
                    >
                      remove
                    </$span>
                  )}
                </$Horizontal>
                {walletStatus[wallet.address as Address]?.errorMessage ? (
                  <div style={{ padding: '15px 0px' }}>
                    <$ErrorMessage>{walletStatus[wallet.address as Address]?.errorMessage}</$ErrorMessage>
                  </div>
                ) : null}
              </$WalletContainer>
            )
          })}
        </$Vertical>
      </$Vertical>
    )
  }

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <WalletsError message={error?.message || ''} />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <WalletsError message={data?.getMyProfile?.error?.message || ''} />
  }

  const { user: userDB } = data.getMyProfile as GetMyProfileSuccess
  const connectText = userStateSnapshot.currentAccount
    ? `Connect ${truncateAddress(userStateSnapshot.currentAccount)}`
    : 'Connect Wallet'

  return (
    <$Vertical spacing={4}>
      <$h1 id="Wallets">
        Wallets <HelpIcon tipID="Wallets" />
      </$h1>
      <ReactTooltip id="Wallets" place="right" effect="solid">
        Wallets are used as an alternative login to your account, and they also help us find your data like your
        Lootboxes. You need to have installed MetaMask to use this feature.
      </ReactTooltip>
      <$SearchInput type="search" placeholder="🔍 Search by Address" />
      <WalletsList wallets={userDB.wallets || []} />
      <$Button
        screen={screen}
        onClick={handleWalletConnect}
        backgroundColor={`${COLORS.trustBackground}C0`}
        backgroundColorHover={`${COLORS.trustBackground}`}
        color={COLORS.trustFontColor}
        style={{
          fontWeight: TYPOGRAPHY.fontWeight.regular,
          fontSize: TYPOGRAPHY.fontSize.large,
          maxWidth: '300px',
          boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
        }}
        disabled={connectLoading}
      >
        <LoadingText loading={connectLoading} text={connectText} color={COLORS.trustFontColor} />
      </$Button>
      {connectErrorMessage ? <$ErrorMessage>{connectErrorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

const WalletsError = ({ message }: { message: string }) => {
  return (
    <$Vertical>
      <$p>An error occured:</$p>
      <$p>{message}</$p>
    </$Vertical>
  )
}

const getFormattedDate = (miliseconds: number): string => {
  const today = new Date(miliseconds)
  return today.toDateString()
}

const WALLET_CONTAINER_HEIGHT = '40px'

const $WalletContainer = styled.div`
  background-color: ${`${COLORS.surpressedBackground}1A`};
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  height: ${WALLET_CONTAINER_HEIGHT};
  box-shadow: 0px 3px 5px ${COLORS.surpressedBackground};
`

const $WalletContainerSkeleton = styled.div`
  border: none;
  border-radius: 10px;
  padding: 0px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  width: 100%;
`

export default Wallets
