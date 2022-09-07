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
import { $Link, $SearchInput, Oopsies, $SettingContainer } from '../common'
import styled from 'styled-components'
import { Address, COLORS, TYPOGRAPHY } from '@wormgraph/helpers'
import { truncateAddress } from 'lib/api/helpers'
import useWindowSize from 'lib/hooks/useScreenSize'
import { useState } from 'react'
import $Button from 'lib/components/Generics/Button'
import { useAuth } from 'lib/hooks/useAuth'
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState'
import WalletButton from 'lib/components/WalletButton'
import PopConfirm from 'lib/components/Generics/PopConfirm'
import useWords from 'lib/hooks/useWords'
import { FormattedMessage, useIntl } from 'react-intl'

const Wallets = () => {
  const intl = useIntl()
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
  const [searchTerm, setSearchTerm] = useState('')
  const words = useWords()

  const walletsHelpText = intl.formatMessage({
    id: 'profile.wallets.helpText',
    defaultMessage:
      'Wallets are used to sign into your account. We also use them to find your Lootboxes. Try adding a MetaMask wallet, and use it to login.',
    description: 'Help message for users who do not have a wallet associated to their account',
  })

  const searchByAddressText = intl.formatMessage({
    id: 'profile.wallets.searchByAddressText',
    defaultMessage: 'Search by address',
    description: 'Search by a Lootbox smart contract address - this is placeholder in input field',
  })

  const isWalletConnected = !!userStateSnapshot.currentAccount
  const isMetamask = !!window.ethereum

  const handleRemoveWallet = async (wallet: Wallet) => {
    setWalletStatus({ ...walletStatus, [wallet.address]: { loading: true, errorMessage: '' } })
    try {
      const { data } = await removeWallet({ variables: { payload: { id: wallet.id } } })
      if (data?.removeWallet?.__typename === 'ResponseError') {
        setWalletStatus({
          ...walletStatus,
          [wallet.address]: {
            loading: false,
            errorMessage: data.removeWallet.error.message || `${words.anErrorOccured}!`,
          },
        })
      } else {
        setWalletStatus({ ...walletStatus, [wallet.address]: { loading: false, errorMessage: '' } })
      }
    } catch (error) {
      console.log(error)
      setWalletStatus({
        ...walletStatus,
        [wallet.address]: { loading: false, errorMessage: error.message || `${words.anErrorOccured}!` },
      })
    }
  }

  const handleWalletConnect = async () => {
    setConnectLoading(true)
    setConnectErrorMessage('')
    try {
      await connectWallet()
    } catch (err) {
      setConnectErrorMessage(err?.message || `${words.anErrorOccured}!`)
    } finally {
      setConnectLoading(false)
    }
  }

  const WalletsList = ({ wallets }: { wallets: Wallet[] }) => {
    return (
      <$Vertical>
        <$WalletContainerSkeleton>
          <$Horizontal justifyContent="space-between">
            <$span
              color={`${COLORS.surpressedBackground}be`}
              lineHeight={WALLET_CONTAINER_HEIGHT}
              width="30%"
              textAlign="center"
              style={{ textTransform: 'lowercase' }}
            >
              {words.address}
            </$span>
            {screen !== 'mobile' ? (
              <$span
                color={`${COLORS.surpressedBackground}be`}
                lineHeight={WALLET_CONTAINER_HEIGHT}
                width="30%"
                textAlign="center"
                style={{ textTransform: 'lowercase' }}
              >
                <FormattedMessage
                  id="profile.wallets.dateCreated"
                  defaultMessage="Date created"
                  description="Text indicating when a particular thing was created"
                />
              </$span>
            ) : null}
            <$span lineHeight={WALLET_CONTAINER_HEIGHT} width="30%" textAlign="center"></$span>
          </$Horizontal>
        </$WalletContainerSkeleton>
        <$Vertical spacing={4}>
          {wallets.map((wallet, index) => {
            return (
              <$SettingContainer key={`wallet-${index}`}>
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
                    <PopConfirm onOk={() => handleRemoveWallet(wallet)} style={{ width: '30%', textAlign: 'center' }}>
                      <$span
                        lineHeight={WALLET_CONTAINER_HEIGHT}
                        width="100%"
                        textAlign="center"
                        color={COLORS.dangerFontColor}
                        style={{ cursor: 'pointer', textTransform: 'lowercase' }}
                      >
                        {words.remove}
                      </$span>
                    </PopConfirm>
                  )}
                </$Horizontal>
                {walletStatus[wallet.address as Address]?.errorMessage ? (
                  <div style={{ padding: '15px 0px' }}>
                    <$ErrorMessage>{`${words.anErrorOccured}: ${
                      walletStatus[wallet.address as Address]?.errorMessage
                    }`}</$ErrorMessage>
                  </div>
                ) : null}
              </$SettingContainer>
            )
          })}
        </$Vertical>
      </$Vertical>
    )
  }

  if (loading) {
    return <Spinner />
  } else if (error || !data) {
    return <Oopsies message={error?.message || ''} icon="🤕" title={words.anErrorOccured} />
  } else if (data?.getMyProfile?.__typename === 'ResponseError') {
    return <Oopsies message={data?.getMyProfile?.error?.message || ''} icon="🤕" title={words.anErrorOccured} />
  }

  const { user: userDB } = data.getMyProfile as GetMyProfileSuccess
  const connectText = userStateSnapshot.currentAccount
    ? `${words.addWallet} ${truncateAddress(userStateSnapshot.currentAccount)}`
    : words.addWallet

  const wallets = userDB.wallets || []
  const filteredWallets = wallets.filter((wallet) => {
    return wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <$Vertical spacing={4}>
      <$h1 id="Wallets">
        {words.wallets} <HelpIcon tipID="Wallets" />
      </$h1>
      <ReactTooltip id="Wallets" place="right" effect="solid">
        <FormattedMessage
          id="profile.wallets.help"
          defaultMessage="Wallets are used as an alternative login to your account. They also help us find your data like your Lootboxes. You need to have installed MetaMask to use this feature."
          description="Help text for the Wallets section in the user profile"
        />
      </ReactTooltip>
      {!isMetamask ? (
        <Oopsies
          icon="🦊"
          title={words.pleaseInstallMetamask}
          message={
            <FormattedMessage
              id="profile.wallets.pleaseInstallMetamask"
              defaultMessage="Your MetaMask wallet is used as your web3 identity. You will need one to interact with the blockchain. You can {downloadMetamaskLink}."
              description="Help message for MetaMask not installed"
              values={{
                downloadMetamaskLink: (
                  <$Link target="_blank" href="https://metamask.io/download/">
                    <FormattedMessage
                      id="profile.wallets.downloadMetamask"
                      defaultMessage="download MetaMask here"
                      description="Hyper link to download MetaMask"
                    />
                  </$Link>
                ),
              }}
            />
          }
        />
      ) : null}
      {wallets.length === 0 && <Oopsies title={words.addWallet} message={walletsHelpText} icon="🔐" />}
      {wallets.length > 0 && (
        <$Vertical spacing={4}>
          <$SearchInput
            type="search"
            placeholder={`🔍 ${searchByAddressText}`}
            onChange={(e) => setSearchTerm(e.target.value || '')}
          />
          <WalletsList wallets={filteredWallets || []} />
        </$Vertical>
      )}
      {!isWalletConnected ? (
        <div>
          <WalletButton
            style={{
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
              boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
              minHeight: 'unset',
            }}
          />
        </div>
      ) : (
        <div>
          <$Button
            screen={screen}
            onClick={handleWalletConnect}
            backgroundColor={`${COLORS.trustBackground}C0`}
            backgroundColorHover={`${COLORS.trustBackground}`}
            color={COLORS.trustFontColor}
            style={{
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              fontSize: TYPOGRAPHY.fontSize.large,
              boxShadow: `0px 3px 5px ${COLORS.surpressedBackground}`,
            }}
            disabled={connectLoading}
          >
            <LoadingText loading={connectLoading} text={connectText} color={COLORS.trustFontColor} />
          </$Button>
        </div>
      )}
      {connectErrorMessage ? <$ErrorMessage>{connectErrorMessage}</$ErrorMessage> : null}
    </$Vertical>
  )
}

const getFormattedDate = (miliseconds: number): string => {
  const today = new Date(miliseconds)
  return today.toDateString()
}

const WALLET_CONTAINER_HEIGHT = '40px'

const $WalletContainerSkeleton = styled.div`
  border: none;
  border-radius: 10px;
  padding: 0px 10px;
  font-size: ${TYPOGRAPHY.fontSize.medium};
  width: 100%;
`

export default Wallets
