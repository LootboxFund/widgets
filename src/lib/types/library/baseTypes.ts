// base types

export type MemberID = string & { readonly _: unique symbol } // member in guild
export type GuildID = string & { readonly _: unique symbol } // guild id
export type GameID = string & { readonly _: unique symbol } // game to play
export type FundraiseID = string & { readonly _: unique symbol } // round of fundraising
export type WalletAddress = string & { readonly _: unique symbol } // wallet address
export type ContractAddress = string & { readonly _: unique symbol } // guild token
export type Address = WalletAddress | ContractAddress
export type BlockchainID = string & { readonly _: unique symbol } // blockchain id
export type TokenTemplateID = string & { readonly _: unique symbol } // token template id
export type GuildTemplateID = string & { readonly _: unique symbol } // guild template id

export type urlImage = string
export type urlVideo = string
export type urlFile = string
export type BigNumberString = string

export interface SocialSet {
  socialNetwork: SocialNetwork
  alias: string
}
export type SocialNetwork =
  | 'TWITTER'
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'WEBSITE'
  | 'EMAIL'
  | 'TWITCH'
  | 'DISCORD'
  | 'YOUTUBE'
  | 'HEARTBEAT'
  | 'TELEGRAM'
