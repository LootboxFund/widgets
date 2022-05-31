import {
  MutationCreateUserWithWalletArgs,
  CreateUserResponse,
  CreateUserWithWalletPayload,
  AuthenticateWalletPayload,
  MutationAuthenticateWalletArgs,
  AuthenticateWalletResponse,
  AuthenticateWalletResponseSuccess,
} from '../../api/graphql/generated/types'
import { useSnapshot } from 'valtio'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { auth } from 'lib/api/firebase/app'
import { User } from 'lib/api/graphql/generated/types'
import { ethers } from 'ethers'
import { useProvider, getProvider } from 'lib/hooks/useWeb3Api'
import { userState } from 'lib/state/userState'
import { JsonRpcProvider } from 'ethers/node_modules/@ethersproject/providers'
import { generateSignatureMessage } from 'lib/utils/signatureMessage'
import { v4 as uuidv4 } from 'uuid'
import { SIGN_UP_WITH_WALLET, GET_WALLET_LOGIN_TOKEN } from './api.gql'
import { signInWithCustomToken } from 'firebase/auth'
import { Address } from '@wormgraph/helpers'

interface SignUpWithWallet {}

export const useAuth = () => {
  //   const [user, setUser] = useState<User | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const userStateSnapshot = useSnapshot(userState)
  const [signUpWithWalletMutation, { loading: loadingSignup, error }] = useMutation<
    CreateUserResponse,
    MutationCreateUserWithWalletArgs
  >(SIGN_UP_WITH_WALLET)
  const [authenticateWalletMutation] = useMutation<
    { authenticateWallet: AuthenticateWalletResponse },
    MutationAuthenticateWalletArgs
  >(GET_WALLET_LOGIN_TOKEN)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('onAuthStateChanged', user)
      if (user) {
        console.log('AUTH', user)
        const { uid, displayName, photoURL, email } = user
        const userData = { uid, displayName, photoURL, email }
        setUser(userData)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const signUpWithWallet = async (email: string) => {
    const { signature, message } = await getSignature()

    setLoading(true)
    //   try {
    console.log('signing up...? ')
    signUpWithWalletMutation({
      variables: {
        payload: {
          email,
          message,
          signedMessage: signature,
        },
      },
    })
    // console.log('SIGN_UP_WITH_WALLET', data)
    // setUser(data.createUserWithWallet.user)
    // setLoading(false)
    //   }
  }

  const signInWithWallet = async () => {
    const { signature, message } = await getSignature()

    try {
      setLoading(true)

      console.log('loggin in')

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
      // Sign in
      await signInWithCustomToken(auth, (data.authenticateWallet as AuthenticateWalletResponseSuccess).token)
    } catch (err) {
      setLoading(false)
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

  return { user, loading: loading || loadingSignup, signInWithWallet, signUpWithWallet }
}
