export * from './lootbox'

export interface SocialFragment {
  slug: string
  name: string
  placeholder: string
  icon: string
}

// export type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// };
