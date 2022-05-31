export * from './lootbox'

export interface SocialFragment {
  slug: string
  name: string
  placeholder: string
  icon: string
}

// TODO: move these to helpers
export type UserID = string & { readonly _: unique symbol }
export type UserIdpID = string & { readonly _: unique symbol }
export type LootboxID = string & { readonly _: unique symbol }
export type WalletID = string & { readonly _: unique symbol }
