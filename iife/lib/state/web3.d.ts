/// <reference types="react" />
import { Web3ReactHooks } from 'widgets-web3-react/core';
import { Connector } from 'widgets-web3-react/types';
export declare type Web3ReactState = [Connector, Web3ReactHooks];
export declare const urlAtom: import("jotai").WritableAtom<Web3ReactState, typeof import("jotai/utils").RESET | (Web3ReactState | ((prev: Web3ReactState) => Web3ReactState)), void>;
export declare const injectedAtom: import("jotai").WritableAtom<Web3ReactState, typeof import("jotai/utils").RESET | (Web3ReactState | ((prev: Web3ReactState) => Web3ReactState)), void>;
export declare const multicall: {
    reducerPath: string;
    reducer: import("redux").Reducer<import("@uniswap/redux-multicall").MulticallState, import("redux").AnyAction>;
    actions: import("@reduxjs/toolkit").CaseReducerActions<{
        addMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("@uniswap/redux-multicall").MulticallState>, action: {
            payload: import("@uniswap/redux-multicall").MulticallListenerPayload;
            type: string;
        }) => void;
        removeMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("@uniswap/redux-multicall").MulticallState>, action: {
            payload: import("@uniswap/redux-multicall").MulticallListenerPayload;
            type: string;
        }) => void;
        fetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("@uniswap/redux-multicall").MulticallState>, action: {
            payload: import("@uniswap/redux-multicall").MulticallFetchingPayload;
            type: string;
        }) => void;
        errorFetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("@uniswap/redux-multicall").MulticallState>, action: {
            payload: import("@uniswap/redux-multicall").MulticallFetchingPayload;
            type: string;
        }) => void;
        updateMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("@uniswap/redux-multicall").MulticallState>, action: {
            payload: import("@uniswap/redux-multicall").MulticallResultsPayload;
            type: string;
        }) => void;
    }>;
    hooks: {
        useMultipleContractSingleData: (chainId: number | undefined, latestBlockNumber: number | undefined, addresses: (string | undefined)[], contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("@uniswap/redux-multicall/dist/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => import("@uniswap/redux-multicall").CallState[];
        useSingleContractMultipleData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, callInputs: ((string | number | import("ethers").BigNumber | import("@uniswap/redux-multicall/dist/validation").MethodArg[] | undefined)[] | undefined)[], options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => import("@uniswap/redux-multicall").CallState[];
        useSingleContractWithCallData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, callDatas: string[], options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => import("@uniswap/redux-multicall").CallState[];
        useSingleCallResult: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, inputs?: (string | number | import("ethers").BigNumber | import("@uniswap/redux-multicall/dist/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => import("@uniswap/redux-multicall").CallState;
        useMultiChainMultiContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddresses: Record<number, (string | undefined)[]>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("@uniswap/redux-multicall/dist/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => Record<number, import("@uniswap/redux-multicall").CallState[]>;
        useMultiChainSingleContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddress: Record<number, string | undefined>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("@uniswap/redux-multicall/dist/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("@uniswap/redux-multicall").ListenerOptionsWithGas> | undefined) => Record<number, import("@uniswap/redux-multicall").CallState>;
    };
    Updater: (props: Pick<import("@uniswap/redux-multicall/dist/updater").UpdaterProps, "chainId" | "latestBlockNumber" | "contract" | "isDebug">) => JSX.Element;
};
export declare const multicallStoreAtom: import("jotai").WritableAtom<import("@uniswap/redux-multicall").MulticallState, import("redux").AnyAction, void>;
