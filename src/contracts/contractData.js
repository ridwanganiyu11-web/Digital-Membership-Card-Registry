export const CONTRACT_ADDRESS = "0x8bb6b9032fa5b825903db9e074f61d28bb130d45";

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "cardId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "orgWallet", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "memberWallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "memberName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "membershipNumber", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "expiresAt", "type": "uint256" }
    ],
    "name": "MembershipIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "cardId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "oldExpiresAt", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newExpiresAt", "type": "uint256" }
    ],
    "name": "MembershipRenewed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "cardId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "orgWallet", "type": "address" }
    ],
    "name": "MembershipRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "orgWallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "logoUrl", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "OrganizationRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "logoUrl", "type": "string" }
    ],
    "name": "registerOrganization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "memberWallet", "type": "address" },
      { "internalType": "string", "name": "memberName", "type": "string" },
      { "internalType": "string", "name": "membershipNumber", "type": "string" },
      { "internalType": "uint256", "name": "validityDays", "type": "uint256" },
      { "internalType": "string", "name": "metadataUri", "type": "string" }
    ],
    "name": "issueMembership",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "cardId", "type": "uint256" },
      { "internalType": "uint256", "name": "additionalDays", "type": "uint256" }
    ],
    "name": "renewMembership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "cardId", "type": "uint256" }
    ],
    "name": "revokeMembership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "cardId", "type": "uint256" },
      { "internalType": "bool", "name": "suspend", "type": "bool" }
    ],
    "name": "setSuspended",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "cardId", "type": "uint256" }
    ],
    "name": "verifyMembership",
    "outputs": [
      { "internalType": "bool", "name": "isValid", "type": "bool" },
      { "internalType": "string", "name": "effectiveStatus", "type": "string" },
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "orgWallet", "type": "address" },
          { "internalType": "address", "name": "memberWallet", "type": "address" },
          { "internalType": "string", "name": "memberName", "type": "string" },
          { "internalType": "string", "name": "membershipNumber", "type": "string" },
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
          { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "string", "name": "metadataUri", "type": "string" }
        ],
        "internalType": "struct MembershipCardRegistry.MembershipCard",
        "name": "card",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "address", "name": "wallet", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "logoUrl", "type": "string" },
          { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
          { "internalType": "bool", "name": "isRegistered", "type": "bool" }
        ],
        "internalType": "struct MembershipCardRegistry.Organization",
        "name": "org",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "cardId", "type": "uint256" }
    ],
    "name": "getMembership",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "orgWallet", "type": "address" },
          { "internalType": "address", "name": "memberWallet", "type": "address" },
          { "internalType": "string", "name": "memberName", "type": "string" },
          { "internalType": "string", "name": "membershipNumber", "type": "string" },
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
          { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "string", "name": "metadataUri", "type": "string" }
        ],
        "internalType": "struct MembershipCardRegistry.MembershipCard",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "memberWallet", "type": "address" }
    ],
    "name": "getMemberCards",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "orgWallet", "type": "address" }
    ],
    "name": "getOrgCards",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "organizations",
    "outputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "logoUrl", "type": "string" },
      { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
      { "internalType": "bool", "name": "isRegistered", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllOrganizations",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "wallet", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "logoUrl", "type": "string" },
          { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
          { "internalType": "bool", "name": "isRegistered", "type": "bool" }
        ],
        "internalType": "struct MembershipCardRegistry.Organization[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCardsIssued",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

