import { Address } from 'lib/types/baseTypes';
import Web3 from 'web3';
import {AbiItem} from 'web3-utils';
import AggregatorV3Interface from "@chainlink/abi/v0.7/interfaces/AggregatorV3Interface.json"
import { useWeb3 } from '../useWeb3Api';

export const getPriceFeed = async (contractAddress: Address) => {
	const web3 = await useWeb3();
	console.log("Trying price oracle...")
	let contractInstance = new web3.eth.Contract(
		AggregatorV3Interface.abi as AbiItem[],
		contractAddress
	);
	const [currentUser, ...otherUserAddress] = await web3.eth.getAccounts();
	console.log(contractInstance)
	contractInstance.methods.latestRoundData().call({from: currentUser})
		.on('receipt', function(data: any){
			console.log(data)
		});
}

