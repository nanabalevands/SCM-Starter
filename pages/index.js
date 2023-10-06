import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "../contracts/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(undefined);
const[tokenName,setTokenName]= useState(undefined)
  const contractAddress = "0x85aC86055CCcB6c868C8c5d1d1e0B8f9FB828E0A";

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(contractAddress, abi, signer);
 
    setContract(Contract);
  }

  const getTotalSupply= async() => {
    if (contract) {
      setTotalSupply(((await contract.totalSupply()).toNumber()));
    }
  }


  const getTokenName= async() => {
    if (contract) {
      setTokenName((await contract.tokenName()));
    }
  }
  const mint = async() => {
    if (contract) {
      let tx = await contract.mint(1);
      await tx.wait()
      getTotalSupply();
    }
  }

  const burn = async() => {
    if (contract) {
      let tx = await contract.burn(1);
      await tx.wait()
      getTotalSupply();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (tokenName == undefined || totalSupply== undefined) {
      getTokenName();
      getTotalSupply ();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>The token name is :{tokenName}</p>
        <p>The token supply is : {totalSupply}</p>
        <button onClick={mint}>mint 1 {tokenName}</button>
        <button onClick={burn}>burn 1 {tokenName}</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the token service!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
