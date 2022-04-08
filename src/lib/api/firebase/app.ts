import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { manifest } from '../../../manifest'

const firebaseConfig = manifest.firebase

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
