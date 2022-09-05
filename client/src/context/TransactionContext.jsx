import React, { useEffect, useState, useLayoutEffect } from 'react';
import Toastify from 'toastify-js';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';

export const TransactionContext = React.createContext({
    isConnected: false,
    account: '',
    processing: { status: false, breakpoint: '' },
    connectWallet: () => { },
    disconectWallet: () => { },
    sendTransaction: ({ addressTo, amount, keyword, message }) => { },
});

const { ethereum } = window;

const getEthereumContract = () => {

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    return transactionContract
}

const ls_count_key = 'transactionCount';
export const TransactionProvider = ({ children }) => {

    const [ currentAccount, setConnectedAccount ] = useState('');
    const [ processing, setProcessing ] = useState({ status: false, breakpoint: '' });
    const [ transactionCount, setTransactionCount ] = useState(localStorage.getItem(ls_count_key) || 0);


    useLayoutEffect(() => {

        if (ethereum) {

            ethereum.on('accountsChanged', async (accounts) => {

                if ((accounts?.length || 0) <= 0)
                    disconectWallet();
                else
                    checkIfWalletIsConnected();
            });
        }
    }, []);

    const checkIfWalletIsConnected = async () => {

        try {
            if (!ethereum) {
                Toastify({ text: "Please, install Metamask before using this app.", duration: 3000, close: true, position: 'center' }).showToast();
                return false;
            }

            if (!ethereum.isConnected()) {
                Toastify({ text: "Please, connect to Metamask before using this app.", duration: 3000, close: true, position: 'center' }).showToast();
                return false;
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(`🐛  -> 🔥 :  checkIfWalletIsConnected 🔥 :  accounts`, accounts);
            if ((accounts?.length || 0) > 0)
                setConnectedAccount(accounts[ 0 ]);

            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    const disconectWallet = async () => {
        try {

            setConnectedAccount('');
            await ethereum.request({ method: 'eth_disconnect' });
        }
        catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {

            if (!await checkIfWalletIsConnected())
                return;

            await ethereum.enable();

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            if (!(accounts.length > 0)) {
                Toastify({ text: "Please, create an account on MetaMask", className: "warning", duration: 3000, close: true, position: 'center' }).showToast();
                return;
            }

            setConnectedAccount(accounts[ 0 ]);
        }
        catch (error) {
            console.log(error);

            if (error?.message) {
                Toastify({
                    text: error?.message || '',
                    className: "error",
                    duration: 3000,
                    close: true,
                    position: 'right',
                    backgroundColor: '#f44336',
                }).showToast();
            }
            else {
                Toastify({ text: "Something went wrong. Please, try again. ", duration: 3000, close: true, position: 'right' }).showToast();
            }
        }
    }

    const sendTransaction = async ({ addressTo, amount, keyword, message }) => {
        try {

            const isConnected = await checkIfWalletIsConnected();
            console.log(`🐛  -> 🔥 :  sendTransaction 🔥 :  isConnected`, isConnected);
            if (!isConnected)
                return;

            if (!currentAccount) {
                Toastify({
                    text: 'Please connect your wallet and select an account before sending a transaction.',
                    duration: 10000,
                    close: true,
                    gravity: 'top',
                    position: 'center',
                    stopOnFocus: true,
                    style: { background: '#f44336' },
                }).showToast();
                return;
            }

            if (!addressTo) {
                Toastify({ text: 'Please enter a valid address' }).showToast();
                return;
            }

            if (!amount) {
                Toastify({ text: 'Please enter a valid amount' }).showToast();
                return;
            }

            if (!keyword) {
                Toastify({ text: 'Please enter a valid keyword' }).showToast();
                return;
            }

            if (!message) {
                Toastify({ text: 'Please enter a valid message' }).showToast();
                return;
            }

            setProcessing({ status: true, breakpoint: 'sending' });
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            console.log(` parsedAmount`, parsedAmount);

            setProcessing({ status: true, breakpoint: 'request confirmation' });
            const result = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [ {
                    from: currentAccount,
                    to: addressTo,
                    value: parsedAmount._hex,
                    gas: '0x5208', // 21000 GWEI is the default gas limit | Gas limit is the amount of gas to use for the transaction.
                } ],
            });

            console.info("eth_sendTransaction.result", result);

            setProcessing({ status: true, breakpoint: 'adding to blockchain' });
            const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount._hex, message, keyword);
            console.info("loading - ", transactionHash.hash);
            transactionHash.wait();
            console.info("Success - ", transactionHash.hash);

            setProcessing({ status: true, breakpoint: 'Transaction counter' });
            const transactionCount = await transactionContract.getTransactionCount();
            const nTransactionCount = transactionCount?.toNumber() || 0;
            setTransactionCount(nTransactionCount);
            localStorage.setItem(ls_count_key, nTransactionCount);
            setProcessing({ status: false, breakpoint: 'Finished' });
        }
        catch (error) {
            console.log(error);

            setProcessing({ status: false, breakpoint: 'Error : ' + (error?.message || ' an error ocurred') });

            if (error?.message) {
                Toastify({
                    text: error?.message || '',
                    className: "error",
                    duration: 3000,
                    close: true,
                    position: 'center'
                }).showToast();
            }
            else {
                Toastify({ text: "Something went wrong. Please, try again. ", duration: 3000, close: true, position: 'center' }).showToast();
            }
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])


    return (
        <TransactionContext.Provider value={{
            isConnected: !!currentAccount,
            account: currentAccount,
            processing,
            connectWallet,
            disconectWallet,
            sendTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
}
