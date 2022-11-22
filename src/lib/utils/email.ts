export const truncateEmail = (email: string) => {
  return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c)
}
