import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { CreditCard, Sparkles, Building2, Search, ArrowUpRight, ShieldCheck, Loader2 } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contractData';
import { botchainTestnet } from '../config/botchain';
import DigitalCard from './DigitalCard';

const publicClient = createPublicClient({
  chain: botchainTestnet,
  transport: http(import.meta.env.VITE_BOTCHAIN_RPC_URL || 'https://rpc.bohr.life'),
});

export default function MyCards({ onSelectVerify, onGoToDashboard }) {
  const { address, isConnected } = useAccount();
  const [cardsList, setCardsList] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  // Fetch all card IDs belonging to this connected wallet
  const { data: memberCardIds, isLoading: loadingIds, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMemberCards',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" 
    }
  });

  // Fetch full details of each card owned by member
  useEffect(() => {
    async function fetchCardsDetails() {
      if (!memberCardIds || memberCardIds.length === 0) {
        setCardsList([]);
        return;
      }
      setLoadingCards(true);
      try {
        const loaded = [];
        for (const cardId of memberCardIds) {
          try {
            const cardData = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getMembership',
              args: [cardId],
            });
            
            // Also fetch org info
            const orgData = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'organizations',
              args: [cardData.orgWallet],
            });

            loaded.push({
              card: {
                id: Number(cardData.id),
                memberName: cardData.memberName,
                membershipNumber: cardData.membershipNumber,
                memberWallet: cardData.memberWallet,
                issuedAt: Number(cardData.issuedAt),
                expiresAt: Number(cardData.expiresAt),
                status: cardData.status,
              },
              org: {
                name: orgData[1],
                description: orgData[2],
                logoUrl: orgData[3],
                wallet: orgData[0],
              }
            });
          } catch (e) {
            console.error('Error fetching card detail:', e);
          }
        }
        setCardsList(loaded);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCards(false);
      }
    }

    fetchCardsDetails();
  }, [memberCardIds]);

  // Demo fallback cards if wallet is connected but contract hasn't minted cards to this wallet yet
  const demoCard = {
    id: 125,
    cardId: 125,
    memberName: 'GANIYU RIDWAN',
    membershipNumber: 'MBR-000125',
    issuedAt: Math.floor(Date.now() / 1000) - (86400 * 30),
    expiresAt: Math.floor(Date.now() / 1000) + (86400 * 335),
    status: 0,
    orgWallet: '0x72a91f09e25d2b388b146e27b9c9fbc216d2a91f'
  };

  const demoOrg = {
    name: 'ELITE BUSINESS NETWORK',
    description: 'Premier network of business executives and innovators.',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
  };

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
          Member Digital Identity Portal
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
          Connect your Web3 wallet (MetaMask or any supported wallet) to view, download, and share your official digital membership credentials issued on Botchain.
        </p>
        <div className="inline-block">
          <appkit-button />
        </div>
      </div>
    );
  }

  const hasOnChainCards = cardsList.length > 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            My Digital Membership Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Displaying verifiable credentials linked to your wallet address: <span className="text-sky-400 font-mono">{address}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => refetch()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Refresh Cards
          </button>
        </div>
      </div>

      {loadingCards && (
        <div className="flex items-center justify-center py-12 text-slate-400 space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          <span className="text-sm">Fetching on-chain membership cards from Botchain...</span>
        </div>
      )}

      {/* Cards Display Grid */}
      {!loadingCards && hasOnChainCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardsList.map((item) => (
            <div key={item.card.id} className="flex justify-center">
              <DigitalCard
                card={item.card}
                org={item.org}
                onSelectVerify={onSelectVerify}
              />
            </div>
          ))}
        </div>
      ) : !loadingCards && (
        <div className="space-y-8">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Live Card Preview</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No on-chain cards issued to your wallet yet
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              When an organization issues a membership card to your wallet on Botchain, it will appear here automatically. Below is what your card looks like:
            </p>

            <div className="flex justify-center mb-6">
              <DigitalCard
                card={demoCard}
                org={demoOrg}
                onSelectVerify={onSelectVerify}
              />
            </div>

            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs text-slate-400">Are you an organization leader?</span>
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300"
              >
                <span>Register your organization & issue cards</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
