import { CryptoCardForm } from './CryptoCardForm';
import { useTransactionContext } from "../context/useTransactionContext";

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {

    const { isConnected, connectWallet, disconectWallet, } = useTransactionContext();

    return (
        <div className="flex w-full justify-center items-center">
            <div className='flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4'>
                <div className='flex flex-1 justify-start flex-col mf:mr-10'>
                    <h1 className='text-3xl sm:text-5xl text-white text-gradient py-1'>
                        Welcome to the <br /> future of money!
                    </h1>
                    <p className='text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base'>
                        Explore the world of crypto and get the best deals and offers. Buy and sell crypto with the best exchange.
                    </p>
                    <button
                        type='button'
                        className='flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]'
                        onClick={isConnected ? disconectWallet : connectWallet}
                    >
                        <p className='text-white text-base font-semibold'>
                            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
                        </p>
                    </button>
                    <div className='grid sm:grid-cols-3 grid-cols-2 w-full mt-10'>
                        <div className={`rounded-tl-2xl ${commonStyles}`}>
                            Reliability
                        </div>
                        <div className={commonStyles}> Security </div>
                        <div className={`rounded-tr-2xl ${commonStyles}`}>
                            Ethereum
                        </div>
                        <div className={`rounded-bl-2xl ${commonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={commonStyles}>
                            Low fees
                        </div>
                        <div className={`rounded-br-2xl ${commonStyles}`}>
                            Blockchain
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10'>
                    <CryptoCardForm />
                </div>
            </div>
        </div>
    );
}

export default Welcome;