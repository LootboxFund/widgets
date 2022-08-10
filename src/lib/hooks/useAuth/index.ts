import {
  MutationCreateUserWithWalletArgs,
  CreateUserResponse,
  MutationAuthenticateWalletArgs,
  AuthenticateWalletResponse,
  AuthenticateWalletResponseSuccess,
  MutationCreateUserWithPasswordArgs,
  ConnectWalletResponse,
  MutationConnectWalletArgs,
  ResponseError,
} from '../../api/graphql/generated/types'
import { useSnapshot } from 'valtio'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { auth } from 'lib/api/firebase/app'
import { ethers } from 'ethers'
import { userState } from 'lib/state/userState'
import { generateAuthSignatureMessage } from 'lib/utils/signatureMessage'
import { v4 as uuidv4 } from 'uuid'
import {
  SIGN_UP_WITH_WALLET,
  GET_WALLET_LOGIN_TOKEN,
  SIGN_UP_WITH_PASSWORD,
  CONNECT_WALLET,
  CREATE_USER,
} from './api.gql'
import {
  signInWithCustomToken,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  sendEmailVerification,
  browserSessionPersistence,
  browserLocalPersistence,
  Persistence,
  setPersistence as setPersistenceFirebase,
  setPersistence,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth'
import { Address } from '@wormgraph/helpers'
import { getProvider } from 'lib/hooks/useWeb3Api'
import { UserID } from 'lib/types'
import client from 'lib/api/graphql/client'
import { GET_MY_WALLETS } from 'lib/components/Profile/Wallets/api.gql'
import LogRocket from 'logrocket'
import { throwInvalidPasswords } from 'lib/utils/password'
import { useIntl } from 'react-intl'
import useWords, { useSignatures } from 'lib/hooks/useWords'

interface FrontendUser {
  id: UserID
  email: string | null
  phone: string | null
  isEmailVerified: boolean
}

const EMAIL_VERIFICATION_COOKIE_NAME = 'email.verification.sent'

export const useAuth = () => {
  /**
   * user = undefined -> unset (loading)
   * user = null -> unauthenticated
   * user = USER -> authenticated
   */
  const [user, setUser] = useState<FrontendUser | undefined | null>(undefined)
  const userStateSnapshot = useSnapshot(userState)
  const intl = useIntl()
  const signatureWords = useSignatures()
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<ConfirmationResult | null>(null)

  useEffect(() => {
    const el = document.getElementById('recaptcha-container')
    if (!!el) {
      const recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
        auth
      )
      setRecaptchaVerifier(recaptchaVerifier)
    }
  }, [])

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

  const [createUserMutation] = useMutation<{ createUserRecord: CreateUserResponse }>(CREATE_USER)

  const [connectWalletMutation] = useMutation<{ connectWallet: ConnectWalletResponse }, MutationConnectWalletArgs>(
    CONNECT_WALLET,
    { refetchQueries: [{ query: GET_MY_WALLETS }] }
  )

  const words = useWords()
  const emailIsRequiredText = intl.formatMessage({
    id: 'auth.emailIsRequired',
    defaultMessage: 'Email is required',
    description: 'Error message when user tries to sign up without an email',
  })
  const passwordIsRequiredText = intl.formatMessage({
    id: 'auth.passwordIsRequired',
    defaultMessage: 'Password is required',
    description: 'Error message when user tries to sign up without a password',
  })

  const setAuthPersistence = () => {
    const persistence: 'session' | 'local' = (localStorage.getItem('auth.persistence') || 'session') as
      | 'session'
      | 'local'

    if (persistence === 'local') {
      setPersistence(auth, browserLocalPersistence)
    } else {
      setPersistence(auth, browserSessionPersistence)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, email, phoneNumber } = user
        const userData: FrontendUser = {
          id: uid as UserID,
          email: email,
          phone: phoneNumber,
          isEmailVerified: user.emailVerified,
        }
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

  const sendPhoneVerification = async (phoneNumber: string) => {
    if (!phoneNumber) {
      throw new Error(words.pleaseEnterYourPhoneNumber)
    }

    if (phoneNumber[0] !== '+') {
      throw new Error(words.includeCountryCode)
    }

    if (!recaptchaVerifier) {
      console.error('no captcha verifier')
      throw new Error(words.anErrorOccured)
    }

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)

    setPhoneConfirmationResult(confirmationResult)
  }

  const signInPhoneWithCode = async (code: string) => {
    if (!phoneConfirmationResult) {
      console.error('No phone confirmation result')
      throw new Error(words.anErrorOccured)
    }

    const result = await phoneConfirmationResult.confirm(code)

    const { user } = result
    // Now create a user record
    const { data } = await createUserMutation()

    if (!data || data.createUserRecord?.__typename === 'ResponseError') {
      console.error('Error creating user record', (data?.createUserRecord as ResponseError)?.error?.message)
      LogRocket.captureException(new Error('Error creating user record'))
      throw new Error(words.anErrorOccured)
    }

    return data.createUserRecord as CreateUserResponse
  }

  const signUpWithWallet = async (email: string): Promise<void> => {
    if (!email) {
      throw new Error(emailIsRequiredText)
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
      throw new Error(words.anErrorOccured)
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
      throw new Error(words.anErrorOccured)
    } else if (data?.authenticateWallet.__typename === 'ResponseError') {
      throw data.authenticateWallet.error
    }

    setAuthPersistence()

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
      throw new Error(emailIsRequiredText)
    }
    if (!password) {
      throw new Error(passwordIsRequiredText)
    }

    setAuthPersistence()

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

  const signUpWithEmailAndPassword = async (
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<void> => {
    if (!email) {
      throw new Error(emailIsRequiredText)
    }

    // This will throw if the passwords are not valid
    throwInvalidPasswords(intl, { password, passwordConfirmation })

    const { data } = await signUpWithPasswordMutation({
      variables: {
        payload: {
          email,
          password,
        },
      },
    })

    if (!data) {
      throw new Error(words.anErrorOccured)
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
      throw new Error(words.anErrorOccured)
    } else if (data?.connectWallet.__typename === 'ResponseError') {
      throw data.connectWallet.error
    }
  }

  const getSignature = async (): Promise<{ signature: string; message: string }> => {
    const { metamask } = await getProvider()

    if (!userStateSnapshot.currentAccount) {
      throw new Error(words.connectWalletToMetamask)
    }
    if (!metamask) {
      throw new Error(words.pleaseInstallMetamask)
    }

    const checksumAddress = ethers.utils.getAddress(userStateSnapshot.currentAccount as unknown as string)
    const message = generateAuthSignatureMessage(signatureWords.loginMessage, checksumAddress as Address, uuidv4())
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

  // const updatePassword = async (password: string, newPassword: string): Promise<void> => {

  return {
    user,
    signInWithWallet,
    signUpWithWallet,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    sendPhoneVerification,
    signInPhoneWithCode,
    connectWallet,
    logout,
  }
}
