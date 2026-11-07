# MemberChain — Your Membership. Your Identity. On-Chain.

[![Botchain Testnet](https://img.shields.io/badge/Network-Botchain_Testnet-0284c7?style=for-the-badge)](https://scan.bohr.life/)
[![Chain ID](https://img.shields.io/badge/Chain_ID-968-38bdf8?style=for-the-badge)](https://scan.bohr.life/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**MemberChain** is an open Web3 digital membership card registry protocol designed for organizations, clubs, schools, alumni associations, churches, and communities. Instead of printing disposable plastic passes, organizations issue cryptographically secure digital credentials linked directly to member wallet addresses and recorded on the **Botchain** blockchain.

---

## ⛓️ Live On-Chain Deployment (Botchain Testnet)

| Detail | Value |
| :--- | :--- |
| **Network** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Native Token** | `BOT` (Total Supply: 150 Million) |
| **Smart Contract Address** | [`0x8bb6b9032fa5b825903db9e074f61d28bb130d45`](https://scan.bohr.life/address/0x8bb6b9032fa5b825903db9e074f61d28bb130d45) |
| **Deployment Tx Hash** | [`0x39fa16fd25c62bcd686c173fa6581b9252f9240a1adf5d5b103d0bbac3ff212f`](https://scan.bohr.life/tx/0x39fa16fd25c62bcd686c173fa6581b9252f9240a1adf5d5b103d0bbac3ff212f) |
| **Explorer** | [https://scan.bohr.life/](https://scan.bohr.life/) |

---

## ✨ System Architecture & Features

### 1. Multi-Organization Platform (Option A)
* Any organization can connect their MetaMask or Web3 wallet and register on-chain.
* Organizations upload their name, description, and logo (which renders on cards).
* Self-serve member roster management: issue cards, renew validity periods, and revoke cards.

### 2. Realistic Digital Pass Rendering
* High-fidelity metallic and holographic card styling.
* Displays Organization Name, Logo, Member Name, Membership Number (e.g. `MBR-000125`), Issued Date, Expiry Date, and metallic security chip.
* Dynamic status badging: `ACTIVE` (Emerald), `EXPIRED` (Amber), `REVOKED` (Red), or `SUSPENDED` (Yellow).
* Export directly as high-resolution **PNG** or **PDF**.

### 3. Public Verification Layer (Zero Gas, No Wallet Needed)
* Each card embeds a dynamic QR code pointing to `/?tab=verify&cardId=[ID]`.
* Scanners (smartphones, event staff, security) can verify passes on-chain with **zero gas fees** and **no MetaMask installed**.
* Direct queries to Botchain RPC verify cryptographic issuance in real-time.
* Prominently displays the difference between on-chain proof and real-world legal accreditation.

---

## 🛠️ Tech Stack

* **Smart Contracts**: Solidity `0.8.20`, Viem, Solc.
* **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons.
* **Web3 Integration**: Reown AppKit (`@reown/appkit`), `@reown/appkit-adapter-wagmi`, `wagmi@2.x`, `viem`.
* **Export & QR Engine**: `html-to-image`, `qrcode.react`, `canvas-confetti`.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ridwanganiyu11-web/Digital-Membership-Card-Registry.git
cd Digital-Membership-Card-Registry
npm install
```

### 2. Environment Configuration
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Add your Reown Project ID (from [cloud.reown.com](https://cloud.reown.com)) and deployer private key:
```env
VITE_REOWN_PROJECT_ID=your_reown_project_id
PRIVATE_KEY=your_private_key
VITE_CONTRACT_ADDRESS=0x8bb6b9032fa5b825903db9e074f61d28bb130d45
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Deploy New Contract (Optional)
```bash
npm run deploy:contract
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
