import { ethers } from 'ethers'
import { ABIUtilRepresenation } from '@lootboxfund/helpers'

export const decodeEVMLog = ({
  eventName,
  log,
  abi,
  keys,
}: {
  eventName: string
  log: any
  abi: string
  keys: string[]
}) => {
  const iface = new ethers.utils.Interface([abi])
  const data = iface.decodeEventLog(eventName, log.data, log.topics)
  const formattedData = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: data[key],
    }),
    {}
  )
  console.log(formattedData)
  return formattedData
}
