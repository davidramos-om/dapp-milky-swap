
import { useLayoutEffect } from "react";
import Swal from 'sweetalert2';
import { NavBar, Welcome, Footer, Services, Transactions } from './components';

const App = () => {

  useLayoutEffect(() => {

    Swal.fire(
      {
        title: 'Welcome to Milky Swap!',
        html: `Bear in mind that this is a Dev App running on the Rinkeby Testnet. <br /> <br /> Please do not send any real Ether to this App.`,
        icon: 'info',
        footer: `<a href="https://rinkeby.etherscan.io/address/0x52cb60a870cf8afd3c38fb0be79c2b2754daedb4" target="_blank" rel="noreferrer noopener nofollow">Go to contract</a>`
      },
    );
  })

  return (
    <div className="min-h-screen">
      <div className='gradient-bg-welcome'>
        <NavBar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App
