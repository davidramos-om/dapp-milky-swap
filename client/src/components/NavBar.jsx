
import { useState } from 'react';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import logo from '../images/logo.png';

const NavBarItem = ({ title, classProps }) => {

    return (
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    );
}

const menu = [ 'Market', 'Exchange', 'Wallet', 'Tutorial', 'About' ];

const NavBar = () => {

    const [ toggleMenu, setToggleMenu ] = useState(false);

    const handleCloseMenu = () => {
        setToggleMenu(false);
    }

    const handleOpenMenu = () => {
        setToggleMenu(true);
    }

    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="logo" className="w-16 cursor-pointer" />
            </div>
            <ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
                {menu.map((title) => {
                    return (
                        <NavBarItem key={title} title={title} />
                    )
                })}
            </ul>
            <div className='flex relative'>
                {toggleMenu ?
                    <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={handleCloseMenu} /> :
                    <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={handleOpenMenu} />
                }
                {toggleMenu && (
                    <ul
                        className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col 
                        justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in'
                    >
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose fontSize={28} onClick={handleCloseMenu} />
                        </li>
                        {menu.map((title) => {
                            return (
                                <NavBarItem key={title} title={title} classProps="my-2 text-lg" />
                            )
                        })}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default NavBar;