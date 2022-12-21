import { Url } from '@wormgraph/helpers'

export const downloadFile = async (fileName: string, fileSrc: Url) => {
  const image = await fetch(fileSrc)
  const imageBlob = await image.blob()
  const imageURL = URL.createObjectURL(imageBlob)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return
}
