
import { useLayoutEffect } from "react";
import Swal from 'sweetalert2';
import { NavBar, Welcome, Footer, Services, Transactions } from './components';

const App = () => {

  useLayoutEffect(() => {

    Swal.fire(
      {
        title: 'Welcome to Milky App!',
        html: `Bear in mind that this is a test dApp running on the Goerli Testnet. <br /> <br /> Please do not send any real Ether using this App.`,
        icon: 'info',
        footer: `<a href="https://goerli.etherscan.io/address/0x29ee343a78b99C19E958A4e27Ed5D141Ed38d881" target="_blank" rel="noreferrer noopener nofollow">Go to contract</a>`
      },
    );
  }, []);

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
