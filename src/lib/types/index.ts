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
export type TournamentID = string & { readonly _: unique symbol }
export type StreamID = string & { readonly _: unique symbol }
export type PartyBasketID = string & { readonly _: unique symbol }
export type ReferralSlug = string & { readonly _: unique symbol }
export type ClaimID = string & { readonly _: unique symbol }

// export type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// };
