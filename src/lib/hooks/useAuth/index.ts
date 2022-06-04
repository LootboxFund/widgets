import {
  MutationCreateUserWithWalletArgs,
  CreateUserResponse,
  MutationAuthenticateWalletArgs,
  AuthenticateWalletResponse,
  AuthenticateWalletResponseSuccess,
  MutationCreateUserWithPasswordArgs,
  ConnectWalletResponse,
  MutationConnectWalletArgs,
} from '../../api/graphql/generated/types'
import { useSnapshot } from 'valtio'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { auth } from 'lib/api/firebase/app'
import { ethers } from 'ethers'
import { userState } from 'lib/state/userState'
import { generateSignatureMessage } from 'lib/utils/signatureMessage'
import { v4 as uuidv4 } from 'uuid'
import { SIGN_UP_WITH_WALLET, GET_WALLET_LOGIN_TOKEN, SIGN_UP_WITH_PASSWORD, CONNECT_WALLET } from './api.gql'
import {
  signInWithCustomToken,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  sendEmailVerification,
} from 'firebase/auth'
import { Address } from '@wormgraph/helpers'
import { getProvider } from 'lib/hooks/useWeb3Api'
import { UserID } from 'lib/types'
import client from 'lib/api/graphql/client'
import { GET_MY_WALLETS } from 'lib/components/Profile/Wallets/api.gql'
import LogRocket from 'logrocket'

interface FrontendUser {
  id: UserID
  email: string | null
  isEmailVerified: boolean
}

const EMAIL_VERIFICATION_COOKIE_NAME = 'email.verification.sent'

export const useAuth = () => {
  const [user, setUser] = useState<FrontendUser | null>(null)
  const userStateSnapshot = useSnapshot(userState)

  const [signUpWithWalletMutation] = useMutation<
    { createUserWithWallet: CreateUserResponse },
    MutationCreateUserWithWalletArgs
  >(SIGN_UP_WITH_WALLET)

  const [signUpWithPasswordMutation] = useMutation<
    { createUserWithPassword: CreateUserResponse },
    MutationCreateUserWithPasswordArgs
  >(SIGN_UP_WITH_PASSWORD)

  const [authenticateWalletMutation] = useMutation<
    { authenticateWallet: AuthenticateWalletResponse },
    MutationAuthenticateWalletArgs
  >(GET_WALLET_LOGIN_TOKEN)

  const [connectWalletMutation] = useMutation<{ connectWallet: ConnectWalletResponse }, MutationConnectWalletArgs>(
    CONNECT_WALLET,
    { refetchQueries: [{ query: GET_MY_WALLETS }] }
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, email } = user
        const userData: FrontendUser = { id: uid as UserID, email: email, isEmailVerified: user.emailVerified }
        setUser(userData)
      } else {
        setUser(null)
      }
      client.resetStore()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const signUpWithWallet = async (email: string): Promise<void> => {
    if (!email) {
      throw new Error('Email is required')
    }

    const { signature, message } = await getSignature()
    const { data } = await signUpWithWalletMutation({
      variables: {
        payload: {
          email,
          message,
          signedMessage: signature,
        },
      },
    })

    if (!data) {
      throw new Error('An error occured!')
    } else if (data?.createUserWithWallet?.__typename === 'ResponseError') {
      throw new Error(data.createUserWithWallet.error.message)
    }
  }

  const signInWithWallet = async (): Promise<void> => {
    const { signature, message } = await getSignature()

    const { data } = await authenticateWalletMutation({
      variables: {
        payload: {
          message,
          signedMessage: signature,
        },
      },
    })

    if (!data) {
      throw new Error('Server error')
    } else if (data?.authenticateWallet.__typename === 'ResponseError') {
      throw data.authenticateWallet.error
    }

    const { user } = await signInWithCustomToken(
      auth,
      (data.authenticateWallet as AuthenticateWalletResponseSuccess).token
    )

    // Send email verification only once on login
    const verificationEmailAlreadySent = localStorage.getItem(EMAIL_VERIFICATION_COOKIE_NAME)
    if (!user.emailVerified && !verificationEmailAlreadySent) {
      sendEmailVerification(user)
        .then(() => {
          console.log('email verification sent')
          localStorage.setItem(EMAIL_VERIFICATION_COOKIE_NAME, 'true')
        })
        .catch((err) => LogRocket.captureException(err))
    }
  }

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    if (!email) {
      throw new Error('Email is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }
    const { user } = await signInWithEmailAndPasswordFirebase(auth, email, password)

    // Send email verification only once on login
    const verificationEmailAlreadySent = localStorage.getItem(EMAIL_VERIFICATION_COOKIE_NAME)
    if (!user.emailVerified && !verificationEmailAlreadySent) {
      sendEmailVerification(user)
        .then(() => {
          console.log('email verification sent')
          localStorage.setItem(EMAIL_VERIFICATION_COOKIE_NAME, 'true')
        })
        .catch((err) => LogRocket.captureException(err))
    }
  }

  const signUpWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    if (!email) {
      throw new Error('Email is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }
    const { data } = await signUpWithPasswordMutation({
      variables: {
        payload: {
          email,
          password,
        },
      },
    })
    if (!data) {
      throw new Error('An error occured!')
    } else if (data?.createUserWithPassword?.__typename === 'ResponseError') {
      throw new Error(data.createUserWithPassword.error.message)
    }
  }

  const connectWallet = async (): Promise<void> => {
    const { signature, message } = await getSignature()

    const { data } = await connectWalletMutation({
      variables: {
        payload: {
          message,
          signedMessage: signature,
        },
      },
    })

    if (!data) {
      throw new Error('Server error')
    } else if (data?.connectWallet.__typename === 'ResponseError') {
      throw data.connectWallet.error
    }
  }

  const getSignature = async (): Promise<{ signature: string; message: string }> => {
    const { metamask } = await getProvider()

    if (!userStateSnapshot.currentAccount) {
      throw new Error('Please connect your wallet with MetaMask')
    }
    if (!metamask) {
      throw new Error(`Please install MetaMask`)
    }

    const checksumAddress = ethers.utils.getAddress(userStateSnapshot.currentAccount as unknown as string)
    const message = generateSignatureMessage(checksumAddress as Address, uuidv4())
    // @ts-ignore metamask is not typed...
    const result = await metamask.request({
      method: 'personal_sign',
      params: [message, userStateSnapshot.currentAccount],
    })
    return { signature: result, message }
  }

  const logout = async (): Promise<void> => {
    await auth.signOut()
    setUser(null)
  }

  return {
    user,
    signInWithWallet,
    signUpWithWallet,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    connectWallet,
    logout,
  }
}
