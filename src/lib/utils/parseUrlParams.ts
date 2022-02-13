import { DEFAULT_LOOTBOX_ADDRESS } from 'lib/hooks/constants'

type ParamKeys = 'fundraisers'

export default function (keys: ParamKeys[]): (string | undefined)[] {
  // TODO: Dynamically load from keys passed in & url
  return [DEFAULT_LOOTBOX_ADDRESS]
}
