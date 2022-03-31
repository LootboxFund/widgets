import { storage } from './app'
import { ref, uploadBytes } from '@firebase/storage'
import { UploadResult } from 'firebase/storage'
import { manifest } from '../../../manifest'

const LOOTBOX_ASSETS = `assets/lootbox`

const constructPublicPath = (res: UploadResult) => {
  return `${manifest.storage.downloadUrl}/${res.metadata.fullPath.replaceAll('/', '%2F')}?alt=media`
}

/**
 * Save image to gbucket
 * @param fileDestination filepath within the gbucket
 * @param file
 */
const uploadImageToBucket = async (fileDestination: string, file: File) => {
  // Create a reference to 'mountains.jpg'
  const storageRef = ref(storage, fileDestination)

  // 'file' comes from the Blob or File API
  return uploadBytes(storageRef, file)
}

export const uploadLootboxLogo = async (folder: string, file: File): Promise<string> => {
  const extension = file?.name?.split('.').pop()
  const fileDestination = `${LOOTBOX_ASSETS}/${folder}/logo${extension ? '.' + extension : ''}`
  const res = await uploadImageToBucket(fileDestination, file)
  return constructPublicPath(res)
}

export const uploadLootboxCover = async (folder: string, file: File): Promise<string> => {
  const extension = file?.name?.split('.').pop()
  const fileDestination = `${LOOTBOX_ASSETS}/${folder}/cover${extension ? '.' + extension : ''}`
  const res = await uploadImageToBucket(fileDestination, file)
  return constructPublicPath(res)
}
