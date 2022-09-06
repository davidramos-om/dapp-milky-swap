import { useRef, useEffect } from 'react';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';

import { useTransactionContext } from "../context/useTransactionContext";
import { shortenAddress } from '../utils/helper'
import Loader from "./Loader";

const Input = ({ placeholder, onChange, name, type, value, inputRef }) => {

    return (
        <input
            ref={inputRef}
            name={name}
            type={type}
            step="0.0001"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className='my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism'
        >
        </input>
    );
}

export const CryptoCardForm = () => {

    const { account, isConnected, processing, sendTransaction } = useTransactionContext();
    const refAmount = useRef(null);
    const refAddressTo = useRef(null);
    const refkeyword = useRef(null);
    const refMessage = useRef(null);

    const handleChange = (e) => {

        switch (e?.target?.name || '') {
            case 'amount':
                refAmount.current.value = e.target.value;
                break;
            case 'addressTo':
                refAddressTo.current.value = e.target.value;
                break;
            case 'keyword':
                refkeyword.current.value = e.target.value;
                break;
            case 'message':
                refMessage.current.value = e.target.value;
                break;
            default:
                break;
        }
    }

    useEffect(() => {

        if (!isConnected)
            return;

        if (refAddressTo?.current)
            refAddressTo.current.value = '0x16aaE63E97922d139A963f6E3e4c4413284d9080';

        if (refAmount?.current)
            refAmount.current.value = '0.0001';

        if (refkeyword?.current)
            refkeyword.current.value = 'test 4';

        if (refMessage?.current)
            refMessage.current.value = 'test 4';

    }, [ isConnected, refAddressTo?.current, refAmount?.current, refkeyword?.current, refMessage?.current ]);

    const handleSubmitTransaction = (e) => {

        e.preventDefault();

        console.log('handleSubmitTransaction');
        sendTransaction({
            addressTo: refAddressTo.current.value,
            amount: refAmount.current.value,
            keyword: refkeyword.current.value,
            message: refMessage.current.value
        });
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-73 w-full my-5 eth-card white-glassmorphism'>
                <div className='flex justify-between flex-col w-full h-full'>
                    <div className='flex justify-between items-start'>
                        <div className='w-10 h-10 rounded-full border-2 border-white flex justify-center items-center'>
                            <SiEthereum fontSize={21} color='#fff' />
                        </div>
                        <BsInfoCircle fontSize={17} color='#fff' />
                    </div>
                    <div>
                        <p className='text-white text-sm font-light'>
                            {account ? shortenAddress(account) : `Address`}
                        </p>
                        <p className='text-white text-lg font-semibold'>
                            Ethereum
                        </p>
                    </div>
                </div>
            </div>
            <div className='p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism'>
                <Input placeholder='Address to' inputRef={refAddressTo} name="addressTo" type="text" onChange={handleChange} />
                <Input placeholder='Amount (ETH)' inputRef={refAmount} name="amount" type="number" onChange={handleChange} />
                <Input placeholder='Keyword (Gif)' inputRef={refkeyword} name="keyword" type="text" onChange={handleChange} />
                <Input placeholder='Enter Message' inputRef={refMessage} name="message" type="text" onChange={handleChange} />
                <div className='h-[1px] w-full bg-gray-400 my-2' />

                {processing.breakpoint && (
                    <div className="pt-6 md:p-8 text-center space-y-4">
                        <blockquote>
                            <p className="text-lg font-medium text-gray-50">
                                {processing.breakpoint}
                            </p>
                        </blockquote>
                    </div>
                )}

                {processing.status ?
                    <Loader />
                    :
                    <button
                        type='button'
                        className='text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c]  rounded-full cursor-pointer hover:bg-[#2d4f9c]'
                        onClick={handleSubmitTransaction}
                    // disabled={processing ? true : ((isConnected && account) ? false : true)}
                    >
                        Send Now
                    </button>
                }
            </div>
        </div>
    );
}
