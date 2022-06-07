export const throwInvalidPasswords = ({
  password,
  passwordConfirmation,
}: {
  password?: string
  passwordConfirmation?: string
}) => {
  if (!password) {
    throw new Error('Please enter a password')
  }

  // Some rules.... Lets say greater than or eqal 10 characters, with 1 number, and one upercase
  const minLen = 6
  if (password.length < minLen) {
    throw new Error(`Password must be at least ${minLen} characters`)
  }

  const hasNumber = /\d/
  if (!hasNumber.test(password)) {
    throw new Error('Password must contain at least one number')
  }

  if (!passwordConfirmation) {
    throw new Error('Please confirm your password')
  }

  if (password !== passwordConfirmation) {
    throw new Error('Passwords do not match!')
  }

  return
}
