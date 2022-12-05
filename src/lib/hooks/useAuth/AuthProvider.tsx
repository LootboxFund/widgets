import { useMutation } from '@apollo/client'
import { Address, ClaimID, LootboxID, ReferralSlug, UserID } from '@wormgraph/helpers'
import { ethers } from 'ethers'
import {
  ActionCodeSettings,
  browserLocalPersistence,
  browserSessionPersistence,
  ConfirmationResult,
  EmailAuthCredential,
  linkWithCredential,
  PhoneAuthCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  sendEmailVerification,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithCustomToken,
  signInWithPhoneNumber,
  User,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signInAnonymously as signInAnonymouslyFirebase,
} from 'firebase/auth'
import { auth } from 'lib/api/firebase/app'
import client from 'lib/api/graphql/client'
import {
  AuthenticateWalletResponse,
  AuthenticateWalletResponseSuccess,
  ConnectWalletResponse,
  CreateUserRecordPayload,
  CreateUserResponse,
  MutationAuthenticateWalletArgs,
  MutationConnectWalletArgs,
  MutationCreateUserRecordArgs,
  MutationCreateUserWithPasswordArgs,
  MutationCreateUserWithWalletArgs,
  ResponseError,
} from 'lib/api/graphql/generated/types'
import { GET_MY_WALLETS } from 'lib/components/Profile/Wallets/api.gql'
import { userState } from 'lib/state/userState'
import { truncateEmail } from 'lib/utils/email'
import { throwInvalidPasswords } from 'lib/utils/password'
import { generateAuthSignatureMessage } from 'lib/utils/signatureMessage'
import LogRocket from 'logrocket'
import { manifest } from 'manifest'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSnapshot } from 'valtio'
import { getProvider } from '../useWeb3Api'
import useWords, { useSignatures } from '../useWords'
import {
  CONNECT_WALLET,
  CREATE_USER,
  GET_WALLET_LOGIN_TOKEN,
  SIGN_UP_WITH_PASSWORD,
  SIGN_UP_WITH_WALLET,
} from './api.gql'
import { v4 as uuidv4 } from 'uuid'

const EMAIL_VERIFICATION_COOKIE_NAME = 'email.verification.sent'

interface FrontendUser {
  id: UserID
  email: string | null
  phone: string | null
  isEmailVerified: boolean
  username: string | null
  avatar: string | null
  isAnonymous: boolean
}

