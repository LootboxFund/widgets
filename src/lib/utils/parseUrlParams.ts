import { DEFAULT_LOOTBOX_ADDRESS } from 'lib/hooks/constants'

export default function (keys: string[]): (string | undefined)[] {
  // TODO: Dynamically load from keys passed in & url
  return [DEFAULT_LOOTBOX_ADDRESS]
}
