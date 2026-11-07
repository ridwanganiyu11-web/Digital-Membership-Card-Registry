import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { createWalletClient, createPublicClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Define Botchain Testnet (Chain ID: 968)
const botchainTestnet = defineChain({
  id: 968,
  name: 'Botchain Testnet',
  nativeCurrency: { name: 'Botchain Token', symbol: 'BOT', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'] },
    public: { http: [process.env.BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'] },
  },
  blockExplorers: {
    default: { name: 'BohrScan', url: 'https://scan.bohr.life/' },
  },
  testnet: true,
});

async function main() {
  console.log('====================================================');
  console.log('MemberChain - Deploying MembershipCardRegistry.sol');
  console.log('Network: Botchain Testnet (Chain ID: 968)');
  console.log('RPC URL: https://rpc.bohr.life');
  console.log('====================================================\n');

  let rawKey = process.env.PRIVATE_KEY;
  if (!rawKey || rawKey.trim() === '' || rawKey.includes('your_private_key')) {
    console.error('❌ Error: PRIVATE_KEY not found in .env');
    console.error('Please open .env and enter your private key (with or without 0x prefix).\n');
    process.exit(1);
  }

  rawKey = rawKey.trim();
  const privateKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;

  const account = privateKeyToAccount(privateKey);
  console.log(`🔑 Deployer Account: ${account.address}`);

  const publicClient = createPublicClient({
    chain: botchainTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: botchainTestnet,
    transport: http(),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`💰 Deployer Balance: ${Number(balance) / 1e18} BOT`);

  // Compile Solidity Contract
  console.log('\n🔨 Compiling contracts/MembershipCardRegistry.sol ...');
  const contractPath = path.resolve(process.cwd(), 'contracts', 'MembershipCardRegistry.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'MembershipCardRegistry.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    let hasFatal = false;
    for (const error of output.errors) {
      if (error.severity === 'error') {
        console.error(error.formattedMessage);
        hasFatal = true;
      } else {
        console.warn(error.formattedMessage);
      }
    }
    if (hasFatal) process.exit(1);
  }

  const contractOutput = output.contracts['MembershipCardRegistry.sol']['MembershipCardRegistry'];
  const abi = contractOutput.abi;
  const bytecode = `0x${contractOutput.evm.bytecode.object}`;

  console.log('✅ Compilation successful!');
  console.log('🚀 Deploying MembershipCardRegistry to Botchain Testnet...');

  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [],
  });

  console.log(`📝 Deployment Transaction Hash: ${hash}`);
  console.log(`🔍 View on Explorer: https://scan.bohr.life/tx/${hash}`);
  console.log('⏳ Waiting for block confirmation on Botchain...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const deployedAddress = receipt.contractAddress;

  console.log('\n🎉 SUCCESS! Contract deployed to:');
  console.log(`👉 Address: ${deployedAddress}\n`);

  // Update .env
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(/VITE_CONTRACT_ADDRESS=.*/, `VITE_CONTRACT_ADDRESS=${deployedAddress}`);
    } else {
      envContent += `\nVITE_CONTRACT_ADDRESS=${deployedAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Updated VITE_CONTRACT_ADDRESS in .env');
  }

  // Update src/contracts/contractData.js
  const contractDataPath = path.resolve(process.cwd(), 'src', 'contracts', 'contractData.js');
  if (fs.existsSync(contractDataPath)) {
    let dataContent = fs.readFileSync(contractDataPath, 'utf8');
    dataContent = dataContent.replace(/export const CONTRACT_ADDRESS = .*/, `export const CONTRACT_ADDRESS = "${deployedAddress}";`);
    fs.writeFileSync(contractDataPath, dataContent, 'utf8');
    console.log('✅ Updated CONTRACT_ADDRESS in src/contracts/contractData.js');
  }

  console.log('\nDeployment complete! You can now run `npm run dev` to launch the MemberChain app.');
}

main().catch((err) => {
  console.error('\n❌ Deployment failed:', err);
  process.exit(1);
});

