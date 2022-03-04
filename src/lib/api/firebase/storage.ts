import { storage } from './app'
import { ref, uploadBytes } from '@firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const uniqueId = uuidv4()
const LOOTBOX_ASSETS = `assets/lootbox/${uniqueId}`

/**
 * Save image to gbucket
 * @param fileDestination filepath within the gbucket
 * @param file
 */
const uploadImageToBucket = async (fileDestination: string, file: File) => {
  // Create a reference to 'mountains.jpg'
  const storageRef = ref(storage, fileDestination)

  // 'file' comes from the Blob or File API
  console.log(`uploading to ${fileDestination}`, file)
  return uploadBytes(storageRef, file)
}

export const uploadLootboxLogo = async (file: File): Promise<string> => {
  console.log('FILE', file)
  const extension = file?.name?.split('.').pop()
  const fileDestination = `${LOOTBOX_ASSETS}/logo${extension ? '.' + extension : ''}`
  // const res = await uploadImageToBucket(fileDestination, file)
  // console.log('res', res)
  return 'SKJDhfB'
}

export const uploadLootboxBackground = async (file: File): Promise<string> => {
  const extension = file?.name?.split('.').pop()
  const fileDestination = `${LOOTBOX_ASSETS}/cover${extension ? '.' + extension : ''}`
  const res = await uploadImageToBucket(fileDestination, file)
  return 'HEHEHEHE'
}
