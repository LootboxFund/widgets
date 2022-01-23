
import react from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';
import { useSnapshot } from 'valtio'
import { userState } from 'lib/state/userState';

export const useWeb3 = async () => {
	const provider = await detectEthereumProvider();
	let web3 = new Web3("https://bsc-dataseed.binance.org/");
	if (provider) {
		// From now on, this should always be true:
		// provider === window.ethereum
		web3 = new Web3((window as any).ethereum)
		const userAccounts = await web3.eth.getAccounts()
		userState.accounts = userAccounts
	} else {
		console.log('Please install MetaMask!');
		throw Error('MetaMask not detected')
	}
	return web3
}

export const useUserInfo = () => {
	const requestAccounts = async () => {
		try {
			const web3 = await useWeb3()
			const preAccounts = await web3.eth.getAccounts()
			console.log(preAccounts)
			await web3.eth.requestAccounts(async (err, accounts) => {
				if (err) {
					console.log(err)
				} else {
					console.log('--- accounts ---')
					console.log(accounts)
					const userAccounts = await web3.eth.getAccounts()
					userState.accounts = userAccounts
					console.log(userAccounts)
				}
			})
			return {
				success: true,
				message: 'Successfully connected to wallet'
			}
		} catch (e) {
			return {
				success: false,
				message: "Please install MetaMask"
			}
		}
	}
	const getNativeBalance = async () => {
		const web3 = await useWeb3()
		const nativeBalance = await web3.eth.getBalance(userState.accounts[0])
		return nativeBalance
	}
	return {
		requestAccounts,
		getNativeBalance
	}
}
