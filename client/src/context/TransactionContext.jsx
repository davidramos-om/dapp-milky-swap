import React, { useEffect, useState, useLayoutEffect } from 'react';
import Toastify from 'toastify-js';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';

export const TransactionContext = React.createContext({
    isConnected: false,
    account: '',
    processing: { status: false, breakpoint: '' },
    transactions: [],
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

export const ls_count_key = 'transactionCount';

export const TransactionProvider = ({ children }) => {

    const [ currentAccount, setConnectedAccount ] = useState('');
    const [ processing, setProcessing ] = useState({ status: false, breakpoint: '' });
    const [ transactions, setTransactions ] = useState([]);

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

            getAllTransactions();
            const accounts = await ethereum.request({ method: 'eth_accounts' });
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


    const checkIfTransactionExists = async () => {

        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem(ls_count_key, transactionCount);
        }
        catch (error) {

            Toastify({
                text: error?.message || '',
                className: "error",
                duration: 3000,
                close: true,
                position: 'right',
                backgroundColor: '#f44336',
            }).showToast();
        }
    }

    const getAllTransactions = async () => {
        try {

            if (!ethereum) {
                Toastify({ text: "Please, install Metamask before using this app.", duration: 3000, close: true, position: 'center' }).showToast();
                return false;
            }

            if (!ethereum.isConnected()) {
                Toastify({ text: "Please, connect to Metamask before using this app.", duration: 3000, close: true, position: 'center' }).showToast();
                return false;
            }

            const transactionContract = getEthereumContract();
            const transactions = await transactionContract.getAllTransactions();
            const structuredTransactions = transactions.map((trx) => {

                const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                return {
                    id: id,
                    addressFrom: trx.sender,
                    addressTo: trx.receiver,
                    keyword: trx.keyword,
                    message: trx.message,
                    timestamp: new Date(trx.timeStamp.toNumber() * 1000).toLocaleString(),
                    date: new Date(trx.timeStamp.toNumber() * 1000),
                    amount: ethers.utils.formatEther(trx.amount),
                    // amount: parseInt(trx.amount._hex) / (10 ** 18),
                }
            });

            const topSortedTransactions = structuredTransactions.sort((a, b) => b.date - a.date).slice(0, 20);
            setTransactions(topSortedTransactions);
        }
        catch (error) {
            console.log(error);
            setTransactions([]);
        }
    }

    const sendTransaction = async ({ addressTo, amount, keyword, message }) => {
        try {

            const isConnected = await checkIfWalletIsConnected();
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

            setProcessing({ status: true, breakpoint: 'adding to blockchain' });
            const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount._hex, message, keyword);
            transactionHash.wait();

            setProcessing({ status: true, breakpoint: 'Transaction counter' });
            checkIfTransactionExists();
            await getAllTransactions();
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
        checkIfTransactionExists();
    }, [])


    return (
        <TransactionContext.Provider value={{
            isConnected: !!currentAccount,
            account: currentAccount,
            processing,
            transactions,
            connectWallet,
            disconectWallet,
            sendTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
}
