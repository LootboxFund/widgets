import { ethers } from 'ethers'

export {}

declare global {
  interface Window {
    web3: any
    ethers: typeof ethers
    Weglot: any
    // ethereum: any
  }
}

declare module 'bignumber' {}
