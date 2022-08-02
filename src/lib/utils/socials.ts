export type SocialType =
  | 'twitter'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'discord'
  | 'snapchat'
  | 'twitch'
  | 'web'

export const getSocialUrlLink = (socialType: SocialType, value: string) => {
  if (socialType === 'twitter') {
    return `https://twitter.com/${value}`
  } else if (socialType === 'youtube') {
    return value
  } else if (socialType === 'instagram') {
    return `https://instagram.com/${value}`
  } else if (socialType === 'tiktok') {
    return `https://tiktok.com/${value}`
  } else if (socialType === 'facebook') {
    return `https://facebook.com/${value}`
  } else if (socialType === 'discord') {
    return `https://discord.com/${value}`
  } else if (socialType === 'twitch') {
    return `https://twitch.com/${value}`
  } else if (socialType === 'web') {
    return value
  } else {
    return undefined
  }
}
