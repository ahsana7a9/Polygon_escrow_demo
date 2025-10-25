# ChainTrust — Polygon Mumbai Escrow Demo

This repository is a ready-to-run demo for the **ChainTrust** proof-of-concept:
- Escrow smart contract (Escrow.sol)
- Hardhat scripts for Polygon Mumbai deployment
- Polished frontend (static HTML/JS/CSS) to interact with deployed contracts
- Simple contract-writing demo (local save)

---

## Quick start (testnet - Polygon Mumbai)

1. Install dependencies:
```bash
npm install
```

2. Fill `.env` (create from `.env.example`) with your PRIVATE_KEY and RPC_URL (Polygon Mumbai RPC). Example `.env`:
```
PRIVATE_KEY=0xyourprivatekey
RPC_URL=https://rpc-mumbai.maticvigil.com
SELLER_ADDRESS=0xSellerAddressHere
```

3. Compile & deploy to Mumbai (this deploys an Escrow contract and funds it with 0.01 MATIC by default):
```bash
npx hardhat run scripts/deploy.js --network polygon_mumbai
```

4. Copy the deployed contract address from the deploy output and open the frontend:
```bash
# serve frontend (optional)
npx http-server frontend -p 8080
# open http://localhost:8080 in your browser
```

5. In the frontend paste the contract address, connect MetaMask (set to Polygon Mumbai), then use **Sign Agreement**, **Release (if signed)**, or **Refund Buyer** buttons.
You can view transactions on Polygonscan (Mumbai).

---
**Security & notes**:
- This demo uses a simplified on-chain signing flow (both parties call `signAgreement()` to sign). For production, use robust patterns (EIP-712 signatures, timeouts, audits).
- Never commit PRIVATE_KEY to public repos.
- This is for testing and educational purposes only.

---
