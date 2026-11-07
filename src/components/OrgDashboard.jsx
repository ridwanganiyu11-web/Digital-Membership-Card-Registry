import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Building2, Users, CheckCircle2, Clock, XCircle, PlusCircle, 
  RefreshCw, Ban, ShieldAlert, Sparkles, ExternalLink, QrCode
} from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contractData';
import DigitalCard from './DigitalCard';

export default function OrgDashboard({ onSelectVerify }) {
  const { address, isConnected } = useAccount();

  // Registration form states
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgLogo, setOrgLogo] = useState('');

  // Issue membership form states
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [memberWallet, setMemberWallet] = useState('');
  const [memberName, setMemberName] = useState('');
  const [membershipNo, setMembershipNo] = useState('');
  const [validityDays, setValidityDays] = useState('365');

  // Action states (Renew modal, preview modal)
  const [selectedCardForPreview, setSelectedCardForPreview] = useState(null);
  const [renewingCardId, setRenewingCardId] = useState(null);
  const [renewDays, setRenewDays] = useState('365');

  // Wagmi Write Hook
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read Org Info
  const { data: orgData, refetch: refetchOrg } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'organizations',
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" }
  });

  // Read Card IDs for this Org
  const { data: cardIds, refetch: refetchCards } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getOrgCards',
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" }
  });

  // Fetch full details of cards issued by this Org
  const [cardsList, setCardsList] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const isRegistered = orgData && orgData[5] === true; // isRegistered flag in struct

  useEffect(() => {
    if (isConfirmed) {
      refetchOrg();
      refetchCards();
      setShowIssueModal(false);
      setRenewingCardId(null);
      // Reset form
      setMemberWallet('');
      setMemberName('');
      setMembershipNo('');
    }
  }, [isConfirmed]);

  // Load cards details via public RPC or direct calls
  useEffect(() => {
    async function loadCardDetails() {
      if (!cardIds || cardIds.length === 0) {
        setCardsList([]);
        return;
      }
      setLoadingCards(true);
      try {
        const fetched = [];
        // Iterate backwards so newest cards are on top
        for (let i = cardIds.length - 1; i >= 0; i--) {
          const id = cardIds[i];
          try {
            const res = await fetch(import.meta.env.VITE_BOTCHAIN_RPC_URL || 'https://rpc.bohr.life', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_call',
                params: [{
                  to: CONTRACT_ADDRESS,
                  // getMembership(uint256) signature: 0x9fb75b5b
                  data: `0x9fb75b5b${BigInt(id).toString(16).padStart(64, '0')}`
                }, 'latest']
              })
            });
            // We can also compute fallback representations if RPC mock
          } catch (e) {
            console.error('Error fetching card:', e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCards(false);
      }
    }
    loadCardDetails();
  }, [cardIds]);

  // Handlers
  const handleRegisterOrg = (e) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'registerOrganization',
      args: [orgName, orgDesc, orgLogo],
    });
  };

  const handleIssueMembership = (e) => {
    e.preventDefault();
    if (!memberWallet || !memberName) return;
    const autoNumber = membershipNo.trim() || `MBR-${String(Math.floor(1000 + Math.random() * 9000))}`;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'issueMembership',
      args: [
        memberWallet,
        memberName,
        autoNumber,
        BigInt(validityDays || 365),
        ''
      ],
    });
  };

  const handleRenew = (cardId) => {
    if (!cardId) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'renewMembership',
      args: [BigInt(cardId), BigInt(renewDays || 365)],
    });
  };

  const handleRevoke = (cardId) => {
    if (!window.confirm(`Are you sure you want to permanently revoke card #${cardId}? This action cannot be undone.`)) {
      return;
    }
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'revokeMembership',
      args: [BigInt(cardId)],
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mb-2">
          Organization Management Portal
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
          Connect your organization's wallet to register your organization, issue verifiable digital membership cards, and manage your members on Botchain.
        </p>
        <div className="inline-block">
          <appkit-button />
        </div>
      </div>
    );
  }

  // If Organization is not yet registered, show onboarding form
  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Register Your Organization
              </h2>
              <p className="text-xs text-slate-400">
                Register on Botchain Testnet (Chain ID 968) to start issuing digital membership credentials.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterOrg} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Elite Business Network, Tech Guild, St. Paul Alumni"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Description / Purpose
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe your organization, school, club, or community..."
                value={orgDesc}
                onChange={(e) => setOrgDesc(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={orgLogo}
                onChange={(e) => setOrgLogo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This logo will appear in the top-left corner of all issued digital cards.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
              >
                {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Registering on Botchain...' : 'Register Organization on-Chain'}
              </button>
            </div>

            {writeError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-800">
                {writeError.shortMessage || writeError.message}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // When registered: Show full Organization Dashboard
  const orgProfile = {
    wallet: orgData[0],
    name: orgData[1],
    description: orgData[2],
    logoUrl: orgData[3],
    registeredAt: orgData[4],
  };

  const totalMembers = cardIds ? cardIds.length : 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Info Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-4 z-10">
          {orgProfile.logoUrl ? (
            <img 
              src={orgProfile.logoUrl} 
              alt="Logo" 
              className="w-16 h-16 rounded-2xl object-cover border border-white/20 bg-slate-900"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg">
              {orgProfile.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                {orgProfile.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                REGISTERED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2 max-w-xl">
              {orgProfile.description || 'Digital membership card issuer on Botchain Testnet.'}
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Org Address: {orgProfile.wallet}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto z-10">
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Membership Card</span>
          </button>
        </div>
      </div>

      {/* Metrics Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Members</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalMembers}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cards issued on-chain</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Cards</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{totalMembers}</div>
          <div className="text-[11px] text-slate-500 mt-1">Valid credentials</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Expired</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">0</div>
          <div className="text-[11px] text-slate-500 mt-1">Passed expiry date</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Revoked</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400 font-mono">0</div>
          <div className="text-[11px] text-slate-500 mt-1">Explicitly voided</div>
        </div>
      </div>

      {/* Roster & Issued Cards Management */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Issued Membership Cards
            </h2>
            <p className="text-xs text-slate-400">
              Manage member cards, extend renewals, or revoke credentials.
            </p>
          </div>
          <button 
            onClick={() => refetchCards()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {totalMembers === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-slate-400">No membership cards issued yet</p>
            <p className="text-xs mt-1">Click "Issue Membership Card" above to register your first member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Card ID</th>
                  <th className="px-6 py-3.5">Member Name</th>
                  <th className="px-6 py-3.5">Wallet Address</th>
                  <th className="px-6 py-3.5">Membership No.</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {cardIds.map((cId) => {
                  const idNum = Number(cId);
                  return (
                    <tr key={idNum} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">#{idNum}</td>
                      <td className="px-6 py-4 font-sans font-medium text-slate-200">
                        Member #{idNum}
                      </td>
                      <td className="px-6 py-4 text-sky-400">
                        {`Card #${idNum} Member`}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {`MBR-${String(idNum).padStart(6, '0')}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 font-sans">
                        <button
                          onClick={() => onSelectVerify && onSelectVerify(idNum)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold"
                        >
                          Verify Link
                        </button>
                        <button
                          onClick={() => setRenewingCardId(idNum)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleRevoke(idNum)}
                          className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-400 text-xs font-semibold"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Issue Membership Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    Issue Digital Membership Card
                  </h3>
                  <p className="text-xs text-slate-400">
                    Issuing directly on Botchain Testnet (Chain ID 968)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueMembership} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Member Wallet Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={memberWallet}
                  onChange={(e) => setMemberWallet(e.target.value.trim())}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Member Full Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganiyu Ridwan"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Membership No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBR-000125"
                    value={membershipNo}
                    onChange={(e) => setMembershipNo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Validity Period
                  </label>
                  <select
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="30">1 Month (30 Days)</option>
                    <option value="90">3 Months (90 Days)</option>
                    <option value="180">6 Months (180 Days)</option>
                    <option value="365">1 Year (365 Days)</option>
                    <option value="730">2 Years (730 Days)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Confirm in MetaMask...' : isConfirming ? 'Issuing Card on Botchain...' : 'Confirm & Issue Card'}
                </button>
              </div>

              {writeError && (
                <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-800">
                  {writeError.shortMessage || writeError.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {renewingCardId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Renew Membership #{renewingCardId}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Extend membership expiration timestamp on Botchain.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Extend By
              </label>
              <select
                value={renewDays}
                onChange={(e) => setRenewDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">1 Year (365 Days)</option>
                <option value="730">2 Years</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setRenewingCardId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenew(renewingCardId)}
                disabled={isPending || isConfirming}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white disabled:opacity-50"
              >
                {isConfirming ? 'Extending...' : 'Confirm Extension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

