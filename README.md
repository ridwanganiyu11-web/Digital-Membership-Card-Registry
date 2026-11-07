# MemberChain (Botchain Testnet - Chain ID: 968)
> **Your Membership. Your Identity. On-Chain.**

MemberChain is a Web3 digital membership card registry protocol built for **Botchain Testnet**. It enables organizations, clubs, schools, alumni networks, churches, associations, and communities to issue verifiable digital membership passes tied directly to members' wallet addresses.

---

## 🌟 Key Features

* **Multi-Organization Architecture**: Any organization can connect their wallet, register their profile and logo, and issue/manage credentials independently.
* **Realistic Digital Pass Visuals**: Dynamic holographic & metallic pass styling with custom branding, membership ID, chip accent, and QR verification code.
* **Instant Export**: Members can download their cards as high-resolution PNGs directly to their phone or computer.
* **Zero-Gas Public Verification**: Public scanners and inspectors can scan the QR code (`/verify/:id`) to check authenticity and real-time status without needing MetaMask, gas, or transaction fees.
* **Expiry & Lifecycle Management**: Automatic calculation of `ACTIVE`, `EXPIRED`, `SUSPENDED`, or `REVOKED` states on-chain.
* **Legal Accreditation Notice**: Clarifies cryptographic on-chain verification vs. real-world government accreditation.

---

## ⚙️ Network Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Native Token** | `BOT` |
| **Total Supply** | 150 Million |
| **Block Explorer** | [https://scan.bohr.life/](https://scan.bohr.life/) |

---

## 🚀 Quick Start Guide

### 1. Environment Setup
Fill in your credentials in [`.env`](file:///.env):
```env
# Reown (WalletConnect) Project ID (Get one at https://cloud.reown.com)
VITE_REOWN_PROJECT_ID=your_reown_project_id

# Private Key for Deploying Contracts to Botchain Testnet
PRIVATE_KEY=your_private_key
```

### 2. Deploy Smart Contract to Botchain Testnet
Run the automated deployment script:
```bash
npm run deploy:contract
```
This will compile `contracts/MembershipCardRegistry.sol`, deploy it to Botchain Testnet using your private key, and automatically update `.env` and `src/contracts/contractData.js` with the new contract address.

### 3. Start the Web Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

