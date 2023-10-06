import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(undefined);
const[tonkenName,setTokenName]= useState(undefined)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
    if (Contract) {
      setTotalSupply((await contract.tokenName());
    }
  }


  const getTokenName= async() => {
    if (Contract) {
      setTokenName((await contract.getTotalSupply()).toNumber());
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
        <p>The token name is :{tokenName}}</p>
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