export interface AuthContextType {
  user: FrontendUser | null | undefined
  signInAnonymously: (email?: string) => Promise<User>
  signInWithWallet: () => Promise<void>
  signUpWithWallet: (email: string) => Promise<void>
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>
  signUpWithEmailAndPassword: (email: string, password: string, passwordConfirmation: string) => Promise<void>
  sendPhoneVerification: (phoneNumber: string) => Promise<void>
  signInPhoneWithCode: (code: string, email?: string) => Promise<CreateUserResponse>
  connectWallet: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  linkCredentials: (credential: EmailAuthCredential | PhoneAuthCredential) => Promise<User>
  getPhoneAuthCredentialFromCode: (code: string) => PhoneAuthCredential
  sendSignInEmailForViralOnboarding: (
    email: string,
    claimID: ClaimID,
    referralSlug: ReferralSlug,
    lootboxID: LootboxID
  ) => Promise<void>
  sendBasicSignInEmail: (email: string) => Promise<void>
  sendSignInEmailAnon: (email: string, img?: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {}

const AuthProvider = ({ children }: PropsWithChildren<AuthProviderProps>) => {
  /**
   * user = undefined -> unset (loading)
   * user = null -> unauthenticated
   * user = USER -> authenticated
   */
  const [user, setUser] = useState<FrontendUser | null | undefined | null>(undefined)
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

  const [createUserMutation] = useMutation<{ createUserRecord: CreateUserResponse }, MutationCreateUserRecordArgs>(
    CREATE_USER
  )

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
        const userData = convertUserToUserFE(user)
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

  const getPhoneAuthCredentialFromCode = (code: string): PhoneAuthCredential => {
    if (!phoneConfirmationResult) {
      console.log('error, no confirmation result')
      throw new Error(words.anErrorOccured)
    }

    const verificationID = phoneConfirmationResult.verificationId
    const credential = PhoneAuthProvider.credential(verificationID, code)

    return credential
  }

  const signInPhoneWithCode = async (code: string, email?: string) => {
    if (!phoneConfirmationResult) {
      console.error('No phone confirmation result')
      throw new Error(words.anErrorOccured)
    }

    const result = await phoneConfirmationResult.confirm(code)

    const { user } = result

    // Now create a user record
    const createUserPayload: CreateUserRecordPayload = {}
    if (!user.email && !!email) {
      createUserPayload.email = email
    }

    const { data } = await createUserMutation({ variables: { payload: createUserPayload } })

    if (!data || data.createUserRecord?.__typename === 'ResponseError') {
      console.error('Error creating user record', (data?.createUserRecord as ResponseError)?.error?.message)
      LogRocket.captureException(new Error('Error creating user record'))
      throw new Error(words.anErrorOccured)
    }

    // Send email verification only once on login
    const verificationEmailAlreadySent = localStorage.getItem(EMAIL_VERIFICATION_COOKIE_NAME)

    if (!!user.email && !user.emailVerified && !verificationEmailAlreadySent) {
      sendEmailVerification(user)
        .then(() => {
          console.log('email verification sent')
          localStorage.setItem(EMAIL_VERIFICATION_COOKIE_NAME, 'true')
        })
        .catch((err) => LogRocket.captureException(err))
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
    if (!!user.email && !user.emailVerified && !verificationEmailAlreadySent) {
      sendEmailVerification(user)
        .then(() => {
          console.log('email verification sent')
          localStorage.setItem(EMAIL_VERIFICATION_COOKIE_NAME, 'true')
        })
        .catch((err) => LogRocket.captureException(err))
    }
  }

  const sendBasicSignInEmail = async (email: string): Promise<void> => {
    const emailActionCodeSettings: ActionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${manifest.microfrontends.webflow.myProfilePage}?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    }

    try {
      console.log('sending sign in email...')
      await sendSignInLinkToEmail(auth, email, emailActionCodeSettings)
      console.log('success sending email')
    } catch (err) {
      console.log('error sending email', err)
      LogRocket.captureException(err)
    }
    return
  }

  const sendSignInEmailForViralOnboarding = async (
    email: string,
    claimID: ClaimID,
    referralSlug: ReferralSlug,
    lootboxID: LootboxID
  ) => {
    const emailActionCodeSettings: ActionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${
        manifest.microfrontends.webflow.referral
      }?r=${referralSlug}&l=${lootboxID}&c=${claimID}&email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    }

    try {
      console.log('sending sign in email...')
      await sendSignInLinkToEmail(auth, email, emailActionCodeSettings)
      console.log('success sending email')
    } catch (err) {
      console.log('error sending email', err)
      LogRocket.captureException(err)
    }
    return
  }
  // const sendClaimValidationEmail = async (email: string, claimID: ClaimID, claimImgURL: string): Promise<void> => {
  //   // More info: https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=1#linkingre-authentication_with_email_link
  //   const emailActionCodeSettings: ActionCodeSettings = {
  //     // URL you want to redirect back to. The domain (www.example.com) for this
  //     // URL must be in the authorized domains list in the Firebase Console.

  //     url: `${manifest.microfrontends.webflow.validateUntrustedClaim}?img=${claimImgURL}&c=${claimID}`,
  //     // This must be true.
  //     handleCodeInApp: true,
  //   }

  //   try {
  //     console.log('sending sign in email...')
  //     await sendSignInLinkToEmail(auth, email, emailActionCodeSettings)
  //     console.log('success sending email')
  //   } catch (err) {
  //     console.log('error sending email', err)
  //     LogRocket.captureException(err)
  //   }
  //   return
  // }

  const signInAnonymously = async (email?: string): Promise<User> => {
    // Sign in anonymously
    const { user } = await signInAnonymouslyFirebase(auth)

    // Now create a user record
    const createUserPayload: CreateUserRecordPayload = {}
    if (!user.email && !!email) {
      createUserPayload.email = email
    }

    await createUserMutation({ variables: { payload: createUserPayload } })

    return user
  }

  const sendSignInEmailAnon = async (email: string, img?: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('User not signed in')
    }
    // Send login email
    // const idToken = await auth.currentUser.getIdToken(true)
    // if (!idToken) {
    //   console.log('not logged in while generating ID token')
    //   throw new Error(words.anErrorOccured)
    // }
    // More info: https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=1#linkingre-authentication_with_email_link
    const emailActionCodeSettings: ActionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.

      // url: `${manifest.microfrontends.webflow.anonSignup}?t=${idToken}${img ? `&img=${encodeURIComponent(img)}` : ''}`,
      url: `${manifest.microfrontends.webflow.anonSignup}?u=${auth.currentUser.uid}&e=${truncateEmail(email)}${
        img ? `&img=${encodeURIComponent(img)}` : ''
      }`,
      // This must be true.
      handleCodeInApp: true,
    }

    try {
      console.log('sending sign in email...')
      await sendSignInLinkToEmail(auth, email, emailActionCodeSettings)
      console.log('success sending email')
    } catch (err) {
      console.log('error sending email', err)
      LogRocket.captureException(err)
    }

    return
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

    if (!!user.email && !user.emailVerified && !verificationEmailAlreadySent) {
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

  const refreshUser = async () => {
    await auth.currentUser?.reload()
    const newUser = auth.currentUser ? convertUserToUserFE(auth.currentUser) : null
    setUser(newUser)
  }

  const linkCredentials = async (credential: EmailAuthCredential | PhoneAuthCredential): Promise<User> => {
    const _user = auth.currentUser
    if (!_user) {
      throw new Error('No user logged in')
    }
    await linkWithCredential(_user, credential)

    return _user
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInAnonymously,
        signInWithWallet,
        signUpWithWallet,
        signInWithEmailAndPassword,
        signUpWithEmailAndPassword,
        sendPhoneVerification,
        signInPhoneWithCode,
        connectWallet,
        logout,
        refreshUser,
        linkCredentials,
        getPhoneAuthCredentialFromCode,
        sendSignInEmailForViralOnboarding,
        sendBasicSignInEmail,
        sendSignInEmailAnon,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const convertUserToUserFE = (user: User): FrontendUser => {
  const { uid, email, phoneNumber, displayName, photoURL, emailVerified, isAnonymous } = user
  const userData: FrontendUser = {
    id: uid as UserID,
    email: email,
    phone: phoneNumber,
    isEmailVerified: emailVerified,
    username: displayName,
    avatar: photoURL,
    isAnonymous,
  }
  return userData
}

export default AuthProvider
