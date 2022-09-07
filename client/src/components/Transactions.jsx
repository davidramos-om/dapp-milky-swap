import React, { useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/helper'
import useFetch from '../hooks/useFetch'; 


const TransactionCard = ({ transaction }) => {

    const { id, url, message, timestamp, addressFrom, addressTo, amount, keyword } = transaction || {};
    const [ gifUrl ] = useFetch({ keyword });

    return (
        <div id={id} className="bg-[#181918] m-4 flex flex-1
        2xl:min-w-[450px]
        2xl:max-w-[590px]
        sm:min-w-[270px]
        sm:max-w-[300px]
        flex-col p-3 rounded-md hover:shadow-2xl
        ">
            <div className="flex flex-col items-center w-full mt-3">
                <div className="justify-start w-full mb-6 p-2">
                    <a href={`https://rinkeby.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer noopener nofollow"
                    >
                        <p className="text-white text-base">
                            From : {shortenAddress(addressFrom)}
                        </p>
                    </a>

                    <a href={`https://rinkeby.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer noopener nofollow" >
                        <p className="text-white text-base">
                            To : {shortenAddress(addressTo)}
                        </p>
                    </a>
                    <p className="text-white text-base">
                        Amount : {amount} ETH
                    </p>
                    {message && (
                        <>
                            <p className="text-white text-base">
                                Message : {message}
                            </p>
                        </>
                    )}
                </div>
                <img
                    src={gifUrl || url}
                    alt="gif"
                    className="w-full h-64 2x:h-96 object-cover rounded-md shadow-lg mt-4"
                />
                <div className="bg-black p-3 px-5 w-max rounded-3xl -mt- shadow-2xl">
                    <p className="text-[#37c7da] font-bold">
                        {timestamp}
                    </p>
                </div>
            </div>
        </div>
    );
}

const Transactions = () => {

    const { transactions } = useContext(TransactionContext);

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col w-full md:p-12 py-12 px-4">


                    <h3 className="text-white text-3xl text-center my-2">
                        Latest Transactions
                </h3>                

                <div className="flex flex-wrap justify-center items-center mt-10">
                    {transactions.reverse().map((trn, index) => (
                        <TransactionCard key={trn.id} transaction={trn} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Transactions;