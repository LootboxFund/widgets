import { app as firebaseApp } from './app'
import { getStorage, ref, uploadBytes } from '@firebase/storage'

const storage = getStorage(firebaseApp)

export const uploadImageToBucket = async (file: File) => {
  // Create a root reference
  const storage = getStorage()

  // Create a reference to 'mountains.jpg'
  const storageRef = ref(storage, 'mountains.jpg')

  // // Create a reference to 'images/mountains.jpg'
  // const mountainImagesRef = ref(storage, 'images/mountains.jpg');

  // // While the file names are the same, the references point to different files
  // mountainsRef.name === mountainImagesRef.name;           // true
  // mountainsRef.fullPath === mountainImagesRef.fullPath;   // false

  // const storage = getStorage();
  // const storageRef = ref(storage, 'some-child');

  // 'file' comes from the Blob or File API
  console.log('uploading....', file)
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!', snapshot)
  })

  // Creates a client
  // const storage = new Storage()
  // console.log('Uploading file to bucket')
  // /**
  //  * TODO(developer): Uncomment the following lines before running the sample.
  //  */
  // // The ID of your GCS bucket
  // const bucketName = 'guildfx-exchange.appspot.com'
  // // The path to your file to upload
  // const filePath = '/Users/starship420/Downloads/ust-logo.png'
  // // The new ID for your GCS file
  // const destFileName = 'ust-test-image.png'
  // await storage.bucket(bucketName).upload(filePath, {
  //   destination: destFileName,
  // })
  // console.log(`${filePath} uploaded to ${bucketName}`)
}

// // curl -X POST --data-binary @OBJECT_LOCATION \
// //     -H "Authorization: Bearer OAUTH2_TOKEN" \
// //     -H "Content-Type: OBJECT_CONTENT_TYPE" \
// //     "https://storage.googleapis.com/upload/storage/v1/b/BUCKET_NAME/o?uploadType=media&name=OBJECT_NAME"

// interface IImageDetails {
//   lootbox: Address
//   name: string
// }
// const ACCESS_TOKEN =
//   'ya29.A0ARrdaM9FKfd4EyP72SMEToG0IJrhiglKPOW6SPqPcW-vKoQxWswgyaHqduP_n6IRtvg77ytHygaDv1fRjlv9kecBDNpZLQ4QY91KW9fdEzaaLEXuVLpjIwNkcnp88oHLg3ImGAyg9SagvEQPmtHxQBTy0fHn'
// export const uploadImageToBucket = async (imageDetails: IImageDetails) => {
//   console.log('Uploading image', imageDetails)
//   const headers = new Headers({
//     Authorization: `Bearer ${ACCESS_TOKEN}`,
//     'Content-Type': 'OBJECT_CONTENT_TYPE',
//   })
//   const url = storageUploadUrl(imageDetails.name)

//   console.log('upload url', url)

//   const x = await fetch(url, {
//     method: 'POST',
//     headers: headers,
//     mode: 'cors',
//     cache: 'default',
//     // body: JSON.stringify(inputs),
//   })

//   console.log('result', x)

//   return x
// }
