import { ITicketMetadata } from 'lib/types'

export const readJSON = async <T>(file: string): Promise<T> => {
  // TODO: dynamically read json file in cloud storage
  const result: any = {
    name: '',
    description: '',
    image: '',
    backgroundColor: '',
    backgroundImage: '',
  }
  return result as T
}

export const readTicketMetadata = async (file: string): Promise<ITicketMetadata> => {
  const { name, description, image, backgroundColor, backgroundImage } = await readJSON(file)

  return { name, description, image, backgroundColor, backgroundImage }
}
