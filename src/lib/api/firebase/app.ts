import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCE5gn-Tm4fwzOHH-wpx68SxUk_-BuH5BU',
  authDomain: 'guildfx-exchange.firebaseapp.com',
  databaseURL: 'https://guildfx-exchange-default-rtdb.firebaseio.com',
  projectId: 'guildfx-exchange',
  storageBucket: 'guildfx-exchange.appspot.com',
  messagingSenderId: '334494020080',
  appId: '1:334494020080:web:4baa825fb0923fbab0ad35',
  measurementId: 'G-2GNQPQ3LRX',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
