export * from './lootbox'

type ShownOn = 'create-loobox' | 'badge-factory' | 'badge-member'
export interface SocialFragment {
  slug: string
  name: string
  placeholder: string
  icon: string
  shownOn: ShownOn[]
}
