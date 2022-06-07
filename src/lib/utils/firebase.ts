type FirebaseAuthError = string

const WRONG_EMAIL_OR_PASSWORD: FirebaseAuthError[] = ['auth/wrong-password', 'auth/user-not-found']
const ACCOUNT_ALREADY_EXISTS: FirebaseAuthError[] = ['auth/email-already-exists', 'auth/uid-already-exists']

export const parseAuthError = (message: string) => {
  // Tries to turn errors from https://firebase.google.com/docs/reference/js/auth#autherrorcodes into something more readable
  // First remove "Firebase: "
  message = message.replace(/^Firebase: /, '')

  if (WRONG_EMAIL_OR_PASSWORD.some((code) => message.indexOf(code) > -1)) {
    return 'Incorrect email or password!'
  } else if (ACCOUNT_ALREADY_EXISTS.some((code) => message.indexOf(code) > -1)) {
    return 'This account already exists!'
  } else {
    const parsedMessage = message.replace(/auth\//, '')
    return parsedMessage
  }
}
