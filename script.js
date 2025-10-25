// Polished front-end interactions (uses ethers v6 global)
let provider, signer;
const contractABI = [
  "function signAgreement() public",
  "function releaseIfReady() public",
  "function refundBuyer() public",
  "function getDetails() public view returns (address,address,uint256,bool,bool)"
];

async function connectWallet(){
  if (!window.ethereum) return alert("Install MetaMask to use this demo.");
  try {
    provider = new ethers.BrowserProvider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const addr = await signer.getAddress();
    document.getElementById('account').innerText = addr;
    toast("Wallet connected: " + addr);
  } catch (e) {
    console.error(e); toast("Could not connect wallet.");
  }
}

async function signAgreement(){
  const address = document.getElementById('contractAddress').value.trim();
  if (!address) return alert("Paste deployed contract address first.");
  const contract = new ethers.Contract(address, contractABI, signer);
  setStatus("Sending sign transaction...");
  try {
    const tx = await contract.signAgreement();
    setStatus("Tx: " + tx.hash);
    await tx.wait();
    setStatus("✅ Signed on-chain");
    updateDetails(address);
  } catch(e){ console.error(e); setStatus("Error: " + (e?.message||e)); }
}

async function releaseIfReady(){
  const address = document.getElementById('contractAddress').value.trim();
  if (!address) return alert("Paste deployed contract address first.");
  const contract = new ethers.Contract(address, contractABI, signer);
  setStatus("Sending release transaction...");
  try{
    const tx = await contract.releaseIfReady();
    setStatus("Tx: " + tx.hash);
    await tx.wait();
    setStatus("✅ Released to seller");
    updateDetails(address);
  } catch(e){ console.error(e); setStatus("Error: " + (e?.message||e)); }
}

async function refundBuyer(){
  const address = document.getElementById('contractAddress').value.trim();
  if (!address) return alert("Paste deployed contract address first.");
  const contract = new ethers.Contract(address, contractABI, signer);
  setStatus("Sending refund transaction...");
  try{
    const tx = await contract.refundBuyer();
    setStatus("Tx: " + tx.hash);
    await tx.wait();
    setStatus("✅ Refunded to buyer");
    updateDetails(address);
  } catch(e){ console.error(e); setStatus("Error: " + (e?.message||e)); }
}

async function updateDetails(address){
  try {
    const providerRead = provider || new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(address, contractABI, providerRead);
    const d = await contract.getDetails();
    const [buyer, seller, amount, bAppr, sAppr] = d;
    let ethAmount = "0";
    try { ethAmount = ethers.formatEther(amount || 0); } catch(e){}
    document.getElementById('details').innerText = 
      `Buyer: ${buyer}\nSeller: ${seller}\nAmount (ETH): ${ethAmount}\nBuyerSigned: ${bAppr}\nSellerSigned: ${sAppr}`;
  } catch (e) {
    console.error(e);
  }
}

function setStatus(txt){ document.getElementById('txStatus').innerText = txt; }
function copyText(id){ navigator.clipboard.writeText(document.getElementById(id).innerText).then(()=>toast("Copied")) }
function toast(msg){ setStatus(msg); setTimeout(()=>{ if(document.getElementById('txStatus').innerText === msg) document.getElementById('txStatus').innerText = "" }, 6000) }

/* Contract Writer demo + local save */
function generateSample(){
  const input = document.getElementById('contractText').value.trim();
  if (!input) return alert("Please describe the deal first.");
  const out = `SMART CONTRACT\n\nTask: ${input}\n\nEscrow terms: Funds will be held in escrow and released when both parties sign on-chain.\n\nDate: ${new Date().toLocaleDateString()}`;
  document.getElementById('savedContract').innerText = out;
}
function saveContract(){
  const text = document.getElementById('contractText').value.trim();
  if (!text) return alert("Write contract details to save.");
  localStorage.setItem('chaintrust_saved', text);
  toast("Contract saved locally");
}
window.addEventListener('load', ()=>{
  const s = localStorage.getItem('chaintrust_saved');
  if (s) document.getElementById('savedContract').innerText = s;
  document.getElementById('usdtAddr').innerText = '0xYourUSDTWalletHere';
  document.getElementById('ethAddr').innerText = '0xYourETHWalletHere';
  document.getElementById('overallProgress').style.width = '40%';
});
